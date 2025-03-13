import React from 'react';
import { Poppins } from 'next/font/google';
import ScheduleClient from '../components/ScheduleClient';

const stylePoppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: [
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900'
  ],
  style: ['normal', 'italic']
});

export default function AgendaPage() {
  return (
    <main
      className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50"
      style={stylePoppins.style}
    >
      <div className='w-full text-center'>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#09427d] mb-4 tracking-wide">
          CALENDÁRIO DE EVENTOS
        </h1>
      </div>
      <ScheduleClient />
    </main>
  );
}
