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
      <div className="z-10 flex flex-col items-center text-center">
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
        <Link
          href="/sobre"
          className="px-8 py-3 bg-[#09427d] text-white font-semibold rounded-full hover:bg-[#073366] transition-colors duration-300"
        >
          Saiba Mais
        </Link>
      </div>
      <WaveAnimation />
    </main>
  );
}
