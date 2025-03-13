'use client'
import React from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { FaInstagram } from 'react-icons/fa';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

const instagramAccounts = [
  {
    name: "DADG ImePAC",
    handle: "@dadg.imepac",
    url: "https://instagram.com/dadg.imepac",
  },
  {
    name: "CAEP ImePAC",
    handle: "@caep.imepac",
    url: "https://instagram.com/caep.imepac",
  },
  {
    name: "CLAM ImePAC",
    handle: "@clam.imepac",
    url: "https://instagram.com/clam.imepac",
  },
  {
    name: "CLEVI ImePAC Araguari",
    handle: "@clevimepacaraguari",
    url: "https://instagram.com/clevimepacaraguari",
  },
  {
    name: "CAES ImePAC",
    handle: "@caes.imepac",
    url: "https://instagram.com/caes.imepac",
  },
  {
    name: "COEPS Araguari",
    handle: "@coeps.araguari",
    url: "https://instagram.com/coeps.araguari",
  },
];

export default function ContatoPage() {
  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-8 overflow-hidden"
      style={poppins.style}
    >
      {/* Fundo dinâmico com ondas */}
      <div className="absolute inset-0 -z-10">
        {/* Fundo base: gradiente suave de verde e branco */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-green-50"></div>
        {/* Onda superior */}
        <svg
          className="absolute top-0 left-0 w-full h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#a7f3d0"
            fillOpacity="0.4"
            d="M0,64L80,96C160,128,320,192,480,202.7C640,213,800,171,960,149.3C1120,128,1280,128,1360,128L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
        {/* Onda inferior */}
        <svg
          className="absolute bottom-0 left-0 w-full h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#6ee7b7"
            fillOpacity="0.4"
            d="M0,256L80,240C160,224,320,192,480,149.3C640,107,800,53,960,32C1120,11,1280,21,1360,26.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Cabeçalho */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#09427d] uppercase mb-4">Contato</h1>
        <p className="text-lg text-[#09427d]">
          Siga-nos no Instagram para ficar por dentro das novidades
        </p>
      </header>

      {/* Grid de Perfis */}
      <section className="w-full max-w-4xl grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {instagramAccounts.map((account) => (
          <Link
            key={account.handle}
            href={account.url}
            target="_blank"
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="mb-4">
              <FaInstagram className="w-12 h-12 text-[#09427d]" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#09427d] uppercase">
                {account.name}
              </h2>
              <p className="text-lg text-gray-600">{account.handle}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
