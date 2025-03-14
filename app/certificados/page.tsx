'use client'
import React from 'react';
import Image from "next/image";
import { Poppins } from 'next/font/google';
import { useState } from "react";
import { ICertificate } from '../lib/models/CertificateModel';
import Link from 'next/link';

//

const stylePoppins = Poppins({ subsets: ["latin", "latin-ext"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], style: ['normal', 'italic'] })

//
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center content-center max-w-screen overflow-hidden bg-white min-h-svh w-full space-y-10"
      style={stylePoppins.style}
    >
      <article className='space-y-5'>
        <div className=''>
          <div className='flex items-center justify-center'>
            <div className="relative w-32 h-32 mb-6">
              <Image
                src="/logoDadg02.png"
                alt="Logo Diretório Acadêmico"
                fill
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className='text-[30px] sm:text-[40px] font-bold text-center'>{`Validação de Certificados`.toLocaleUpperCase()}</h1>
            <div>
              <h2 className='text-center font-semithin text-center'>Pesquise usando: Nome, Cpf, Email, Evento ou Código Verificador</h2>
            </div>
          </div>
        </div>
      </article>
      <article>
        <div>
          <SearchInput />
        </div>
      </article>
    </main>
  );
}
// <Link prefetch={true} href={"/certificados"} className='bg-[#09427D] text-white border-[0.5px] border-black px-2 py-1 font-bold rounded-xl hover:text-[#09427D] hover:bg-white duration-150 ease-in'>CERTIFICADOS</Link>





function SearchInput() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [data, setData] = useState<ICertificate[]>([])



  const handleSearch = async () => {
    setData([])
    setIsLoading(true);
    setNoResults(false);


    const fetchData = await fetch(`/api/get/myCertificate/${inputValue}`)

    const fetchDataJson: { data: ICertificate[] } = await fetchData.json()

    if (!fetchData.ok) {
      //let fetchDataJson2: { message: "string" } = await fetchData.json()
      //console.log(fetchDataJson2)
      setNoResults(true)
      setIsLoading(false)
      return;
    }

    setData(fetchDataJson.data)
    setIsLoading(false)

  };

  return (
    <div className="flex flex-col items-center justify-start space-y-5 px-5 md:p-0 ">

      {/* Input e Label */}
      <div className='w-full'>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim() !== "") {
              handleSearch();
            }
          }}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-1 border-blue-800"
          placeholder="Pressione 'Enter' para pesquisar..."
        />
      </div>
      {/* Modal de Carregamento */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg">Carregando...</p>
          </div>
        </div>
      )}

      {/* Mensagem de Nenhum Resultado Encontrado */}
      {noResults && (
        <div className="mt-4 text-red-600 font-medium">Nenhum resultado encontrado.</div>
      )}


      {
        !noResults && data.length > 0 &&
        <div className='w-full max-h-64 overflow-auto space-y-5'>
          {
            data.map((certificate) => {
              return (
                <div
                  className='shadow-md border-t-[2px] bg-white border-[#09427D] w-full px-5 rounded-xl space-y-1 cursor-pointer min-w-[400px] max-w-[400px] sm:min-w-[550px] sm:max-w-[550px]' key={String(certificate._id)} style={stylePoppins.style}>
                  <Link
                    prefetch={true}
                    href={`/certificados/meuCertificado/${String(certificate._id)}`} target='_blank'>
                    <div>
                      <h1 className='font-extrabold'>{certificate.eventName}</h1>
                    </div>
                    <div className=''>
                      <div>
                        <p className='text-[10.5px]'>Titular</p>
                        <p className='font-medium'>{certificate.ownerName}</p>
                      </div>
                      <div>
                        <p className='text-[10.5px]'>
                          Código Verificador
                        </p>
                        <p className='font-medium'>
                          {String(certificate._id)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })
          }
        </div>
      }
    </div>
  );
}
