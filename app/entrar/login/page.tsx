import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { zitadel, sessaoValida, type AuthRequest } from "@/lib/zitadel/api";
import { lerEstado } from "@/lib/zitadel/cookie";
import { ERRO_PEDIDO, finalizar, lerConfig, origemDoPedido, pedidoValido, siteDoPedido, temPrompt } from "@/lib/zitadel/fluxo";
import { Aviso, ContinuarComo, FormLogin } from "../Formularios";
import { Moldura } from "../Moldura";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LoginPage({ searchParams }: Props) {
  const q = await searchParams;
  const authRequest = typeof q.authRequest === "string" && pedidoValido(q.authRequest) ? q.authRequest : undefined;

  if (!authRequest) {
    return (
      <Moldura titulo="Conta DADG" subtitulo="Esta é a tela de login dos sites do DADG e do Congresso CIEPS.">
        <div className="grid gap-5">
          <Aviso tom="info">Para entrar, comece pelo site que você quer usar e clique em “Entrar” lá. Você será trazido para cá.</Aviso>
          <a href="https://www.dadg.com.br" className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--brand-900)] px-5 text-[15px] font-semibold text-white hover:bg-[var(--brand-800)] dark:bg-blue-600 dark:hover:bg-blue-500">
            Ir para o site do DADG
          </a>
        </div>
      </Moldura>
    );
  }

  let pedido: AuthRequest;
  try {
    pedido = await zitadel.lerPedido(authRequest);
  } catch {
    return (
      <Moldura titulo="Link expirado">
        <Aviso tom="erro">{ERRO_PEDIDO}</Aviso>
      </Moldura>
    );
  }

  if (temPrompt(pedido, "create")) redirect(`/entrar/cadastro?authRequest=${authRequest}`);

  const site = siteDoPedido(pedido);
  const voltar = origemDoPedido(pedido);
  const forcarLogin = temPrompt(pedido, "login") || q.outra === "1";
  const escolherConta = temPrompt(pedido, "select_account");
  const erroGoogle = q.erro === "google" ? "Não foi possível entrar com o Google. Tente de novo ou use seu e-mail e senha." : undefined;

  // SSO: sessões deste navegador que o servidor de login ainda aceita.
  const { sessoes } = await lerEstado();
  const validas = forcarLogin
    ? []
    : (
        await Promise.all(
          sessoes.map(async (s) => {
            try {
              const d = await zitadel.lerSessao(s.sessionId);
              return sessaoValida(d) ? { ...s, nome: d.factors?.user?.displayName || s.nome } : null;
            } catch {
              return null;
            }
          }),
        )
      ).filter((s): s is NonNullable<typeof s> => s !== null);

  if (validas.length && !escolherConta && !erroGoogle) {
    let destino: string | undefined;
    try {
      destino = await finalizar(authRequest, validas[0]);
    } catch {
      // cai na escolha de conta abaixo
    }
    if (destino) redirect(destino); // fora do try: redirect() funciona lançando
  }

  const config = await lerConfig();

  if (validas.length) {
    return (
      <Moldura titulo="Bem-vindo de volta" subtitulo="Escolha a conta para continuar." site={site} voltar={voltar}>
        <ContinuarComo authRequest={authRequest} contas={validas.map(({ sessionId, nome, loginName }) => ({ sessionId, nome, loginName }))} />
      </Moldura>
    );
  }

  return (
    <Moldura titulo="Entrar" subtitulo="Use sua conta DADG: a mesma para todos os sites do DADG e do Congresso CIEPS." site={site} voltar={voltar}>
      <FormLogin authRequest={authRequest} loginHint={pedido.loginHint} erroInicial={erroGoogle} google={config.google} cadastro={config.cadastro} />
    </Moldura>
  );
}
