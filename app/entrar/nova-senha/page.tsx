import type { Metadata } from "next";
import Link from "next/link";
import { lerRegras } from "@/lib/zitadel/fluxo";
import { Aviso, FormNovaSenha } from "../Formularios";
import { Moldura } from "../Moldura";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function NovaSenhaPage({ searchParams }: Props) {
  const q = await searchParams;
  const userId = typeof q.userId === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(q.userId) ? q.userId : undefined;
  const codigo = typeof q.code === "string" && q.code.length <= 64 ? q.code : undefined;

  if (!userId || !codigo) {
    return (
      <Moldura titulo="Nova senha">
        <Aviso tom="erro">
          Este link está incompleto ou expirou.{" "}
          <Link href="/entrar/esqueci-senha" className="font-semibold underline underline-offset-4">Peça um novo link</Link>.
        </Aviso>
      </Moldura>
    );
  }

  return (
    <Moldura titulo="Crie uma senha nova" subtitulo="Escolha uma senha que você não usa em outros sites.">
      <FormNovaSenha userId={userId} codigo={codigo} regras={await lerRegras()} />
    </Moldura>
  );
}
