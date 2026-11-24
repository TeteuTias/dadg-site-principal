"use server";

import { headers } from "next/headers";
import { zitadel, ZitadelError } from "@/lib/zitadel/api";
import { guardarPedido, guardarSessao, lerEstado, salvarEstado } from "@/lib/zitadel/cookie";
import { ERRO_PEDIDO, emailValido, finalizar, lerConfig, lerRegras, mensagem, normalizarEmail, pedidoValido, texto, userIdValido, type Resultado } from "@/lib/zitadel/fluxo";
import { LIMITES, limitador } from "@/lib/zitadel/limite";
import { senhaOk } from "@/lib/zitadel/senha";

const ERRO_LOGIN = "E-mail ou senha incorretos.";
const ERRO_BLOQUEIO =
  "Por segurança, sua conta foi bloqueada depois de várias tentativas com senha errada. Use “Esqueci minha senha” ou fale com a gente pela Ouvidoria ou pelo e-mail dadg.imepac@gmail.com.";

const ERRO_LIMITE = "Muitas tentativas. Tente de novo em alguns minutos.";

/** O Caddy sempre define X-Real-IP (o app só escuta em localhost); em dev não há proxy. */
async function ipCliente() {
  return (await headers()).get("x-real-ip")?.trim() || "local";
}

const pedidoDe = (fd: FormData) => {
  const v = texto(fd, "authRequest");
  return pedidoValido(v) ? v : undefined;
};

/** Depois de ter a sessão: finaliza o pedido ou, sem pedido, só confirma. */
async function seguir(authRequest: string | undefined, sessao: { sessionId: string; sessionToken: string }): Promise<Resultado> {
  if (!authRequest) return { ok: "Pronto, você entrou. Volte ao site para continuar." };
  try {
    const destino = await finalizar(authRequest, sessao);
    if (!destino.startsWith("/entrar/")) {
      const atual = await lerEstado();
      await salvarEstado({ ...atual, authRequest: undefined }); // pedido já usado
    }
    return { ir: destino };
  } catch (e) {
    return { erro: e instanceof ZitadelError && e.status < 500 ? ERRO_PEDIDO : mensagem(e) };
  }
}

export async function entrar(fd: FormData): Promise<Resultado> {
  const email = normalizarEmail(texto(fd, "email"));
  const senha = String(fd.get("senha") ?? "");
  const authRequest = pedidoDe(fd);
  const campos: Record<string, string> = {};
  if (!emailValido(email)) campos.email = "Informe um e-mail válido.";
  if (!senha) campos.senha = "Informe sua senha.";
  if (Object.keys(campos).length) return { campos };
  if (!limitador.consumir(LIMITES.entrar(await ipCliente()))) return { erro: ERRO_LIMITE };

  let sessao;
  try {
    sessao = await zitadel.sessaoComSenha(email, senha);
  } catch (e) {
    if (e instanceof ZitadelError && e.bloqueado) return { erro: ERRO_BLOQUEIO };
    if (e instanceof ZitadelError && e.status < 500) return { erro: ERRO_LOGIN };
    return { erro: mensagem(e) };
  }
  let nome = email;
  try {
    nome = (await zitadel.lerSessao(sessao.sessionId)).factors?.user?.displayName || email;
  } catch { /* nome é só para exibir */ }
  await guardarSessao({ ...sessao, loginName: email, nome }, authRequest);
  return seguir(authRequest, sessao);
}

/** "Continuar como fulano": usa uma sessão já guardada no cookie. */
export async function continuarComo(sessionId: string, authRequestBruto: string): Promise<Resultado> {
  if (!pedidoValido(authRequestBruto)) return { erro: ERRO_PEDIDO };
  const sessao = (await lerEstado()).sessoes.find((s) => s.sessionId === sessionId);
  if (!sessao) return { erro: "Essa sessão expirou. Entre com seu e-mail e senha." };
  return seguir(authRequestBruto, sessao);
}

export async function entrarComGoogle(authRequestBruto: string): Promise<Resultado> {
  if (!pedidoValido(authRequestBruto)) return { erro: ERRO_PEDIDO };
  if (!limitador.consumir(LIMITES.google(await ipCliente()))) return { erro: ERRO_LIMITE };
  try {
    await guardarPedido(authRequestBruto);
    const url = await zitadel.iniciarGoogle(authRequestBruto);
    if (!url) return { erro: "Não foi possível abrir o login do Google agora. Tente de novo." };
    return { ir: url };
  } catch (e) {
    return { erro: mensagem(e, "Não foi possível abrir o login do Google agora. Tente de novo.") };
  }
}

