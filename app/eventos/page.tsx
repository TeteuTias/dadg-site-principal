import Link from "next/link";
import ScheduleClient from "@/app/components/ScheduleClient";
import { PageHero } from "@/app/components/site-sections";

export default function EventosPage() {
  return (
    <div className="space-y-12 pb-8 sm:space-y-16">
      <PageHero
        eyebrow="Eventos e agenda"
        title="Calendario academico"
        description="Consulte a programacao, navegue pelos meses e veja os detalhes de cada dia."
        actions={
          <>
            <Link
              href="#calendario"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
            >
              Ir para o calendario
            </Link>
            <Link
              href="/ouvidoria"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(9,66,125,0.16)] bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-[rgba(9,66,125,0.26)] hover:text-slate-950"
            >
              Comunicar conflito ou duvida
            </Link>
          </>
        }
        aside={
          <div className="rounded-[28px] border border-white/70 bg-white/82 px-5 py-5 shadow-[0_18px_40px_rgba(7,48,89,0.08)] dark:border-white/10 dark:bg-slate-900/72">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Agenda</p>
            <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Consulta mensal e detalhe diario.</p>
          </div>
        }
      />

      <section id="calendario" className="page-shell">
        <ScheduleClient />
      </section>
    </div>
  );
}
