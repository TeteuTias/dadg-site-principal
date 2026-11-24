/** Regras de senha do servidor de login, já no formato que o formulário usa (vale no cliente e no servidor). */
export type Regras = { min: number; maiuscula: boolean; minuscula: boolean; numero: boolean; simbolo: boolean };

// Padrão do Zitadel, usado se a leitura das regras falhar.
export const REGRAS_PADRAO: Regras = { min: 8, maiuscula: true, minuscula: true, numero: true, simbolo: true };

export function checarSenha(senha: string, r: Regras) {
  return [
    { texto: `Pelo menos ${r.min} caracteres`, ok: senha.length >= r.min },
    ...(r.maiuscula ? [{ texto: "Uma letra maiúscula", ok: /[A-Z]/.test(senha) }] : []),
    ...(r.minuscula ? [{ texto: "Uma letra minúscula", ok: /[a-z]/.test(senha) }] : []),
    ...(r.numero ? [{ texto: "Um número", ok: /[0-9]/.test(senha) }] : []),
    ...(r.simbolo ? [{ texto: "Um símbolo (ex.: ! @ # ?)", ok: /[^A-Za-z0-9]/.test(senha) }] : []),
  ];
}

export const senhaOk = (senha: string, r: Regras) => checarSenha(senha, r).every((c) => c.ok);
