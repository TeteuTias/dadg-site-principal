import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/app/components/site-sections";

export default function NotFound() {
  return (
    <div className="min-h-[70dvh] pt-28 pb-16">
      <PageHero
        eyebrow="Erro 404"
        title="Página não encontrada"
        description="O endereço pode ter mudado ou não existe mais. Volte ao início ou procure o que precisa pela busca de certificados."
        actions={
          <>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-900)] dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Voltar ao início
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/certificados"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(9,66,125,0.14)] bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-[var(--brand-800)] dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
            >
              Buscar certificado
            </Link>
          </>
        }
      />
    </div>
  );
}
