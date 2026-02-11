
"use client"
import React from 'react';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';
import { ObjectId } from 'bson';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ICertificateWithEventIdPopulate } from '@/app/lib/models/CertificateModel';
import { libSourceSerif4 } from '@/public/fonts/lib/libSourceSerif4';
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";


//  export default function Home({ params }: { params: { certificateId: string } }) {

export default function Home({
  params,
}: {
  params: Promise<{ certificateId: string }>
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<ICertificateWithEventIdPopulate | null>(null)
  const router = useRouter()
  const [certificateId, setCertificateId] = useState<null | string>(null)

  const handleBack = () => {
    // Restaura o estado salvo e volta para a página de certificados
    router.push('/certificados');
  }
  const handleDownload = async () => {
    // Seleciona o elemento da frente
    const frontElement = document.getElementById('frontCert');
    if (!frontElement) return;

    // Renderiza o front
    const frontCanvas = await html2canvas(frontElement);
    const imgUrl = frontCanvas.toDataURL('image/png');
    const response = await fetch(imgUrl);
    const blob = await response.blob();

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
    if (data?.verse?.showVerse === true) {
      const backElement = document.getElementById('verseCert');
      if (backElement) {
        const backCanvas = await html2canvas(backElement);
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
    // Cria um Blob para o PDF
    // @ts-expect-error: Erro de tipificação
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    // Cria uma URL para o Blob e força o download
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${data?.eventName} - ${data?.ownerName}.pdf`;
    link.click();
    // Revoga a URL criada
    URL.revokeObjectURL(blobUrl);
  };


  useEffect(() => {
    const fetchData = async () => {
      const { certificateId } = await params
      setCertificateId(certificateId)
      const fetchData = await fetch(`/api/get/myCertificateById/${certificateId}`)

      if (!fetchData.ok) {
        router.push("/_error")
        return;
      }

      const fetchDataJson: { data: ICertificateWithEventIdPopulate, } = await fetchData.json()
      setData({ ...fetchDataJson.data, })
      setIsLoading(false)

    }
    fetchData()

  }, [params, router])

  if (isLoading) {
    return (
      <main className="relative flex flex-col max-w-screen overflow-hidden min-h-screen">
        <div className="fixed inset-0 flex items-center justify-center bg-[#09427D] bg-opacity-90 backdrop-blur-sm z-50">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Carregando Certificado</p>
                <p className="text-sm text-gray-600">Aguarde um momento...</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
  if (data?.certificatePath && ObjectId.isValid(String(data?.certificatePath))) {
    return (
      <main className="relative flex flex-col max-w-screen overflow-hidden">
        <div className='absolute min-h-svg min-w-full z-[500]'>
          <Fireworks autorun={{
            speed: 1.5,
            duration: 1500,
            delay: 0
          }} />
        </div>
        {/* Cabeçalho fixo com botão de voltar */}
        <div className="flex justify-between items-center p-3 sm:p-5 bg-blue-900 w-full z-50">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <div className="text-center px-2 flex-1">
            <h1 className='text-white font-medium text-xs sm:text-sm md:text-base'>Clique em baixar para ver o certificado completo</h1>
          </div>
          <div className="w-20 sm:w-24"></div>
        </div>
        <div
          id="frontCert"
          className="relative w-full"
          style={{
            width: '100%',
            maxWidth: '2000px',
            aspectRatio: '2000 / 1414',
            margin: '0 auto'
          }}
        >
          <iframe
            className='w-full h-full'
            src={`/api/get/templateScanProxy/${data.certificatePath}|front?t=${Date.now()}`}
            title="Certificado"
          />
        </div>
      </main>
    )
  }

  if (data?.onlyImage === true) {
    return (
      <main className="relative flex flex-col max-w-screen overflow-hidden">
        <div className='absolute min-h-svg min-w-full z-[500]'>
          <Fireworks autorun={{
            speed: 1.5,
            duration: 1500,
            delay: 0
          }} />
        </div>
        {/* Cabeçalho fixo com o botão de download */}
        <div className="flex justify-between items-center p-3 sm:p-5 bg-blue-900 w-full z-50 gap-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base flex-shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <div className="flex flex-col items-center gap-2 flex-1">
            <button
              onClick={handleDownload}
              className="w-full sm:w-fit px-4 py-2 bg-blue-600 text-white rounded bg-[#09427D] font-bold border-2 border-white hover:text-[#09427D] hover:border-[#09427D] hover:bg-white duration-300 ease-in text-sm sm:text-base"
            >
              BAIXAR CERTIFICADO
            </button>
            <h1 className='text-white font-medium text-xs sm:text-sm md:text-base text-center'>Clique em baixar para ver o certificado completo</h1>
          </div>
          <div className="w-20 sm:w-24 flex-shrink-0"></div>
        </div>
        <div
          id="frontCert"
          className="relative w-full"
          style={{
            width: '100%',
            maxWidth: '2000px',
            aspectRatio: '2000 / 1414',
            margin: '0 auto'
          }}
        >
          <img
            src={`/api/get/templateProxy/${certificateId}|front?t=${Date.now()}`}
            alt="Certificado"
            className="w-full h-full object-contain"
          />
        </div>
      </main>
    )
  }

  return (
    <main className="relative flex flex-col max-w-screen overflow-hidden">
      <div className='absolute min-h-svg min-w-full z-[500]'>
        <Fireworks autorun={{
          speed: 1.5,
          duration: 1500,
          delay: 0
        }} />
      </div>
      {/* Cabeçalho fixo com o botão de download */}
      <div className="flex justify-between items-center p-3 sm:p-5 bg-blue-900 w-full z-50 gap-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base flex-shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>
        <div className="flex flex-col items-center gap-2 flex-1">
          <button
            onClick={handleDownload}
            className="w-full sm:w-fit px-4 py-2 bg-blue-600 text-white rounded bg-[#09427D] font-bold border-2 border-white hover:text-[#09427D] hover:border-[#09427D] hover:bg-white duration-300 ease-in text-sm sm:text-base"
          >
            BAIXAR CERTIFICADO
          </button>
          <h1 className='text-white font-medium text-xs sm:text-sm md:text-base text-center'>Clique em baixar para ver o certificado completo</h1>
        </div>
        <div className="w-20 sm:w-24 flex-shrink-0"></div>
      </div>

      {/* Área de exibição dos certificados */}
      {
        !data?.frontBottomText || !data?.frontTopperText ?
          <article className="relative max-w-screen overflow-auto">
            {/* Frente do Certificado */}
            <div
              id="frontCert"
              className="relative w-full"
              style={{
                width: '100%',
                maxWidth: '2000px',
                aspectRatio: '2000 / 1414',
                margin: '0 auto'
              }}
            >
              <img
                src={`/api/get/templateProxy/${certificateId}|front?t=${Date.now()}`}
                alt="Certificado"
                className="w-full h-full object-contain"
              />
              <div className="absolute flex flex-col items-center justify-center top-0 font-bold w-full h-full px-4">
                <div className='w-full max-w-[70%]'>
                  <div className="relative flex flex-col space-y-3 sm:space-y-5 items-center content-center justify-center mb-[8%] sm:mb-[115px] w-full">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center" style={{ ...libSourceSerif4.style, fontWeight: "400" }}>{data?.ownerName}</p>
                    <p className='font-thin text-xs sm:text-sm md:text-base text-center'>
                      Código de Verificação: {String(data?._id)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
          :
          <article className="relative max-w-screen overflow-auto">
            {/* Frente do Certificado */}
            <div
              id="frontCert"
              className="relative w-full"
              style={{
                width: '100%',
                maxWidth: '2000px',
                aspectRatio: '2000 / 1414',
                margin: '0 auto'
              }}
            >
              <img
                src={`/api/get/templateProxy/${certificateId}|front?t=${Date.now()}`}
                alt="Certificado"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-[20%] sm:top-[350px] left-0 sm:-left-[125px] flex items-center justify-center content-center w-full sm:w-auto px-4 sm:px-0 bg-yellow-900"
              >

                <div className='w-full sm:w-[85%]'>
                  <div className="flex flex-col items-center justify-center font-bold space-y-3 sm:space-y-5 bg-yellow-100">
                    <div className="relative flex flex-col space-y-3 sm:space-y-5 items-center content-center justify-center w-full" style={{ ...data?.eventId.styleContainer }}>

                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-center" style={{ ...libSourceSerif4.style, ...data?.eventId.styleFrontTopperText }}>
                        {
                          !data?.frontTopperText ?
                            ""
                            : data?.frontTopperText
                        }
                      </p>

                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center" style={{ ...libSourceSerif4.style, ...data?.eventId.styleNameText }}>{data?.ownerName.toUpperCase()}</p>

                      <p className='font-thin text-xs sm:text-sm md:text-base text-center' onClick={() => console.log(data)}>
                        Código de Verificação: {String(data?._id)}
                      </p>

                      <p className='whitespace-pre-line text-xs sm:text-sm md:text-base lg:text-lg text-center' style={{ ...libSourceSerif4.style, ...data?.eventId.styleFrontBottomText, whiteSpace: 'pre-wrap' }}>
                        {
                          !data?.frontBottomText ?
                            "" :
                            data?.frontBottomText.replace(/\\n/g, "\n").split("\n").map((linha, indice) => (
                              <React.Fragment key={indice}>
                                {linha}
                                <br />
                              </React.Fragment>
                            ))
                        }
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </article>
      }

      {
        data?.verse?.showVerse == true &&
        <article className="relative max-w-screen overflow-auto">
          {/* Verso do Certificado */}
          <div
            id="verseCert"
            className="relative w-full"
            style={{
              width: '100%',
              maxWidth: '2000px',
              aspectRatio: '2000 / 1414',
              margin: '0 auto'
            }}
          >
            <img
              src={`/api/get/templateProxy/${certificateId}|verse?t=${Date.now()}`}
              alt="Certificado"
              className="w-full h-full object-contain"
            />
            <div className="absolute flex flex-col items-center justify-center top-0 font-bold w-full h-full px-4 overflow-auto">
              <div className="w-full max-w-[90%] sm:max-w-[80%] overflow-x-auto">
                <table className="w-full" style={{ ...data?.eventId?.styleContainerVerse?.containerStyle, ...data?.eventId?.styleContainerVerse?.headerStyle }}>
                  <thead>
                    <tr>
                      {
                        data?.verse?.headers?.map((header, index) => (
                          <th key={index} className="text-center text-xs sm:text-sm md:text-base lg:text-lg font-bold px-2" style={{ ...data?.eventId?.styleContainerVerse?.headerStyle }}>
                            {header}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data?.verse?.rows?.map((row, index) => (
                        <tr key={index}>
                          {
                            row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="text-center text-xs sm:text-sm md:text-base px-2" style={{ ...libSourceSerif4.style, ...data?.eventId?.styleContainerVerse?.rowsStyle }}>
                                {cell}
                              </td>
                            ))
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </article>
      }
    </main >
  );
}