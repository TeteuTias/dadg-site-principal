import type { Metadata } from "next";

const descricao = "Consulte o andamento da sua manifestação na Ouvidoria do DADG IMEPAC e leia a resposta da diretoria usando o número de protocolo.";

export const metadata: Metadata = {
  title: { absolute: "Acompanhar manifestação | Ouvidoria DADG IMEPAC" },
  description: descricao,
  alternates: { canonical: "/ouvidoria/acompanhar" },
  openGraph: { title: "Acompanhar manifestação | DADG IMEPAC", description: descricao, url: "/ouvidoria/acompanhar" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
