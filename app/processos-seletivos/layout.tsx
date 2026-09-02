import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processos seletivos das ligas acadêmicas | DADG",
  description:
    "Consulte os processos seletivos da CLAM, faça sua inscrição e escolha as ligas acadêmicas de medicina em que quer concorrer.",
  openGraph: {
    title: "Processos seletivos das ligas acadêmicas | DADG",
    description:
      "Consulte os processos seletivos da CLAM, faça sua inscrição e escolha as ligas acadêmicas de medicina em que quer concorrer.",
    type: "website",
  },
};

export default function SelectionProcessesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
