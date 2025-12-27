'use client'
import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import "../globals.css";

import { ICertificate, ICertificateWithEventIdPopulate } from "../lib/models/CertificateModel";
import { libSourceSerif4 } from "@/public/fonts/lib/libSourceSerif4";

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
    const colorIndices = [0, 1, 2, 3];
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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [renderCertificate, setRenderCertificate] = useState<ICertificateWithEventIdPopulate | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Restaura estado salvo ao montar o componente
  useEffect(() => {
    const savedSearch = localStorage.getItem('certificateSearch');
    const savedResults = localStorage.getItem('certificateResults');
    
    if (savedSearch) {
      setInputValue(savedSearch);
    }
    
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setData(parsedResults);
        
        // Scroll para os resultados após um pequeno delay para garantir que o DOM está renderizado
        setTimeout(() => {
          const resultsContainer = document.querySelector('[data-results-container]');
          if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } catch (e) {
        // Ignora erro de parsing
      }
    }
  }, []);

  const handleSearch = async () => {
    setData([]);
    setIsLoading(true);
    setNoResults(false);

    try {
      const response = await fetch(`/api/get/myCertificate/${inputValue}`);
      const result: { data: ICertificate[] } = await response.json();

      if (!response.ok) {
        setNoResults(true);
        localStorage.removeItem('certificateSearch');
        localStorage.removeItem('certificateResults');
      } else {
        setData(result.data);
        // Salva o termo de busca e resultados
        localStorage.setItem('certificateSearch', inputValue);
        localStorage.setItem('certificateResults', JSON.stringify(result.data));
      }
    } catch {
      setNoResults(true);
      localStorage.removeItem('certificateSearch');
      localStorage.removeItem('certificateResults');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (certificateId: string, eventName: string, ownerName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDownloadingId(certificateId);
    try {
      // 1. Buscar dados completos do certificado (igual à página do certificado)
      const response = await fetch(`/api/get/myCertificateById/${certificateId}`);
      
      if (!response.ok) {
        alert('Erro ao buscar certificado. Tente novamente.');
        return;
      }

      const result: { data: ICertificateWithEventIdPopulate } = await response.json();
      const certData = result.data;
      
      // 2. Renderizar o certificado
      setRenderCertificate(certData);
      
      // 3. Aguardar o DOM atualizar e a imagem carregar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 4. Capturar com html2canvas (igual à página do certificado)
      const frontElement = document.getElementById('hiddenFrontCert');
      if (!frontElement) {
        alert('Erro ao renderizar certificado.');
        return;
      }

      const frontCanvas = await html2canvas(frontElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2
      });
      const imgUrl = frontCanvas.toDataURL('image/png');
      const imgResponse = await fetch(imgUrl);
      const blob = await imgResponse.blob();

      const pdfDoc = await PDFDocument.create();
      const arrayBuffer = await blob.arrayBuffer();
      const pngImage = await pdfDoc.embedPng(arrayBuffer);
      const { width, height } = pngImage.scale(1);

      // Adiciona a página da frente
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width,
        height,
      });

      // Se houver verso, renderiza e adiciona ao PDF
      if (certData?.verse?.showVerse === true) {
        const backElement = document.getElementById('hiddenVerseCert');
        if (backElement) {
          const backCanvas = await html2canvas(backElement, {
            useCORS: true,
            allowTaint: true,
            scale: 2
          });
          const imgUrlVerse = backCanvas.toDataURL('image/png');
          const responseBack = await fetch(imgUrlVerse);
          const blobVerse = await responseBack.blob();
          const arrayBufferVerse = await blobVerse.arrayBuffer();
          const pngImageVerse = await pdfDoc.embedPng(arrayBufferVerse);

          pdfDoc.addPage([width, height]).drawImage(pngImageVerse, {
            x: 0,
            y: 0,
            width,
            height,
          });
        }
      }

      // Gera os bytes do PDF
      const pdfBytes = await pdfDoc.save();
      // @ts-expect-error: Erro de tipificação
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${eventName} - ${ownerName}.pdf`;
      link.click();
      URL.revokeObjectURL(blobUrl);
      
      // Limpar o certificado renderizado
      setRenderCertificate(null);
    } catch (error) {
      console.error('Erro ao baixar:', error);
      alert('Erro ao baixar certificado. Tente novamente.');
    } finally {
      setDownloadingId(null);
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
          className="border border-blue-800 p-2.5 sm:p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-sm text-sm sm:text-base"
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
        <div className="w-full max-h-64 overflow-auto space-y-2 mt-4" data-results-container>
          {data.map((certificate) => (
            <div
              key={String(certificate._id)}
              className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50 transition duration-300 ease-in-out hover:bg-blue-50 hover:shadow-lg relative group"
            >
              <Link
                prefetch={true}
                href={`/certificados/meuCertificado/${String(certificate._id)}`}
                className="block"
              >
                <h1 className="font-extrabold text-sm sm:text-base md:text-lg text-blue-900 break-words pr-20">
                  {certificate.eventName}
                </h1>
                <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-700 mt-2 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="uppercase tracking-wide text-xs">Titular</p>
                    <p className="font-medium break-words">{certificate.ownerName}</p>
                  </div>
                  <div className="min-w-0 flex-1 sm:flex-none">
                    <p className="uppercase tracking-wide text-xs">Código Verificador</p>
                    <p className="font-medium break-all text-xs">{String(certificate._id)}</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => handleDownload(String(certificate._id), certificate.eventName, certificate.ownerName, e)}
                disabled={downloadingId === String(certificate._id)}
                className="absolute top-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg z-10"
                title="Baixar certificado"
              >
                {downloadingId === String(certificate._id) ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Certificado renderizado de forma oculta para captura com html2canvas */}
      {renderCertificate && (
        <div 
          ref={certificateRef}
          style={{ 
            position: 'fixed', 
            left: '-9999px', 
            top: 0,
            width: '2000px',
            backgroundColor: 'white'
          }}
        >
          {/* Frente do Certificado - MESMA ESTRUTURA EXATA da página do certificado */}
          {!renderCertificate.frontBottomText || !renderCertificate.frontTopperText ? (
            // Certificado SIMPLES (sem frontBottomText ou frontTopperText)
            <div
              id="hiddenFrontCert"
              className="relative"
              style={{ 
                width: '2000px',
                height: '1414px'
              }}
            >
              <img
                src={`/api/get/templateProxy/${String(renderCertificate._id)}|front?t=${Date.now()}`}
                alt="Certificado"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                crossOrigin="anonymous"
              />
              {/* Igual à página original: absolute flex flex-col items-center justify-center top-0 font-bold w-full h-full */}
              <div className="absolute flex flex-col items-center justify-center top-0 font-bold w-full h-full px-4">
                <div className="w-full" style={{ maxWidth: '70%' }}>
                  {/* Igual à página original: relative flex flex-col space-y-5 items-center content-center justify-center mb-[115px] w-full */}
                  <div className="relative flex flex-col items-center content-center justify-center w-full" style={{ gap: '20px', marginBottom: '115px' }}>
                    <p className="text-center" style={{ ...libSourceSerif4.style, fontWeight: '400', fontSize: '48px' }}>
                      {renderCertificate.ownerName}
                    </p>
                    <p className="font-thin text-center" style={{ fontSize: '24px' }}>
                      Código de Verificação: {String(renderCertificate._id)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Certificado COMPLETO (com frontBottomText e frontTopperText)
            <div
              id="hiddenFrontCert"
              className="relative"
              style={{ 
                width: '2000px',
                height: '1414px'
              }}
            >
              <img
                src={`/api/get/templateProxy/${String(renderCertificate._id)}|front?t=${Date.now()}`}
                alt="Certificado"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                crossOrigin="anonymous"
              />
              {/* Igual à página original: absolute top-[350px] -left-[125px] flex items-center justify-center content-center w-auto */}
              <div className="absolute flex items-center justify-center content-center" style={{ top: '350px', left: '-125px' }}>
                <div style={{ width: '85%' }}>
                  {/* Igual à página original: flex flex-col items-center justify-center font-bold space-y-5 */}
                  <div className="flex flex-col items-center justify-center font-bold" style={{ gap: '20px' }}>
                    {/* Igual à página original: relative flex flex-col space-y-5 items-center content-center justify-center w-full + styleContainer */}
                    <div className="relative flex flex-col items-center content-center justify-center w-full" style={{ gap: '20px', ...renderCertificate.eventId?.styleContainer }}>
                      
                      {renderCertificate.frontTopperText && (
                        <p className="text-center" style={{ ...libSourceSerif4.style, fontSize: '36px', ...renderCertificate.eventId?.styleFrontTopperText }}>
                          {renderCertificate.frontTopperText}
                        </p>
                      )}

                      <p className="text-center" style={{ ...libSourceSerif4.style, fontSize: '48px', ...renderCertificate.eventId?.styleNameText }}>
                        {renderCertificate.ownerName.toUpperCase()}
                      </p>
                      
                      <p className="font-thin text-center" style={{ fontSize: '24px' }}>
                        Código de Verificação: {String(renderCertificate._id)}
                      </p>

                      {renderCertificate.frontBottomText && (
                        <p className="text-center" style={{ ...libSourceSerif4.style, whiteSpace: 'pre-wrap', fontSize: '36px', ...renderCertificate.eventId?.styleFrontBottomText }}>
                          {renderCertificate.frontBottomText.replace(/\\n/g, "\n").split("\n").map((linha, indice) => (
                            <React.Fragment key={indice}>
                              {linha}
                              <br />
                            </React.Fragment>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Verso do Certificado (se existir) */}
          {renderCertificate.verse?.showVerse && (
            <div
              id="hiddenVerseCert"
              className="relative"
              style={{ 
                width: '2000px',
                height: '1414px'
              }}
            >
              <img
                src={`/api/get/templateProxy/${String(renderCertificate._id)}|verse?t=${Date.now()}`}
                alt="Verso do Certificado"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                crossOrigin="anonymous"
              />
            </div>
          )}
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
      <main className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 ${stylePoppins.className}`}>
        <div className="w-full max-w-md sm:max-w-lg bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 z-10">
          <article className="space-y-4 sm:space-y-5 text-center">
            <div className="flex items-center justify-center">
              <Image
                className="rounded-full"
                width={80}
                height={80}
                alt="Logo"
                src="/logoDadg02.png"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 px-2">
                {`Validação de Certificados`.toLocaleUpperCase()}
              </h1>
              <h2 className="font-medium text-gray-600 text-xs sm:text-sm md:text-base mt-2">
                Pesquise usando: Nome
              </h2>
            </div>
          </article>
          <article className="mt-4 sm:mt-6">
            <SearchInput />
          </article>
        </div>
      </main>
    </div>
  );
}
