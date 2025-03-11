"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal"],
});

const ligas = [
  "LACOHP",
  "LAFIM",
  "LAPS",
  "LAPA",
  "LAI",
  "LAFARM",
  "LAME",
  "LAMFAC",
  "LAIC",
  "LIGAMI",
  "LAPLAST",
  "LACCA",
  "LAMELP",
  "LAOT",
  "UROLIGA",
  "LUMA",
  "LUME",
  "LUCMSC",
  "LAGASTRO",
  "LAGEM",
  "LANUT",
  "LASEM",
  "LAAD",
  "LACOR",
  "LADERM",
  "LAGO",
  "LANE",
  "LAONCO",
  "LANEFRO",
  "LAR",
  "LUPA",
  "LAARD",
  "LAOTO",
  "LAOA",
  "LIAP",
  "LAE",
];

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
          <p className="text-gray-700 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
            non justo in lacus fermentum fermentum. Nullam at ligula efficitur,
            hendrerit magna a, luctus erat. Quisque efficitur enim lorem, eu
            suscipit lectus fermentum quis.
          </p>
        </section>

        {/* Seção de Ligas (grid de botões) */}
        <section>
          <h2 className="text-3xl font-semibold text-green-700 mb-6 text-center">
            Ligas Acadêmicas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ligas.map((liga) => (
              <Link
                key={liga}
                href={`/clam/${liga.toLowerCase()}`}
                className="block bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                {liga}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
