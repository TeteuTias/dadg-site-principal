'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

const stylePoppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

interface TypewriterProps {
  text: string;
  speed?: number;
}

function Typewriter({ text, speed = 100 }: TypewriterProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const randomDelay = speed + Math.random() * 50;
      const timeoutId = setTimeout(() => setIndex(index + 1), randomDelay);
      return () => clearTimeout(timeoutId);
    }
  }, [index, text, speed]);

  return (
    <span>
      {text.slice(0, index)}
      {index < text.length && <span className="blinking-cursor">|</span>}
    </span>
  );
}

function WaveAnimation() {
  return (
    <div className="absolute bottom-0 left-0 w-full pointer-events-none">
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(9,66,125,0.7)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(9,66,125,0.5)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(9,66,125,0.3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="#09427d" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen w-full p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
      style={stylePoppins.style}
    >
      <div className="z-10 flex flex-col items-center text-center max-w-4xl mx-auto pb-32">
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/logoDadg02.png"
            alt="Logo Diretório Acadêmico"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#09427d] mb-4 tracking-wide">
          <Typewriter text="DIRETÓRIO ACADÊMICO DIOGO GUIMARÃES" speed={100} />
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mb-8">
          Conectando estudantes e promovendo iniciativas inovadoras para o futuro.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
          <div className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-300 overflow-hidden transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-[#09427d] transform group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#09427d] font-semibold mb-2 text-xl group-hover:text-[#073366] transition-colors duration-300">Certificados</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">Acesse e baixe seus certificados de participação em eventos.</p>
                <Link href="/certificados" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-sm group-hover:translate-x-2 transition-all duration-300">
                  Ver Certificados
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-300 overflow-hidden transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-[#09427d] transform group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#09427d] font-semibold mb-2 text-xl group-hover:text-[#073366] transition-colors duration-300">Coordenadorias</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">Conheça nossas coordenadorias e suas atividades acadêmicas.</p>
                <Link href="/coordenadorias" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-sm group-hover:translate-x-2 transition-all duration-300">
                  Ver Coordenadorias
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-300 overflow-hidden transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-[#09427d] transform group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#09427d] font-semibold mb-2 text-xl group-hover:text-[#073366] transition-colors duration-300">Eventos</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">Acompanhe os próximos eventos e atividades programadas.</p>
                <Link href="/eventos" className="inline-flex items-center text-[#09427d] hover:text-[#073366] font-medium text-sm group-hover:translate-x-2 transition-all duration-300">
                  Ver Eventos
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/sobre"
            className="px-8 py-3 bg-[#09427d] text-white font-semibold rounded-full hover:bg-[#073366] transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            Saiba Mais
          </Link>
          <Link
            href="/contato"
            className="px-8 py-3 border-2 border-[#09427d] text-[#09427d] font-semibold rounded-full hover:bg-[#09427d] hover:text-white transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            Entre em Contato
          </Link>
        </div>
      </div>
      <WaveAnimation />
    </main>
  );
}
