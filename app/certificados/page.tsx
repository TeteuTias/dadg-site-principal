'use client'
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { ICertificate } from "../lib/models/CertificateModel";
import "../globals.css"; // Importa o global.css

const stylePoppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  style: ["normal", "italic"],
});

// Componente Loader via Portal
function Loader() {
  // Cria o overlay diretamente no body
  return ReactDOM.createPortal(
    <div className="showbox">
      <div className="loader">
        <svg className="circular" viewBox="25 25 50 50">
          <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </div>,
    document.body
  );
}

export default function Home() {
  return (
    <main
      className="flex flex-col items-center justify-center content-center max-w-screen overflow-hidden bg-white min-h-svh w-full space-y-10"
      style={stylePoppins.style}
    >
      <article className="space-y-5">
        <div className="flex items-center justify-center">
          <Image
            className="rounded-full"
            width={115}
            height={115}
            alt=""
            src="/logoDadg02.png"
          />
        </div>
        <div>
          <h1 className="text-[23px] sm:text-[30px] font-bold text-center">
            {`Validação de Certificados`.toLocaleUpperCase()}
          </h1>
          <div>
            <h2 className="text-center font-semithin">
              Pesquise usando: Nome, Cpf, Email, Evento ou Código Verificador
            </h2>
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

function SearchInput() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [data, setData] = useState<ICertificate[]>([]);

  const handleSearch = async () => {
    setData([]);
    setIsLoading(true);
    setNoResults(false);

    const fetchData = await fetch(`/api/get/myCertificate/${inputValue}`);
    const fetchDataJson: { data: ICertificate[] } = await fetchData.json();

    if (!fetchData.ok) {
      setNoResults(true);
      setIsLoading(false);
      return;
    }

    setData(fetchDataJson.data);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-5 px-5 md:p-0">
      {/* Input e Label */}
      <div className="w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim() !== "") {
              handleSearch();
            }
          }}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-800"
          placeholder="Pressione 'Enter' para pesquisar..."
        />
      </div>
      {/* Loader de Carregamento */}
      {isLoading && <Loader />}
      {/* Mensagem de Nenhum Resultado Encontrado */}
      {noResults && (
        <div className="mt-4 text-red-600 font-medium">
          Nenhum resultado encontrado.
        </div>
      )}
      {/* Lista de Resultados */}
      {!noResults && data.length > 0 && (
        <div className="w-full max-h-64 overflow-auto space-y-5">
          {data.map((certificate) => (
            <div
              key={String(certificate._id)}
              className="shadow-md border-t-[2px] bg-white border-[#09427D] w-full px-5 rounded-xl space-y-1 cursor-pointer"
              style={stylePoppins.style}
            >
              <Link
                prefetch={true}
                href={`/certificados/meuCertificado/${String(certificate._id)}`}
              >
                <div>
                  <h1 className="font-extrabold">{certificate.eventName}</h1>
                </div>
                <div>
                  <div>
                    <p className="text-[10.5px]">Titular</p>
                    <p className="font-medium">{certificate.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-[10.5px]">Código Verificador</p>
                    <p className="font-medium">{String(certificate._id)}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
