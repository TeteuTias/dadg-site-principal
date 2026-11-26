import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { InfoCard, PageHero } from "@/app/components/site-sections";

export const metadata: Metadata = {
  alternates: { canonical: "/termos" },
  title: "Termos de Uso",
  description:
    "Regras de uso dos sites do DADG e do CIEPS: conta única, inscrições, certificados, conteúdos enviados e responsabilidades.",
};

const linkClass = "font-semibold text-[var(--brand-800)] underline underline-offset-4 dark:text-sky-300";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermosPage() {
  return (
    <div className="space-y-12 pt-28 pb-8 sm:space-y-14">
      <PageHero eyebrow="Termos" title="Termos de Uso" description="Última atualização: 24 de novembro de 2026" />

      <section className="page-shell space-y-5">
        <InfoCard
          title="Abrangência"
          description="Estes termos valem para todos os sites do DADG e do CIEPS (Congresso), que usam uma conta única: www.dadg.com.br, certificados.dadg.com.br, www.login.dadg.com.br (tela de login), www.congressocieps.com.br e www.admin.congressocieps.com.br."
        />
        <article className="glass-panel surface-outline rounded-[28px] border border-white/70 p-6 sm:p-10 dark:border-white/10">
          <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
            <Section title="1. Quem oferece e aceitação">
              <p>
                Os serviços são oferecidos pelo DADG — Diretório Acadêmico Diogo Guimarães, entidade dos estudantes
                de Medicina do IMEPAC Araguari, com endereço na Av. Minas Gerais, 1889 — Araguari, MG. Ao usar os
                sites ou criar uma conta, você aceita estes termos.
              </p>
            </Section>

            <Section title="2. Conta única">
              <List
                items={[
                  "Uma mesma conta dá acesso a todos os sites listados acima.",
                  "Você é responsável por manter sua senha segura e por tudo o que for feito com a sua conta.",
                  "Os dados informados devem ser verdadeiros e atualizados.",
                  "É permitida apenas uma conta por pessoa.",
                ]}
              />
            </Section>

            <Section title="3. Uso permitido e proibido">
              <p>É proibido:</p>
              <List
                items={[
                  "Tentar acessar contas de outras pessoas.",
                  "Burlar ou testar mecanismos de segurança sem autorização.",
                  "Usar robôs, automações abusivas ou sobrecarregar os serviços.",
                  "Enviar conteúdo ilegal ou de terceiros sem ter os direitos para isso.",
                  "Fraudar presença, inscrições ou certificados.",
                ]}
              />
            </Section>

            <Section title="4. Eventos, inscrições e congresso">
              <p>
                Cada evento pode ter regras próprias, como número de vagas, prazos e presença mínima. Pagamentos,
                quando houver, seguem as regras da plataforma de pagamento e do evento.
              </p>
            </Section>

            <Section title="5. Certificados">
              <p>
                Os certificados são emitidos conforme as regras de cada evento e podem ser validados publicamente.
                Certificados obtidos por fraude podem ser cancelados.
              </p>
            </Section>

            <Section title="6. Trabalhos e conteúdos enviados">
              <p>
                Ao enviar trabalhos ou outros conteúdos, o autor declara ter os direitos sobre eles e autoriza o uso
                necessário para avaliação e divulgação no evento.
              </p>
            </Section>

            <Section title="7. Disponibilidade">
              <p>
                Os serviços podem passar por manutenção ou sofrer interrupções. Não há garantia de funcionamento
                contínuo.
              </p>
            </Section>

            <Section title="8. Suspensão ou encerramento de conta">
              <p>Contas que violarem estes termos podem ser suspensas ou encerradas.</p>
            </Section>

            <Section title="9. Limitação de responsabilidade">
              <p>
                Nos limites permitidos pela lei, o DADG não se responsabiliza por danos decorrentes de uso indevido
                dos serviços, de indisponibilidades ou de informações incorretas fornecidas pelos usuários.
              </p>
            </Section>

            <Section title="10. Privacidade">
              <p>
                O tratamento de dados pessoais está descrito na{" "}
                <Link href="/privacidade" className={linkClass}>
                  Política de Privacidade
                </Link>
                .
              </p>
            </Section>

            <Section title="11. Alterações dos termos">
              <p>Alterações serão publicadas nesta página, com a nova data de atualização.</p>
            </Section>

            <Section title="12. Lei aplicável e foro">
              <p>
                Estes termos seguem a lei brasileira. Fica eleito o foro da comarca de Araguari/MG, ressalvados os
                direitos do consumidor previstos em lei.
              </p>
            </Section>

            <Section title="13. Contato">
              <p>
                Escreva para{" "}
                <a href="mailto:dadg.imepac@gmail.com" className={`${linkClass} select-all`}>
                  dadg.imepac@gmail.com
                </a>{" "}
                ou use a{" "}
                <Link href="/ouvidoria" className={linkClass}>
                  Ouvidoria
                </Link>
                .
              </p>
            </Section>
          </div>
        </article>
      </section>
    </div>
  );
}
