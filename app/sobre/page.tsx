'use client'
import React from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

export default function SobreNos() {
  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen w-full p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden"
      style={poppins.style}
    >
      {/* Seção de Cabeçalho */}
      <section className="w-full max-w-4xl mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#09427d] mb-4">
          Sobre Nós
        </h1>
        <p className="text-gray-700 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec nisi et sapien mollis tristique. Integer pretium, nisl at aliquet malesuada, justo mi fermentum lorem, nec lacinia ipsum elit ut nisi.
        </p>
      </section>

      {/* Seção com imagem e texto sobre a história */}
      <section className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-8 mb-12">
        <div className="relative w-full md:w-1/2 h-80">
          <Image
            src="/about-us.jpg"
            alt="Sobre Nós"
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-[#09427d] mb-4">
            Nossa História
          </h2>
          <p className="text-gray-700 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl vel tincidunt convallis, urna mi bibendum risus, vitae aliquam massa nisl ut sem. Praesent quis elit quis ex fermentum hendrerit.
          </p>
        </div>
      </section>

      {/* Seção com a missão */}
      <section className="w-full max-w-4xl text-center">
        <h2 className="text-3xl font-semibold text-[#09427d] mb-4">
          Nossa Missão
        </h2>
        <p className="text-gray-700 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non justo in lacus fermentum fermentum. Aliquam erat volutpat. Nullam at ligula efficitur, hendrerit magna a, luctus erat.
        </p>
      </section>
    </main>
  );
}
