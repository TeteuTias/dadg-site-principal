import type { Metadata } from "next";
import { Aviso, FormVerificar } from "../Formularios";
import { Moldura } from "../Moldura";

export const metadata: Metadata = { title: "Confirmar e-mail", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function VerificarEmailPage({ searchParams }: Props) {
  const q = await searchParams;
  const userId = typeof q.userId === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(q.userId) ? q.userId : undefined;
  const codigo = typeof q.code === "string" && q.code.length <= 64 ? q.code : undefined;
  const enviado = q.enviado === "1";

  if (!userId) {
    return (
      <Moldura titulo="Confirmar e-mail">
        <Aviso tom="erro">Este link está incompleto. Abra de novo o link do e-mail que enviamos ou volte ao site e entre.</Aviso>
      </Moldura>
    );
  }

  return (
    <Moldura
      titulo={enviado ? "Confira seu e-mail" : "Confirme seu e-mail"}
      subtitulo={codigo ? "Falta só um clique para confirmar seu e-mail." : "Precisamos confirmar que o e-mail é seu antes de continuar."}
    >
      <FormVerificar userId={userId} codigo={codigo} enviado={enviado} />
    </Moldura>
  );
}
