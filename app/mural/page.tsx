import { client } from '../lib/contentful';

export const revalidate = 60;

export default async function Mural() {
  const response = await client.getEntries({ content_type: 'mural' });
  const murais = response.items;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Mural de Avisos
        </h1>
        {murais.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum aviso encontrado. Verifique se as entradas estão publicadas.
          </p>
        ) : (
          murais.map((mural: any) => (
            <div
              key={mural.sys.id}
              className="bg-white shadow-md rounded-lg p-6 mb-6 transition transform hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-lg text-gray-700">
                {mural.fields.listaDoMural}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
