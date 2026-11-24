/** Regras puras do login (sem rede nem cookies), separadas para teste. */

export type Usuario = { sub: string; email?: string; email_verified?: boolean; name?: string; picture?: string };
export type Cookie = { name: string; value: string };

// Valor de cada parte; com nome e atributos o cabeçalho fica abaixo de ~3,8 KB (limite do navegador: 4 KB).
export const MAX_PARTE = 3600;

/** Divide o valor em `nome.0`, `nome.1`, ... */
export function dividir(nome: string, valor: string, max = MAX_PARTE): Cookie[] {
  const partes: Cookie[] = [];
  for (let i = 0; i * max < valor.length; i++) partes.push({ name: `${nome}.${i}`, value: valor.slice(i * max, (i + 1) * max) });
  return partes;
}

/** Junta as partes em sequência; para na primeira que faltar. */
export function juntar(nome: string, cookies: Cookie[]): string {
  const mapa = new Map(cookies.map((c) => [c.name, c.value]));
  let valor = "";
  for (let i = 0; mapa.has(`${nome}.${i}`); i++) valor += mapa.get(`${nome}.${i}`);
  return valor;
}

/** Cookies do nome (inclusive o antigo do Auth0, sem sufixo) que não fazem parte da gravação atual. */
export function sobras(nome: string, existentes: Cookie[], atuais: Cookie[]): string[] {
  const manter = new Set(atuais.map((c) => c.name));
  return existentes.map((c) => c.name).filter((n) => (n === nome || n.startsWith(`${nome}.`) || n.startsWith(`${nome}__`)) && !manter.has(n));
}

/** Só caminho do próprio site: começa com "/", sem "//", "\" nem caracteres de controle. */
export function retornoSeguro(valor: string | null | undefined): string {
  // eslint-disable-next-line no-control-regex -- recusar tab/quebra de linha, que o navegador descarta e viram "//"
  return typeof valor === "string" && /^\/(?![/\\])[^\\\x00-\x1f\x7f]*$/.test(valor) ? valor : "/";
}

/** ?prompt=create|login; o antigo ?screen_hint=signup do Auth0 vira create. */
export function promptPedido(q: URLSearchParams): "create" | "login" | undefined {
  const p = q.get("prompt");
  if (p === "create" || p === "login") return p;
  return q.get("screen_hint") === "signup" ? "create" : undefined;
}
