"use client";
import React from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal"],
});


export default function ClamPage() {
  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden p-8"
      style={poppins.style}
    >
      {/* Imagem de fundo com opacidade */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/CLAM_logo.png" // Certifique-se de que o arquivo esteja em public/
          alt="CLAM Logo"
          fill
          className="object-contain opacity-10"
          priority
        />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-12">
        {/* Seção de título e introdução */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Coordenadoria de Ligas Acadêmicas de Medicina
          </h1>
          <p className="text-2xl font-bold text-green-700 mb-4">
            [EM BREVE]
          </p>
        </section>
      </div>
    </main>
  );
}
