import type { Metadata } from "next";
import { zitadel } from "@/lib/zitadel/api";
import { lerConfig, lerRegras, origemDoPedido, pedidoValido, siteDoPedido } from "@/lib/zitadel/fluxo";
import { Aviso, FormCadastro } from "../Formularios";
import { Moldura } from "../Moldura";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CadastroPage({ searchParams }: Props) {
  const q = await searchParams;
  const authRequest = typeof q.authRequest === "string" && pedidoValido(q.authRequest) ? q.authRequest : undefined;
  const [config, regras, pedido] = await Promise.all([
    lerConfig(),
    lerRegras(),
    authRequest ? zitadel.lerPedido(authRequest).catch(() => undefined) : undefined,
  ]);
  const site = pedido ? siteDoPedido(pedido) : undefined;
  const voltar = pedido ? origemDoPedido(pedido) : undefined;

  return (
    <Moldura titulo="Criar conta" subtitulo="É grátis. Uma conta só para o DADG e o Congresso CIEPS." site={site} voltar={voltar}>
      {config.cadastro ? (
        <FormCadastro authRequest={authRequest} regras={regras} />
      ) : (
        <Aviso tom="info">O cadastro de novas contas está desativado no momento.</Aviso>
      )}
    </Moldura>
  );
}
