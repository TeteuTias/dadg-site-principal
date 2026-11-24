import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Award, CalendarCheck, ClipboardList, Presentation } from "lucide-react";

const VANTAGENS = [
  { icone: CalendarCheck, texto: "Inscrição em eventos e controle de presença" },
  { icone: Award, texto: "Seus certificados, sempre à mão" },
  { icone: ClipboardList, texto: "Processos seletivos do DADG" },
  { icone: Presentation, texto: "A mesma conta vale para o Congresso CIEPS" },
];

/**
 * Moldura das telas de /entrar (sem header/rodapé do site): lado da marca (computador) + formulário.
 * `voltar`: site de onde a pessoa veio (padrão: home do DADG).
 */
export function Moldura({ titulo, subtitulo, site, voltar = "/", children }: { titulo: string; subtitulo?: ReactNode; site?: string; voltar?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] items-center py-6 sm:py-10">
      <div className="page-shell w-full">
        <div className="mx-auto mb-4 max-w-5xl">
          <a href={voltar} className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar para o site
          </a>
        </div>
        <div className="glass-panel-strong surface-outline mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-white/70 shadow-[0_30px_80px_rgba(7,48,89,0.14)] dark:border-white/10 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="relative hidden overflow-hidden bg-[#001f45] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(79,143,214,0.35),transparent_45%),radial-gradient(circle_at_10%_95%,rgba(217,192,124,0.18),transparent_40%)]" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-[0.07]" />

            <Link href="/" className="relative flex w-fit items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-full border border-white/30 bg-white">
                <Image src="/logoDadg02.png" alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.32em] text-blue-200/80">DADG</span>
                <span className="block text-sm font-medium text-white">Imepac Araguari</span>
              </span>
            </Link>

            <div className="relative">
              <p className="font-serif text-[2.3rem] leading-[1.1]">Uma conta para toda a sua vida acadêmica.</p>
              <ul className="mt-8 space-y-4">
                {VANTAGENS.map(({ icone: Icone, texto }) => (
                  <li key={texto} className="flex items-center gap-3 text-[15px] text-blue-50/85">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                      <Icone className="h-[18px] w-[18px] text-blue-200" strokeWidth={1.8} />
                    </span>
                    {texto}
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative text-xs text-blue-200/50">DADG · Congresso CIEPS</p>
          </aside>

          <main className="px-5 py-9 sm:px-10 sm:py-12">
            <div className="mx-auto w-full max-w-sm">
              <Link href="/" className="mb-8 flex w-fit items-center gap-3 lg:hidden">
                <span className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white dark:border-white/20">
                  <Image src="/logoDadg02.png" alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">DADG</span>
              </Link>
              {site ? (
                <p className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-medium text-[var(--brand-800)] dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-500)]" />
                  <span className="truncate">Entrando em <strong className="font-semibold">{site}</strong></span>
                </p>
              ) : null}
              <h1 className="font-serif text-3xl font-bold text-[#002B5B] sm:text-[2.1rem] dark:text-white">{titulo}</h1>
              {subtitulo ? <p className="mt-2 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">{subtitulo}</p> : null}
              <div className="mt-7">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
