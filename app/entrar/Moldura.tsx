import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

/**
 * Moldura das telas de /entrar (sem header/rodapé do site).
 * Computador: foto real do IMEPAC à esquerda (identidade do DADG) e o formulário numa folha clara à direita.
 * Celular: faixa com a foto e a marca no topo, formulário logo abaixo.
 * `voltar`: site de onde a pessoa veio (padrão: home do DADG). `site` continua aceito pelas páginas, mas não aparece mais na tela.
 */
const GRADE = "-mb-16 grid min-h-[100dvh] bg-[#f7f5f0] dark:bg-[#06111f] md:mb-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]";
const FOLHA = "relative -mt-6 rounded-t-[28px] bg-[#f7f5f0] px-5 pb-12 pt-8 dark:bg-[#06111f] sm:px-10 lg:mt-0 lg:flex lg:min-h-[100dvh] lg:flex-col lg:rounded-none lg:px-16 lg:py-10";

/** Foto + marca. A foto vai no arquivo original (1800 px, `unoptimized`): a versão otimizada do Next escolhia ~1080 px pela
 * largura da coluna e esticava para a altura da tela, o que deixava a foto pixelada no computador. */
function Lateral() {
  return (
      <aside className="relative h-48 overflow-hidden bg-[var(--brand-950)] sm:h-56 lg:sticky lg:top-0 lg:h-[100dvh]">
        <Image src="/imepac-hero.jpg" alt="Prédio histórico do IMEPAC em Araguari" fill priority unoptimized className="object-cover object-[50%_40%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,26,49,0.96)] via-[rgba(4,26,49,0.5)] to-[rgba(4,26,49,0.12)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(4,26,49,0.78)] to-transparent lg:h-40" />

        <Link href="/" className="absolute left-5 top-5 flex items-center gap-3 sm:left-8 sm:top-7 lg:left-12 lg:top-10">
          <span className="relative h-11 w-11 overflow-hidden rounded-full bg-white ring-1 ring-white/40 lg:h-12 lg:w-12">
            <Image src="/logoDadg02.png" alt="" fill sizes="48px" className="object-cover" />
          </span>
          <span className="leading-tight text-white">
            <span className="block text-sm font-semibold tracking-[0.24em]">DADG</span>
            <span className="block text-xs text-white/70">IMEPAC Araguari</span>
          </span>
        </Link>

        <div className="absolute inset-x-0 bottom-0 hidden p-12 text-white lg:block">
          <span className="block h-px w-14 bg-[#d9c07c]" />
          <p className="mt-6 max-w-md font-serif text-[2.6rem] leading-[1.08] text-balance">Uma conta para toda a sua vida acadêmica.</p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
            Eventos, certificados, processos seletivos e o Congresso CIEPS no mesmo login.
          </p>
          <p className="mt-10 text-xs tracking-wide text-white/50">Diretório Acadêmico Diogo Guimarães</p>
        </div>
      </aside>
  );
}

export function Moldura({ titulo, subtitulo, voltar = "/", children }: { titulo: string; subtitulo?: ReactNode; site?: string; voltar?: string; children: ReactNode }) {
  // -mb-16: o layout raiz reserva pb-16 no celular para o menu de baixo, que não aparece no /entrar
  return (
    <div className={GRADE}>
      <Lateral />

      {/* Formulário (entra com um fade curto; quem pede menos movimento não vê a animação) */}
      <main className={FOLHA}>
        <a href={voltar} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm text-slate-500 transition hover:text-[var(--brand-900)] dark:text-slate-400 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar para o site
        </a>

        <div className="mx-auto mt-6 w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none lg:my-auto lg:mt-0">
          <h1 className="font-serif text-[2.1rem] font-bold leading-tight text-[var(--brand-950)] sm:text-[2.4rem] dark:text-white">{titulo}</h1>
          {subtitulo ? <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{subtitulo}</p> : null}
          <div className="mt-8">{children}</div>
        </div>

        <p className="mx-auto mt-12 w-full max-w-[380px] text-xs text-slate-400 dark:text-slate-500 lg:mt-0">
          DADG · Congresso CIEPS ·{" "}
          <Link href="/privacidade" className="underline-offset-2 hover:underline">Privacidade</Link> ·{" "}
          <Link href="/termos" className="underline-offset-2 hover:underline">Termos</Link>
        </p>
      </main>
    </div>
  );
}

/** Esqueleto da troca de página do /entrar (app/entrar/loading.tsx): mesma foto à esquerda e blocos no lugar do formulário. */
export function MolduraEsqueleto() {
  const barra = "rounded-lg bg-slate-200/80 dark:bg-white/10";
  return (
    <div className={GRADE} aria-busy="true" aria-live="polite">
      <Lateral />
      <main className={FOLHA}>
        <div className={`${barra} h-11 w-40 animate-pulse`} />
        <div className="mx-auto mt-6 w-full max-w-[380px] animate-pulse lg:my-auto lg:mt-0">
          <span className="sr-only">Carregando...</span>
          <div className={`${barra} h-10 w-3/4`} />
          <div className={`${barra} mt-4 h-4 w-full`} />
          <div className={`${barra} mt-2 h-4 w-2/3`} />
          <div className={`${barra} mt-10 h-12 w-full rounded-xl`} />
          <div className={`${barra} mt-6 h-4 w-24`} />
          <div className={`${barra} mt-2 h-12 w-full rounded-xl`} />
          <div className={`${barra} mt-4 h-4 w-24`} />
          <div className={`${barra} mt-2 h-12 w-full rounded-xl`} />
          <div className="mt-8 h-12 w-full rounded-xl bg-[rgba(4,26,49,0.14)] dark:bg-white/10" />
        </div>
        <div className={`${barra} mx-auto mt-12 h-3 w-[220px] lg:mt-0`} />
      </main>
    </div>
  );
}
