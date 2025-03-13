'use client'
import React from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

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
        <p className="text-gray-700 text-lg text-start">
          O Diretório Acadêmico Diogo Guimarães é uma entidade representativa dos estudantes da Faculdade IMEPAC, que tem como principal missão fomentar a integração, a participação e o engajamento acadêmico dos alunos. Este diretório, batizado em homenagem a uma figura significativa para a instituição, atua como uma ponte entre os estudantes e a administração, facilitando a comunicação e a defesa dos interesses da comunidade acadêmica.
        </p>
      </section>

      {/* Seção com imagem e texto sobre a história */}
      <section className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-8 mb-12">
        <div className="relative w-full md:w-1/2 h-80">
          <Image
            src="/logoDadg02.png"
            alt="Sobre Nós"
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-[#09427d] mb-4">
            Nosso Papel
          </h2>
          <p className="text-gray-700 text-lg">
            O diretório acadêmico representa e defende os interesses dos estudantes, atuando como elo entre os alunos e a administração da instituição. Além disso, organiza eventos culturais e acadêmicos, promove a integração e incentiva o engajamento na vida universitária, contribuindo para o desenvolvimento pessoal e profissional de todos.
          </p>
        </div>
      </section>

      {/* Seção com a missão */}
      <section className="w-full max-w-4xl text-center">
        <h2 className="text-3xl font-semibold text-[#09427d] mb-4">
          Contato
        </h2>
        <p className="text-gray-700 text-lg">
          Fique a vontade para entrar em contato conosco por nossas redes sociais: <Link className='bg-red-800 px-1 py-1 font-extrabold text-white' href={"https://www.instagram.com/dadg.imepac/"}>@dadg.impeac</Link>.
        </p>
      </section>
    </main>
  );
}
