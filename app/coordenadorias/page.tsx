'use client';

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, HeartHandshake, Stethoscope, Microscope, Globe } from "lucide-react";

const coordenadorias = [
  {
    href: "/coordenadorias/caep",
    label: "CAEP",
    title: "Extensão e Pesquisa",
    desc: "Coordenadoria Acadêmica de Extensão e Pesquisa. Fomentando a produção científica e projetos sociais.",
    icon: <Microscope className="w-10 h-10 text-blue-300" />
  },
  {
    href: "/coordenadorias/caes",
    label: "CAES",
    title: "Educação em Saúde",
    desc: "Coordenadoria Acadêmica de Educação em Saúde. Focada na promoção da saúde e educação continuada.",
    icon: <HeartHandshake className="w-10 h-10 text-blue-300" />
  },
  {
    href: "/coordenadorias/clam",
    label: "CLAM",
    title: "Ligas Acadêmicas",
    desc: "Coordenadoria de Ligas Acadêmicas de Medicina. Integrando o ensino prático e teórico extracurricular.",
    icon: <Stethoscope className="w-10 h-10 text-blue-300" />
  },
  {
    href: "/coordenadorias/cac",
    label: "CAC",
    title: "Certificados e TI",
    desc: "Coordenadoria Acadêmica de Certificados e TI. Inovação tecnológica e gestão documental do DADG.",
    icon: <BookOpen className="w-10 h-10 text-blue-300" />
  },
  {
    href: "/coordenadorias/clev",
    label: "CLEV",
    title: "Estágios e Vivências",
    desc: "Coordenadoria Local de Estágios e Vivências. Intercâmbio médico e experiências práticas internacionais.",
    icon: <Globe className="w-10 h-10 text-blue-300" />
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CoordenadoriasPage() {
  return (
    <main className="min-h-screen bg-[#001021] flex flex-col">
      {/* HERO INTERNO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center text-center bg-[#002B5B]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00152b] to-[#002B5B] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif tracking-tight drop-shadow-md">
            Nossas Coordenadorias
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 font-light leading-relaxed">
            As engrenagens que movem o Diretório Acadêmico. Conheça as pastas dedicadas a enriquecer a experiência dos estudantes de medicina do IMEPAC, desde a pesquisa científica até o intercâmbio internacional.
          </p>
        </motion.div>
      </section>

      {/* WAVE DE TRANSIÇÃO (Opcional, para manter a fluidez) */}
      <div className="w-full bg-[#002B5B]">
        <svg viewBox="0 0 1440 120" className="w-full h-auto block" preserveAspectRatio="none">
          <path fill="#001021" d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* GRID DE COORDENADORIAS */}
      <section className="flex-grow px-6 py-20 pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {coordenadorias.map((coord) => (
            <motion.div key={coord.label} variants={cardVariants}>
              <Link href={coord.href} className="block h-full outline-none">
                <div className="group relative flex flex-col h-full p-8 rounded-3xl
                             bg-white/[0.04] hover:bg-white/[0.08]
                             border border-white/10 hover:border-white/25
                             shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
                             backdrop-blur-md
                             hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer"
                >
                  {/* Glow de fundo */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="text-white mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                    {coord.icon}
                  </div>
                  
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-white font-serif">{coord.label}</h2>
                    <span className="text-sm font-medium text-blue-300 tracking-wider uppercase">{coord.title}</span>
                  </div>
                  
                  <p className="text-blue-100/70 text-sm md:text-base leading-relaxed flex-grow">
                    {coord.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-8 text-white font-bold text-sm uppercase tracking-wider transition-colors group-hover:text-blue-200">
                    Ver Ações
                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