export async function cadastrar(fd: FormData): Promise<Resultado> {
  const givenName = texto(fd, "nome");
  const familyName = texto(fd, "sobrenome");
  const email = normalizarEmail(texto(fd, "email"));
  const senha = String(fd.get("senha") ?? "");
  const confirmar = String(fd.get("confirmar") ?? "");
  const authRequest = pedidoDe(fd);

  if (!(await lerConfig()).cadastro) return { erro: "O cadastro de novas contas está desativado no momento." };
  const regras = await lerRegras();
  const campos: Record<string, string> = {};
  if (!givenName) campos.nome = "Informe seu nome.";
  if (!familyName) campos.sobrenome = "Informe seu sobrenome.";
  if (!emailValido(email)) campos.email = "Informe um e-mail válido.";
  if (!senhaOk(senha, regras)) campos.senha = "A senha não atende a todas as regras.";
  if (senha !== confirmar) campos.confirmar = "As senhas não são iguais.";
  if (Object.keys(campos).length) return { campos };
  if (!limitador.consumir(LIMITES.cadastro(await ipCliente()))) return { erro: ERRO_LIMITE };

  let userId: string;
  try {
    userId = await zitadel.criarUsuario({ email, givenName, familyName, password: senha });
  } catch (e) {
    if (e instanceof ZitadelError && e.jaExiste)
      return { campos: { email: "Já existe uma conta com este e-mail. Entre com ela ou use “Esqueci minha senha”." } };
    if (e instanceof ZitadelError && e.status === 400) return { erro: "Confira os dados: o servidor recusou o cadastro (a senha pode não atender às regras)." };
    return { erro: mensagem(e) };
  }
  try {
    const sessao = await zitadel.sessaoComSenha(email, senha);
    await guardarSessao({ ...sessao, loginName: email, nome: `${givenName} ${familyName}` }, authRequest);
  } catch {
    await guardarPedido(authRequest); // sem sessão, a pessoa entra de novo depois de confirmar
  }
  return { ir: `/entrar/verificar-email?userId=${encodeURIComponent(userId)}&enviado=1` };
}

export async function verificarEmail(userId: string, codigo: string): Promise<Resultado> {
  if (!userIdValido(userId)) return { erro: "Link incompleto. Volte ao site e entre de novo." };
  if (!codigo.trim()) return { campos: { codigo: "Informe o código que enviamos por e-mail." } };
  try {
    await zitadel.verificarEmail(userId, codigo.trim());
  } catch (e) {
    if (e instanceof ZitadelError && e.status < 500)
      return { erro: "Código inválido ou expirado. Peça um novo código abaixo." };
    return { erro: mensagem(e) };
  }
  // Se esta é a mesma pessoa que estava entrando neste navegador, segue o login.
  const estado = await lerEstado();
  if (estado.authRequest) {
    for (const s of estado.sessoes) {
      try {
        if ((await zitadel.lerSessao(s.sessionId)).factors?.user?.id === userId) return seguir(estado.authRequest, s);
      } catch { /* sessão expirada: tenta a próxima */ }
    }
    return { ok: "E-mail confirmado! Agora é só entrar.", voltar: `/entrar/login?authRequest=${estado.authRequest}` };
  }
  return { ok: "E-mail confirmado! Agora é só voltar ao site e entrar." };
}

export async function reenviarCodigo(userId: string): Promise<Resultado> {
  if (!userIdValido(userId)) return { erro: "Link incompleto. Volte ao site e entre de novo." };
  if (!limitador.consumir(LIMITES.reenviar(await ipCliente(), userId))) return { erro: ERRO_LIMITE };
  try {
    await zitadel.reenviarEmail(userId);
  } catch (e) {
    // e-mail já confirmado também cai aqui
    return { erro: mensagem(e, "Não foi possível reenviar agora. Se o e-mail já estiver confirmado, é só entrar.") };
  }
  return { ok: "Enviamos um novo e-mail de confirmação. Confira também a caixa de spam." };
}

export async function esqueciSenha(fd: FormData): Promise<Resultado> {
  const email = normalizarEmail(texto(fd, "email"));
  if (!emailValido(email)) return { campos: { email: "Informe um e-mail válido." } };
  await guardarPedido(pedidoDe(fd)).catch(() => undefined);
  const OK = { ok: "Se existir uma conta com esse e-mail, enviamos um link para criar uma nova senha. Confira também a caixa de spam." };
  // Acima do limite: mesma resposta de sempre, só não envia.
  if (!limitador.consumir(LIMITES.esqueci(await ipCliente(), email))) return OK;
  try {
    const userId = await zitadel.buscarPorEmail(email);
    if (userId) await zitadel.pedirNovaSenha(userId);
  } catch (e) {
    if (!(e instanceof ZitadelError) || e.status >= 500) return { erro: mensagem(e) };
    // erros 4xx não podem revelar se a conta existe
  }
  return OK;
}

export async function novaSenha(fd: FormData): Promise<Resultado> {
  const userId = texto(fd, "userId");
  const codigo = texto(fd, "code");
  const senha = String(fd.get("senha") ?? "");
  const confirmar = String(fd.get("confirmar") ?? "");
  if (!userIdValido(userId) || !codigo) return { erro: "Link incompleto. Peça um novo e-mail em “Esqueci minha senha”." };
  const regras = await lerRegras();
  const campos: Record<string, string> = {};
  if (!senhaOk(senha, regras)) campos.senha = "A senha não atende a todas as regras.";
  if (senha !== confirmar) campos.confirmar = "As senhas não são iguais.";
  if (Object.keys(campos).length) return { campos };
  try {
    await zitadel.definirSenha(userId, senha, codigo);
  } catch (e) {
    if (e instanceof ZitadelError && e.status < 500)
      return { erro: "Este link expirou ou já foi usado. Peça um novo em “Esqueci minha senha”." };
    return { erro: mensagem(e) };
  }
  const { authRequest } = await lerEstado();
  return {
    ok: "Senha alterada! Agora você já pode entrar com a nova senha.",
    voltar: authRequest ? `/entrar/login?authRequest=${authRequest}` : undefined,
  };
}
