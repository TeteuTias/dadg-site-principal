'use client'
import React from 'react';
import { Poppins } from 'next/font/google';
import Image from 'next/image';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

export default function LacohpPage() {
  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden p-8 bg-gradient-to-br from-green-100 via-white to-green-50"
      style={poppins.style}
    >
      {/* Onda superior (design novo) */}
      <div className="absolute top-0 left-0 w-full -z-10">
        <svg
          className="w-full h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#16a34a"
            fillOpacity="0.1"
            d="M0,128L80,117.3C160,107,320,85,480,101.3C640,117,800,171,960,181.3C1120,192,1280,160,1360,144L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Onda inferior (design novo) */}
      <div className="absolute bottom-0 left-0 w-full -z-10">
        <svg
          className="w-full h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#16a34a"
            fillOpacity="0.1"
            d="M0,192L80,202.7C160,213,320,235,480,240C640,245,800,235,960,202.7C1120,171,1280,117,1360,90.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Espaço para a logo da liga (placeholder) */}
        <header className="mb-8">
          <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-gray-400">Logo</span>
          </div>
        </header>

        {/* Título da Liga */}
        <section className="w-full text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700 uppercase mb-4">
            LACOHP
          </h1>
          <p className="text-lg text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Slogan ou breve descrição da liga LACOHP.
          </p>
        </section>

        {/* Seção "Quem Somos" */}
        <section className="w-full max-w-4xl mb-8">
          <h2 className="text-3xl font-semibold text-green-700 mb-3">Quem Somos</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra lacus in magna elementum, vitae elementum libero malesuada. Donec sit amet semper magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti.
          </p>
        </section>

        {/* Seção "O Que Buscamos" */}
        <section className="w-full max-w-4xl mb-8">
          <h2 className="text-3xl font-semibold text-green-700 mb-3">O Que Buscamos</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada, nisl vel fermentum porta, lectus libero convallis justo, non posuere ex urna ut mauris. Nulla facilisi. Fusce tincidunt, magna non efficitur pharetra, orci justo volutpat neque, at tincidunt ex nulla ac mi.
          </p>
        </section>

        {/* Seção "O Que Acreditamos" */}
        <section className="w-full max-w-4xl mb-8">
          <h2 className="text-3xl font-semibold text-green-700 mb-3">O Que Acreditamos</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac felis sit amet lacus tincidunt consequat. Vivamus a diam ac dolor hendrerit interdum. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          </p>
        </section>
      </div>
    </main>
  );
}
