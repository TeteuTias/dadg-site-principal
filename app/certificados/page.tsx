'use client'
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import "../globals.css"; // Certifique-se de ter este arquivo com os estilos globais

import { ICertificate } from "../lib/models/CertificateModel";

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

// Componente do Gradiente de Fundo (apenas tons de azul com mais variações)
function GradientBackground() {
  useEffect(() => {
    // Array com mais tons de azul para uma transição mais nítida
    const colors = [
      [0, 51, 102],    // Azul profundo
      [0, 102, 204],   // Azul médio
      [0, 128, 255],   // Azul brilhante
      [30, 144, 255],  // Dodger Blue
      [70, 130, 180],  // Steel Blue
      [135, 206, 235], // Sky Blue
      [173, 216, 230]  // Azul claro
    ];

    let step = 0;
    // Índices das cores: [atual esquerda, próxima esquerda, atual direita, próxima direita]
    let colorIndices = [0, 1, 2, 3];
    const gradientSpeed = 0.002;

    function updateGradient() {
      const c0_0 = colors[colorIndices[0]];
      const c0_1 = colors[colorIndices[1]];
      const c1_0 = colors[colorIndices[2]];
      const c1_1 = colors[colorIndices[3]];

      const istep = 1 - step;
      const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      const color1 = `rgb(${r1},${g1},${b1})`;

      const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      const g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      const b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      const color2 = `rgb(${r2},${g2},${b2})`;

      const gradientDiv = document.getElementById("gradient");
      if (gradientDiv) {
        gradientDiv.style.background = `-webkit-gradient(linear, left top, right top, from(${color1}), to(${color2}))`;
        gradientDiv.style.background = `-moz-linear-gradient(left, ${color1} 0%, ${color2} 100%)`;
      }

      step += gradientSpeed;
      if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
      }
    }
    const intervalId = setInterval(updateGradient, 10);
    return () => clearInterval(intervalId);
  }, []);
  return <div id="gradient" />;
}

// Componente Loader via Portal
function Loader() {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="loader animate-spin">
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

// Componente de Pesquisa e Exibição de Certificados
function SearchInput() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [data, setData] = useState<ICertificate[]>([]);

  const handleSearch = async () => {
    setData([]);
    setIsLoading(true);
    setNoResults(false);

    try {
      const response = await fetch(`/api/get/myCertificate/${inputValue}`);
      const result: { data: ICertificate[] } = await response.json();

      if (!response.ok) {
        setNoResults(true);
      } else {
        setData(result.data);
      }
    } catch (error) {
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-5">
      {/* Input com transição suave */}
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
          className="border border-blue-800 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-sm"
          placeholder="Pressione 'Enter' para pesquisar..."
        />
      </div>
      {isLoading && <Loader />}
      {noResults && (
        <div className="mt-4 text-red-600 font-medium">
          Nenhum resultado encontrado.
        </div>
      )}
      {!noResults && data.length > 0 && (
        <div className="w-full max-h-64 overflow-auto space-y-4 mt-4">
          {data.map((certificate) => (
            <Link
              key={String(certificate._id)}
              prefetch={true}
              href={`/certificados/meuCertificado/${String(certificate._id)}`}
            >
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 transition duration-300 ease-in-out hover:bg-blue-50 hover:shadow-lg">
                <h1 className="font-extrabold text-lg text-blue-900">
                  {certificate.eventName}
                </h1>
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700 mt-2">
                  <div>
                    <p className="uppercase tracking-wide text-xs">Titular</p>
                    <p className="font-medium">{certificate.ownerName}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-xs">Código Verificador</p>
                    <p className="font-medium">{String(certificate._id)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Página principal com o gradiente de fundo e o conteúdo sobreposto
export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Componente de fundo com gradiente */}
      <GradientBackground />
      {/* Conteúdo centralizado e sobreposto ao fundo */}
      <main className={`absolute inset-0 flex items-center justify-center p-6 ${stylePoppins.className}`}>
        <div className="w-full max-w-md sm:max-w-lg bg-white shadow-2xl rounded-3xl p-6 sm:p-8 z-10">
          <article className="space-y-5 text-center">
            <div className="flex items-center justify-center">
              <Image
                className="rounded-full"
                width={115}
                height={115}
                alt="Logo"
                src="/logoDadg02.png"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">
                {`Validação de Certificados`.toLocaleUpperCase()}
              </h1>
              <h2 className="font-medium text-gray-600 text-sm sm:text-base">
                Pesquise usando: Nome, CPF, Email, Evento ou Código Verificador
              </h2>
            </div>
          </article>
          <article className="mt-6">
            <SearchInput />
          </article>
        </div>
      </main>
    </div>
  );
}
