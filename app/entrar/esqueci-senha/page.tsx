import type { Metadata } from "next";
import { pedidoValido } from "@/lib/zitadel/fluxo";
import { FormEsqueci } from "../Formularios";
import { Moldura } from "../Moldura";

export const metadata: Metadata = { title: "Esqueci minha senha", robots: { index: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EsqueciSenhaPage({ searchParams }: Props) {
  const q = await searchParams;
  const authRequest = typeof q.authRequest === "string" && pedidoValido(q.authRequest) ? q.authRequest : undefined;
  return (
    <Moldura titulo="Esqueci minha senha" subtitulo="Informe o e-mail da sua conta. Vamos enviar um link para você criar uma senha nova.">
      <FormEsqueci authRequest={authRequest} />
    </Moldura>
  );
}
