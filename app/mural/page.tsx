import Link from "next/link";
import { client } from "../lib/contentful";

export const dynamic = "force-dynamic";

export default async function Mural() {
  const response = await client.getEntries({
    content_type: "mural"
  });
  const murais = response.items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-[#09427d]">
          Mural de Avisos
        </h1>
        {murais.length === 0 ? (
          <p className="text-center text-red-600">
            Nenhum aviso encontrado. Tente novamente mais tarde.
          </p>
        ) : (
          murais.map((mural: any) => {
            
            // Tente usar o id que você espera – por exemplo, tagID
            const tagField = mural.fields.tag;
            const isImportante = tagField
              ? Array.isArray(tagField)
                ? tagField.map((t: string) => t.trim().toLowerCase()).includes("importante")
                : tagField.trim().toLowerCase() === "importante"
              : false;

            return (
              <Link
                key={mural.sys.id}
                href="/certificados"
                className={`mb-8 transition duration-300 hover:scale-105 hover:shadow-md block ${
                  isImportante ? "rainbow-glow" : ""
                }`}
              >
                <div className="card bg-white rounded-xl p-8">
                  <p className="text-lg text-gray-700">
                    {mural.fields.listaDoMural}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
