'use client'
import React from 'react';
import Image from "next/image";
import { Poppins } from 'next/font/google';
import { useState } from "react";

//

const stylePoppins = Poppins({ subsets: ["latin", "latin-ext"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], style: ['normal', 'italic'] })

//
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center content-center max-w-screen overflow-hidden bg-white min-h-svh w-full space-y-10"
      style={stylePoppins.style}
    >
      <article className='space-y-5'>
        <div className='flex items-center justify-center'>
          <Image
            className='rounded-full'
            width={115}
            height={115}
            alt=""
            src="/logoDadg02.png"
          />
        </div>
        <div>
          <h1 className='text-[23px] sm:text-[30px] font-bold text-center'>{`Validação de Certificados`.toLocaleUpperCase()}</h1>
          <div>
            <h2 className='text-center font-semithin text-center'>Pesquise usando: Nome, Cpf, Evento ou Código Verificador</h2>
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

  const handleSearch = () => {
    setIsLoading(true);
    setNoResults(false);

    // Simula um carregamento entre 100 e 300ms
    const randomDelay = Math.floor(Math.random() * 200) + 100;
    setTimeout(() => {
      setIsLoading(false);
      setNoResults(true);
    }, randomDelay);
  };

  return (
    <div className="flex flex-col items-center justify-start">
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
    </div>
  );
}