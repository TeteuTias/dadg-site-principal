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
    url: "https://instagram.com/dadg.imepac"
  },
  {
    name: "CAEP ImePAC",
    handle: "@caep.imepac",
    url: "https://instagram.com/caep.imepac"
  },
  {
    name: "CLAM ImePAC",
    handle: "@clam.imepac",
    url: "https://instagram.com/clam.imepac"
  },
  {
    name: "CLEVI ImePAC Araguari",
    handle: "@clevimepacaraguari",
    url: "https://instagram.com/clevimepacaraguari"
  },
  {
    name: "CAES ImePAC",
    handle: "@caes.imepac",
    url: "https://instagram.com/caes.imepac"
  },
  {
    name: "COEPS Araguari",
    handle: "@coeps.araguari",
    url: "https://instagram.com/coeps.araguari"
  }
];

export default function ContatoPage() {
  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50"
      style={poppins.style}
    >
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
              <p className="text-lg text-gray-600">
                {account.handle}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
