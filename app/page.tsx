'use client'
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import Typewriter from './components/TypeWriter';
import WaveAnimation from './components/WaveComponent';

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
      Silvio s2
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
