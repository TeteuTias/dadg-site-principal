import type { Metadata } from "next";

const descricao =
  "Ouvidoria do DADG IMEPAC: envie reclamação, sugestão, elogio, denúncia ou solicitação, de forma anônima ou identificada, e acompanhe a resposta pelo protocolo.";

export const metadata: Metadata = {
  title: "Ouvidoria",
  description: descricao,
  alternates: { canonical: "/ouvidoria" },
  openGraph: { title: "Ouvidoria | DADG IMEPAC", description: descricao, url: "/ouvidoria" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
