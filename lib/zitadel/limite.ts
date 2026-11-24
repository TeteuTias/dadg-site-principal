/**
 * Limite de tentativas em memória (janela fixa).
 * shortcut: vale para um processo só (o site roda em um processo na VPS); com mais instâncias, mover para Redis/Mongo.
 */
type Janela = { contagem: number; venceEm: number };
export type Regra = { chave: string; max: number; janelaMs: number };

export function criarLimitador(agora: () => number = Date.now) {
  const mapa = new Map<string, Janela>();
  let proximaLimpeza = 0;

  function limpar(t: number) {
    if (t < proximaLimpeza) return;
    proximaLimpeza = t + 60_000;
    for (const [chave, j] of mapa) if (j.venceEm <= t) mapa.delete(chave);
  }

  /** Só consome se TODAS as regras permitirem; assim um limite estourado não gasta a cota dos outros. */
  function consumir(regras: Regra[]): boolean {
    const t = agora();
    limpar(t);
    const atuais = regras.map((r) => {
      const j = mapa.get(r.chave);
      return j && j.venceEm > t ? j : undefined;
    });
    if (regras.some((r, i) => (atuais[i]?.contagem ?? 0) >= r.max)) return false;
    regras.forEach((r, i) => {
      const j = atuais[i];
      if (j) j.contagem += 1;
      else mapa.set(r.chave, { contagem: 1, venceEm: t + r.janelaMs });
    });
    return true;
  }

  return { consumir, tamanho: () => mapa.size };
}

const MIN = 60_000;
const HORA = 60 * MIN;

export const LIMITES = {
  entrar: (ip: string): Regra[] => [{ chave: `entrar:ip:${ip}`, max: 20, janelaMs: 10 * MIN }],
  cadastro: (ip: string): Regra[] => [{ chave: `cadastro:ip:${ip}`, max: 5, janelaMs: HORA }],
  esqueci: (ip: string, email: string): Regra[] => [
    { chave: `esqueci:ip:${ip}`, max: 10, janelaMs: HORA },
    { chave: `esqueci:email:${email.toLowerCase()}`, max: 3, janelaMs: HORA },
  ],
  // Por conta (userId): é o que a tela tem em mãos; equivale a "por e-mail".
  reenviar: (ip: string, userId: string): Regra[] => [
    { chave: `reenviar:ip:${ip}`, max: 10, janelaMs: HORA },
    { chave: `reenviar:conta:${userId}`, max: 3, janelaMs: HORA },
  ],
  google: (ip: string): Regra[] => [{ chave: `google:ip:${ip}`, max: 30, janelaMs: 10 * MIN }],
};

export const limitador = criarLimitador();
