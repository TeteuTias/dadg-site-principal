'use client'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import Image from "next/image";


// w-[794px] h-[1123px] 
export default function Home() {
  const handleDownload = async () => {
    // Seleciona o elemento que queremos capturar
    const element = document.getElementById('downloadDiv');
    if (!element) return;

    // Cria um canvas a partir do elemento
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Cria um PDF com dimensões iguais ao canvas
    const pdf = new jsPDF({
      orientation: 'landscape', // Ajuste para 'portrait' se necessário
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    // Adiciona a imagem ao PDF
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('certificado.pdf');
  };
  return (
    <main className="relative flex flex-col max-w-screen overflow-hidden">
      {/* Cabeçalho fixo com o botão de download */}
      <div className="fixed top-0 bg-gray-100 w-full z-50">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Baixar Certificado
        </button>
      </div>

      {/* Área de exibição do certificado */}
      <article className="relative max-w-screen overflow-auto">
        <div
          id="downloadDiv"
          className="relative w-full"
          style={{ width: '2000px', height: '1414px' }}
        >
          {/* Frente do Certificado */}
          <div className="relative">
            <img
              src="/certificates/templates/template01.png"
              alt="Certificado"
              className="w-full h-full object-fill"
            />
            <div className="absolute flex items-center justify-center top-0 text-2xl font-bold text-gray-800 w-full h-full">
              <div className="relative -top-[100px] w-full">
                <p className="text-center text-[50px]">
                  MATEUS ROSA MARTINS
                </p>
              </div>
            </div>
          </div>

          {/* Verso do Certificado */}
          <div className="relative mt-10"> {/* opcional: adicionar margin-top para separar */}
            <img
              src="/certificates/templates/template01.png"
              alt="Certificado"
              className="w-full h-full object-fill"
            />
            <div className="absolute flex items-center justify-center top-0 text-2xl font-bold text-gray-800 w-full h-full">
              <div className="relative -top-[100px] w-full">
                <p className="text-center text-[50px]">
                  abcd
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

    </main>
  );
}


