
"use client"
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Kindred from '@/public/fonts/lib/libFontKindred';
import fontCormorantGaramond from '@/public/fonts/lib/libCormorant Garamond';

export default function Home() {
  const handleDownload = async () => {
    // Detecta se é dispositivo móvel (ajuste o valor conforme sua necessidade)
    const isMobile = window.innerWidth < 768;
    // Se mobile, reduz o scale para diminuir a carga de processamento (ex.: 0.8 em vez de 1)
    const scale = isMobile ? 0.8 : 1;

    // Seleciona os elementos de frente e verso
    const frontElement = document.getElementById('frontCert');
    // const backElement = document.getElementById('backCert');
    if (!frontElement /* || !backElement*/) return;

    // Captura os dois elementos de forma concorrente
    const [frontCanvas, /*backCanvas*/] = await Promise.all([
      html2canvas(frontElement, { scale }),
      //html2canvas(backElement, { scale }),
    ]);

    const frontImgData = frontCanvas.toDataURL('/certificates/templates/template02.png');
    //const backImgData = backCanvas.toDataURL('image/png');

    // Cria o PDF usando as dimensões do canvas da frente
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [frontCanvas.width, frontCanvas.height],
    });

    // Adiciona a primeira página com a imagem da frente
    pdf.addImage(frontImgData, 'PNG', 0, 0, frontCanvas.width, frontCanvas.height);

    // Adiciona uma nova página para a imagem do verso
    //pdf.addPage([backCanvas.width, backCanvas.height], 'landscape');
    //pdf.addImage(backImgData, 'PNG', 0, 0, backCanvas.width, backCanvas.height);

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

      {/* Área de exibição dos certificados */}
      <article className="relative max-w-screen overflow-auto">
        {/* Frente do Certificado */}
        <div
          id="frontCert"
          className="relative w-full"
          style={{ width: '2000px', height: '1414px' }}
        >
          <img
            src="/certificates/templates/template02.png"
            alt="Certificado"
            className="w-full h-full object-fill"
          />
          <div className="absolute flex flex-col items-center justify-center top-0 text-2xl font-bold w-full h-full">
            <div className=' w-[70%]'>
              <div className="relative mb-[115px] w-full text-center">
                <p className="text-center text-[120px] font-thin text-[#02425A]" style={Kindred.style}>Nicoly Gonzaga Ferreira</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verso do Certificado */}
        {/*
        <div
          id="backCert"
          className="relative w-full mt-10"
          style={{ width: '2000px', height: '1414px' }}
        >
          <img
            src="/certificates/templates/template01.png"
            alt="Certificado"
            className="w-full h-full object-fill"
          />
          <div className="absolute flex items-center justify-center top-0 text-2xl font-bold text-gray-800 w-full h-full">
            <div className="relative -top-[100px] w-full">
              <p className="text-center text-[50px]">abcd</p>
            </div>
          </div>
        </div>
        */}
      </article>
    </main>
  );
}

