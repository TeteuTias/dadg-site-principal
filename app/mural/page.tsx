import Link from "next/link";
import { client } from "../lib/contentful";

export const dynamic = "force-dynamic";

export default async function Mural() {
  const response = await client.getEntries({
    content_type: "mural"
  });
  const murais = response.items;

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-[#09427d]">
          Mural de Avisos
        </h1>
        {murais.length === 0 ? (
          <p className="text-center text-red-600">
            Nenhum aviso encontrado. Tente novamente mais tarde.
          </p>
        ) : (
          murais.map((mural) => {
            const hasArco = mural.fields.arco;
            return (
              <Link
                key={mural.sys.id}
                href="/certificados"
                className="block mb-6"
              >
                {hasArco ? ( //isso aqui define se vai ter borda colorida ou nao dependendo do ID
                  <div className="rainbow-glow p-[2px] rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-md">
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-lg text-gray-700">
                        {String(mural.fields.listaDoMural || '')}
                      </p>
                      <p className="text-lg text-gray-700 mt-2">
                        {String(mural.fields.arco || '')}
                      </p>
                    </div>
                  </div>
                ) : (// garantindo borda abaulada mesmo no hover
                  <div className="bg-white rounded-xl p-4 transition-transform duration-300 hover:scale-105 hover:shadow-md">
                    <p className="text-lg text-gray-700">
                      {String(mural.fields.listaDoMural || '')}
                    </p>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
