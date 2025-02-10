'use client'
import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Poppins } from 'next/font/google';

const stylePoppins = Poppins({ subsets: ["latin", "latin-ext"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], style: ['normal', 'italic'] })

// w-[794px] h-[1123px] 
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center content-center max-w-screen overflow-hidden bg-white min-h-svh w-full space-y-10"
      style={stylePoppins.style}
    >
      <article className='space-y-5'>
        <div className='flex items-center justify-center'>
          <Image
            className='rounded-full'
            width={115}
            height={115}
            alt=""
            src="/logoDadg02.png"
          />
        </div>
        <div>
          <h1 className='text-[30px] font-bold text-center'>{`Diretório Acadêmico Diogo Guimarães`.toLocaleUpperCase()}</h1>
          <div>
            <h1 className='text-center font-semithin text-center'>[ Novidades Em Breve ]</h1>
          </div>
        </div>
      </article>
      <article>
        <div>
          <Link prefetch={true} href={"/certificados"} className='bg-[#09427D] text-white border-[0.5px] border-black px-2 py-1 font-bold rounded-xl hover:text-[#09427D] hover:bg-white duration-150 ease-in'>CERTIFICADOS</Link>
        </div>
      </article>
    </main>
  );
}


