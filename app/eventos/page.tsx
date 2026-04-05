import Link from "next/link";
import ScheduleClient from "@/app/components/ScheduleClient";
import { PageHero } from "@/app/components/site-sections";

export default function EventosPage() {
  return (
    <div className="space-y-12 pb-8 sm:space-y-16">
      <PageHero
        eyebrow="Eventos e agenda"
        title="Calendário acadêmico"
        description="Consulte a programação, navegue pelos meses e veja os detalhes de cada dia."
        actions={
          <>
            <Link
              href="#calendario"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
            >
              Ir para o calendário
            </Link>
            <Link
              href="/ouvidoria"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(9,66,125,0.2)] bg-[rgba(239,246,255,0.92)] px-5 py-3 text-sm font-semibold text-[var(--brand-900)] shadow-[0_14px_32px_rgba(7,48,89,0.08)] hover:border-[rgba(9,66,125,0.34)] hover:bg-white hover:text-[var(--brand-950)] dark:border-white/20 dark:bg-white/12 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/18"
            >
              Comunicar conflito ou dúvida
            </Link>
          </>
        }
        aside={
          <div className="glass-panel-strong surface-outline relative overflow-hidden rounded-[28px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(243,247,252,0.94)_100%)] px-5 py-5 shadow-[0_24px_64px_rgba(4,26,49,0.14)] dark:border-white/12 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92)_0%,rgba(2,6,23,0.86)_100%)]">
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(9,66,125,0.35)] to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,143,214,0.14),transparent_42%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Agenda</p>
              <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Consulta mensal e detalhe diário.</p>
            </div>
          </div>
        }
      />

      <section id="calendario" className="page-shell">
        <ScheduleClient />
      </section>
    </div>
  );
}
