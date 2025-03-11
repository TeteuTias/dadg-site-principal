'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

const stylePoppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

export default function Home() {
  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen w-full p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
      style={stylePoppins.style}
    >
      {/* Elemento decorativo: onda SVG na parte inferior */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg
          className="w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#09427d"
            fillOpacity="0.1"
            d="M0,256L60,245.3C120,235,240,213,360,186.7C480,160,600,128,720,128C840,128,960,160,1080,170.7C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        {/* Logo em formato circular */}
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/logoDadg02.png"
            alt="Logo Diretório Acadêmico"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#09427d] mb-4 tracking-wide">
          DIRETÓRIO ACADÊMICO DIOGO GUIMARÃES
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mb-8">
          Conectando estudantes e promovendo iniciativas inovadoras para o futuro.
        </p>
        <Link
          href="/sobre"
          className="px-8 py-3 bg-[#09427d] text-white font-semibold rounded-full hover:bg-[#073366] transition-colors duration-300"
        >
          Saiba Mais
        </Link>
      </div>
    </main>
  );
}
