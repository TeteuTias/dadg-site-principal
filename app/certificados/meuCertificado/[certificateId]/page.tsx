
"use client"
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Kindred from '@/public/fonts/lib/libFontKindred';
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
  //const [certificateId, setCertificateId] = useState<null | string>(null)

  const handleDownload = async () => {
    // Detecta se é dispositivo móvel (ajuste o valor conforme sua necessidade)
    const isMobile = window.innerWidth < 768;
    // Se mobile, reduz o scale para diminuir a carga de processamento (ex.: 0.8 em vez de 1)
    const scale = isMobile ? 0.8 : 1;

    // Seleciona os elementos de frente e verso
    const frontElement = document.getElementById('frontCert');
    if (!frontElement /* || !backElement*/) return;

    // Captura os elementos de forma concorrente, verificando se backElement existe
const frontCanvas = await html2canvas(frontElement, { scale });




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


  useEffect(() => {
    const fetchData = async () => {
      const { certificateId } = await params
      const fetchData = await fetch(`/api/get/myCertificateById/${certificateId}`)

      if (!fetchData.ok) {
        router.push("/_error")
        return;
      }

      const fetchDataJson: { data: ICertificateWithEventIdPopulate } = await fetchData.json()
      setData(fetchDataJson.data)
      setIsLoading(false)
      console.log(fetchDataJson)
    }
    fetchData()

  }, [params, router])

  if (isLoading) {
    return (
      <main className="relative flex flex-col max-w-screen overflow-hidden">
        <div className="fixed inset-0 flex items-center justify-center bg-[#09427D] bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg" onClick={() => {
              // isso daqui so serve para eu colocar as fontes que uso, e conseguir contornar o ESlint rules.
              console.log(Kindred)
            }}>C A R R E G A N D O</p>
          </div>
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
      <div className="flex justify-center items-center p-5 bg-blue-900 w-full z-50 flex flex-col">
        <button
          onClick={handleDownload}
          className="w-fit px-4 py-2 bg-blue-600 text-white rounded bg-[#09427D] font-bold border-2 border-white hover:text-[#09427D] hover:border-[#09427D] hover:bg-white duration-300 ease-in"
        >
          BAIXAR CERTIFICADO
        </button>
        <div>
          <h1 className='text-white font-medium '>Clique em baixar para ver o certificado completo</h1>
        </div>
      </div>

      {/* Área de exibição dos certificados */}
      {
        !data?.frontBottomText || !data?.frontTopperText ?
          <article className="relative max-w-screen overflow-auto">
            {/* Frente do Certificado */}
            <div
              id="frontCert"
              className="relative w-full"
              style={{ width: '2000px', height: '1414px' }}
            >
              <img
                src={data?.eventId.templatePath}
                alt="Certificado"
                className="w-full h-full object-fill"
              />
              <div className="absolute flex flex-col items-center justify-center top-0 font-bold w-full h-full">
                <div className=' w-[70%]'>
                  <div className="relative flex flex-col space-y-5 items-center content-center justify-center mb-[115px] w-full ">
                    <p className="" style={{ ...libSourceSerif4.style, fontWeight: "400" }}>{data?.ownerName}</p>
                    <br />
                    <p className='font-thin'>
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
              className="relative"
              style={{ width: '2000px', height: '1414px' }}
            >
              <img
                src={data?.eventId.templatePath}
                alt="Certificado"
                className="w-full h-full object-fill"
              />
              <div className="absolute top-[350px] -left-[125px] flex items-center justify-center content-center">

                <div className='w-[85%]'>
                  <div className="flex flex-col items-center justify-center font-bold space-y-5">
                    <div className="relative flex flex-col space-y-5 items-center content-center justify-center  w-full " style={{ ...data?.eventId.styleContainer, }}>


                      <p style={{ ...libSourceSerif4.style, ...data?.eventId.styleFrontTopperText }}>
                        {
                          !data?.frontTopperText ?
                            ""
                            : data?.frontTopperText
                        }
                      </p>

                      <p style={{ ...libSourceSerif4.style, ...data?.eventId.styleNameText }}>{data?.ownerName.toUpperCase()}</p>
                      {/* " font-thin  leading-[1]" */}
                      <p className='font-thin' onClick={() => console.log(data)}>
                        Código de Verificação: {String(data?._id)}
                      </p>

                      <p className='whitespace-pre-line' style={{ ...libSourceSerif4.style, ...data?.eventId.styleFrontBottomText, whiteSpace: 'pre-wrap', }}>
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

    </main >
  );
}