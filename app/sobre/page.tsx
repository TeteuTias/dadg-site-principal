'use client'
import React from 'react';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { motion } from 'framer-motion';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

export default function SobreNos() {
  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 md:px-12 py-16 bg-gradient-to-br from-blue-100 via-white to-blue-100 text-[#09427d] overflow-hidden"
      style={poppins.style}
    >
      {/* Seção de Cabeçalho */}
      <motion.section 
        className="w-full max-w-4xl mb-12 text-center"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold text-[#0b3d91] mb-6 tracking-wide">
          Sobre Nós
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          O Diretório Acadêmico Diogo Guimarães é uma entidade representativa dos estudantes da Faculdade IMEPAC, 
          que tem como principal missão fomentar a integração, a participação e o engajamento acadêmico dos alunos.
        </p>
      </motion.section>

      {/* Seção com imagem e texto sobre a história */}
      <motion.section 
        className="flex flex-col md:flex-row items-center w-full max-w-5xl gap-10 mb-16"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative w-full md:w-1/2 h-80 shadow-xl rounded-lg overflow-hidden">
          <Image
            src="/logoDadg02.png"
            alt="Sobre Nós"
            fill
            className="object-cover transform  transition-all duration-500"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-[#0b3d91] mb-4">
            Nosso Papel
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            O diretório acadêmico representa e defende os interesses dos estudantes, atuando como elo entre os alunos e 
            a administração da instituição. Além disso, organiza eventos culturais e acadêmicos, promovendo integração 
            e incentivando o engajamento na vida universitária.
          </p>
        </div>
      </motion.section>

      {/* Seção com a missão */}
      <motion.section 
        className="w-full max-w-4xl text-center bg-blue-50 px-6 py-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2 className="text-3xl font-semibold text-[#0b3d91] mb-4">
          Contato
        </h2>
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          Fique à vontade para entrar em contato conosco por nossas
        </p>
        <Link
          className="inline-block bg-red-700 px-6 py-3 font-bold text-white text-lg rounded-full shadow-md hover:bg-red-800 transition-all duration-300"
          href="/contato"
        >
          Redes Sociais
        </Link>
      </motion.section>
    </main>
  );
}
