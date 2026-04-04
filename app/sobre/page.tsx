import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { InfoCard, PageHero } from "@/app/components/site-sections";

export default function SobrePage() {
  return (
    <div className="space-y-12 pb-8 sm:space-y-14">
      <PageHero
        eyebrow="Sobre"
        title="DADG ImePAC Araguari"
        description="Representacao estudantil, integracao academica e apoio as iniciativas que fortalecem a formacao em medicina."
        aside={
          <div className="glass-panel surface-outline rounded-[28px] border border-white/70 p-5 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-[20px] border border-white/70 bg-white">
                <Image src="/logoDadg02.png" alt="Logo DADG" fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Institucional</p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">Diretorio Academico Diogo Guimaraes</p>
              </div>
            </div>
          </div>
        }
      />

      <section className="page-shell grid gap-5 lg:grid-cols-3">
        <InfoCard
          title="Quem somos"
          description="Entidade representativa dos estudantes de Medicina do ImePAC, comprometida com organizacao, integracao e vida academica."
        />
        <InfoCard
          title="Missao"
          description="Representar e defender os interesses dos estudantes, promovendo atividades academicas, culturais e sociais."
        />
        <InfoCard
          title="Valores"
          description="Excelencia academica, etica, transparencia, colaboracao e responsabilidade social."
        />
      </section>

      <section className="page-shell">
        <InfoCard
          title="Historia"
          description="O DADG foi consolidado para fortalecer a voz estudantil e organizar iniciativas que ampliem a experiencia universitaria e a formacao medica."
        >
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-900)]"
          >
            Falar com o DADG
            <ArrowRight className="h-4 w-4" />
          </Link>
        </InfoCard>
      </section>
    </div>
  );
}
