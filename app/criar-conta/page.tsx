import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/app/components/site-sections";

const SIGNUP = "/api/auth/login?screen_hint=signup&returnTo=%2Fperfil";
const LOGIN = "/api/auth/login?returnTo=%2Fperfil";

// Os certificados antigos são encontrados pelo e-mail, pelo CPF e pelo nome da época:
// orientar antes do cadastro evita pedidos manuais depois.
const STEPS = [
  {
    title: "Use o e-mail das suas inscrições",
    text: "Cadastre-se com o e-mail que você usava para se inscrever nos eventos do DADG. É por ele que encontramos seus certificados antigos.",
  },
  {
    title: "Preencha o perfil como nos certificados",
    text: "Informe seu nome completo, sem abreviações, e o seu CPF. Se você usou outro e-mail nas inscrições, nome e CPF iguais aos dos certificados ainda permitem encontrá-los.",
  },
  {
    title: "Faltou algum certificado?",
    text: "Em Meus certificados, peça o vínculo com o código que aparece na consulta pública. A organização confere e responde.",
  },
];

export default function Signup() {
  return (
    <div className="space-y-12 pt-28 pb-12">
      <PageHero
        eyebrow="Área do aluno"
        title="Criar conta"
        description="Com a conta você se inscreve nos eventos, acompanha sua presença e reúne seus certificados em um só lugar."
        actions={
          <>
            <a
              href={SIGNUP}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-900)] dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Continuar para o cadastro
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={LOGIN}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-[var(--brand-800)] dark:border-white/15 dark:text-slate-100"
            >
              Já tenho conta
            </a>
          </>
        }
      />
      <section className="page-shell" aria-labelledby="antes-de-cadastrar">
        <div className="glass-panel surface-outline rounded-[32px] border border-white/70 p-6 sm:p-7 dark:border-white/10">
          <h2 id="antes-de-cadastrar" className="text-xl font-semibold text-slate-950 dark:text-white">
            Antes de se cadastrar
          </h2>
          <ul className="mt-5 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
