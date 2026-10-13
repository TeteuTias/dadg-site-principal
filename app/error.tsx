"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { PageHero } from "@/app/components/site-sections";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="min-h-[70dvh] pt-28 pb-16">
      <PageHero
        eyebrow="Algo deu errado"
        title="Não foi possível carregar esta página"
        description="Tente novamente em instantes. Se o problema continuar, avise a gente pela ouvidoria."
        actions={
          <>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-900)] dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <RotateCcw className="h-4 w-4" />
              Tentar novamente
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-[var(--brand-800)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
            >
              Voltar ao início
            </Link>
          </>
        }
      />
    </div>
  );
}
