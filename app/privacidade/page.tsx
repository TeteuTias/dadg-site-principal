import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { InfoCard, PageHero } from "@/app/components/site-sections";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o DADG e o CIEPS coletam, usam, compartilham e protegem dados pessoais, e como exercer seus direitos previstos na LGPD.",
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

const Email = () => (
  <a href="mailto:dadg.imepac@gmail.com" className={`${linkClass} select-all`}>
    dadg.imepac@gmail.com
  </a>
);

export default function PrivacidadePage() {
  return (
    <div className="space-y-12 pt-28 pb-8 sm:space-y-14">
      <PageHero
        eyebrow="Privacidade"
        title="Política de Privacidade"
        description="Última atualização: 24 de novembro de 2026"
      />

      <section className="page-shell space-y-5">
        <InfoCard
          title="Abrangência"
          description="Esta política vale para todos os sites do DADG e do CIEPS (Congresso), que usam uma conta única: www.dadg.com.br, certificados.dadg.com.br, www.login.dadg.com.br (tela de login), www.congressocieps.com.br e www.admin.congressocieps.com.br."
        />
        <article className="glass-panel surface-outline rounded-[28px] border border-white/70 p-6 sm:p-10 dark:border-white/10">
          <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">

            <Section title="1. Quem somos e como falar com a gente">
              <p>
                O controlador dos dados é o DADG — Diretório Acadêmico Diogo Guimarães, entidade dos estudantes de
                Medicina do IMEPAC Araguari, com endereço na Av. Minas Gerais, 1889 — Araguari, MG.
              </p>
              <p>
                Para assuntos de privacidade e pedidos relacionados à LGPD, escreva para <Email /> ou use a{" "}
                <Link href="/ouvidoria" className={linkClass}>
                  Ouvidoria
                </Link>
                .
              </p>
            </Section>

            <Section title="2. Dados que coletamos">
              <List
                items={[
                  <>
                    <strong>Conta e login:</strong> nome, e-mail e senha. A senha é guardada apenas de forma cifrada
                    (hash), nunca em texto. Para quem entra com Google: identificador da conta Google, nome, e-mail e
                    foto de perfil fornecidos pelo Google.
                  </>,
                  <>
                    <strong>Perfil DADG:</strong> nome completo, CPF, período, matrícula/RA, data de nascimento,
                    telefone e e-mail de contato.
                  </>,
                  <>
                    <strong>Inscrições em eventos e no congresso CIEPS:</strong> dados de inscrição, atividades,
                    presença, trabalhos acadêmicos enviados e certificados.
                  </>,
                  <>
                    <strong>Pagamentos:</strong> quando houver, são processados por plataformas de pagamento
                    parceiras. O site não guarda número de cartão.
                  </>,
                  <>
                    <strong>Dados técnicos:</strong> endereço IP, registros de acesso (logs) para segurança e cookies
                    essenciais de sessão, usados para manter o login.
                  </>,
                ]}
              />
            </Section>

            <Section title="3. Para que usamos os dados">
              <List
                items={[
                  "Identificação e login.",
                  "Cadastro e perfil.",
                  "Inscrições em eventos e no congresso.",
                  "Registro de presença.",
                  "Emissão e validação de certificados.",
                  "Processos seletivos (CLAM).",
                  "Comunicação operacional, como e-mails de confirmação e de redefinição de senha.",
                  "Segurança e prevenção de fraude.",
                  "Cumprimento de obrigações legais.",
                ]}
              />
            </Section>

            <Section title="4. Bases legais (LGPD, art. 7º)">
              <List
                items={[
                  "Execução de contrato ou de procedimentos solicitados pelo titular (conta, inscrições, certificados).",
                  "Consentimento, como o aceite do aviso de privacidade no perfil.",
                  "Legítimo interesse, para segurança e prevenção de fraude.",
                  "Cumprimento de obrigação legal ou regulatória.",
                ]}
              />
            </Section>

            <Section title="5. Cookies e rastreamento">
              <p>
                Os sites usam cookies essenciais de sessão, necessários para manter o login. O site do CIEPS
                (www.congressocieps.com.br) usa o Pixel da Meta (Facebook) para medir campanhas de divulgação do
                congresso. Os sites do DADG não usam rastreamento de publicidade.
              </p>
            </Section>

            <Section title="6. Com quem compartilhamos">
              <p>Compartilhamos apenas o necessário para operar os serviços. Nunca vendemos dados pessoais.</p>
              <List
                items={[
                  "Hospedagem: servidor próprio localizado no Brasil (sites, login e bancos de dados).",
                  "Brevo: envio de e-mails transacionais, como redefinição de senha e confirmações.",
                  "Google: somente se você escolher “Entrar com Google”.",
                  "Serviços de armazenamento em nuvem, para arquivos enviados e cópias de segurança (backups cifrados).",
                  "Plataformas de pagamento parceiras, quando houver pagamento.",
                  "Meta, no site do CIEPS (pixel).",
                  "Autoridades, quando exigido por lei.",
                ]}
              />
              <p>
                Alguns desses fornecedores podem tratar dados fora do Brasil. Nesses casos, a transferência
                internacional segue as garantias previstas no art. 33 da LGPD.
              </p>
            </Section>

            <Section title="7. Dados de usuário do Google">
              <p>
                Ao usar “Entrar com Google”, recebemos do Google apenas nome, e-mail, foto de perfil e identificador
                da conta. Usamos esses dados somente para criar sua conta e autenticar o login. Não os usamos para
                publicidade, não os vendemos e não os transferimos a terceiros, exceto o necessário para operar o
                login.
              </p>
              <p>
                Você pode desvincular sua conta Google removendo o acesso em{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  myaccount.google.com/permissions
                </a>{" "}
                e pedir a exclusão dos dados pelo e-mail <Email />.
              </p>
              <p>
                O uso de informações recebidas das APIs do Google seguirá a{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Política de Dados do Usuário dos Serviços de API do Google
                </a>
                , incluindo os requisitos de Uso Limitado.
              </p>
            </Section>

            <Section title="8. Por quanto tempo guardamos">
              <p>
                Guardamos os dados pelo tempo necessário às finalidades descritas e ao cumprimento de obrigações
                legais. Certificados podem ser mantidos para permitir validação futura. Contas podem ser excluídas a
                pedido do titular.
              </p>
            </Section>

            <Section title="9. Segurança">
              <p>
                Adotamos senhas com hash, conexões HTTPS, cifragem de dados sensíveis (como CPF), acesso restrito às
                pessoas que precisam dos dados e cópias de segurança cifradas.
              </p>
            </Section>

            <Section title="10. Seus direitos (LGPD, art. 18)">
              <List
                items={[
                  "Confirmação da existência de tratamento.",
                  "Acesso aos dados.",
                  "Correção de dados incompletos, inexatos ou desatualizados.",
                  "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei.",
                  "Portabilidade.",
                  "Informação sobre com quem compartilhamos seus dados.",
                  "Revogação do consentimento.",
                ]}
              />
              <p>
                Para exercer seus direitos, escreva para <Email /> ou use a{" "}
                <Link href="/ouvidoria" className={linkClass}>
                  Ouvidoria
                </Link>
                .
              </p>
            </Section>

            <Section title="11. Menores de idade">
              <p>Os serviços são voltados a estudantes universitários e a participantes do congresso.</p>
            </Section>

            <Section title="12. Alterações desta política">
              <p>
                Alterações serão publicadas nesta página, com a nova data de atualização. Veja também os{" "}
                <Link href="/termos" className={linkClass}>
                  Termos de Uso
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
