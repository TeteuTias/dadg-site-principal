'use client';

import React from "react";
import { motion } from "framer-motion";
import { Target, Lightbulb, Microscope, ChevronRight } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function CaepPage() {
  return (
    <main className="min-h-screen bg-[#001021] text-white pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[#002B5B]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb & Title */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-blue-300/60 text-sm font-medium mb-4">
            <Link href="/coordenadorias" className="hover:text-blue-300 transition-colors">Coordenadorias</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-200">CAEP</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
              <Microscope className="w-10 h-10 text-blue-300" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight drop-shadow-md">
                CAEP
              </h1>
              <p className="text-blue-200/80 text-lg">Extensão e Pesquisa</p>
            </div>
          </div>
        </motion.div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Mission & Projects */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-8"
          >
            {/* Missão da Pasta */}
            <motion.section variants={fadeInUp} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-transparent rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative p-8 rounded-3xl bg-[#00152b]/80 backdrop-blur-md border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold font-serif text-white">Missão da Pasta</h2>
                </div>
                <p className="text-blue-100/80 leading-relaxed text-lg">
                  Fomentar o pensamento científico e a responsabilidade social entre os estudantes de medicina do IMEPAC. A CAEP atua como ponte entre a sala de aula e a comunidade, desenvolvendo projetos de extensão que impactam a sociedade e pesquisas que avançam a fronteira do conhecimento médico.
                </p>
              </div>
            </motion.section>

            {/* Projetos em Andamento */}
            <motion.section variants={fadeInUp} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/10 to-transparent rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative p-8 rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-6 h-6 text-yellow-400/80" />
                  <h2 className="text-2xl font-bold font-serif text-white">Projetos em Andamento</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2">Simpósio de Iniciação Científica</h3>
                    <p className="text-blue-100/70 text-sm">Organização do evento anual para apresentação de resumos e artigos científicos produzidos pelos acadêmicos durante o semestre.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2">Projeto Saúde na Escola</h3>
                    <p className="text-blue-100/70 text-sm">Ações de extensão voltadas para a educação em saúde em escolas públicas da região, focando em prevenção primária.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2">Mentoria Acadêmica</h3>
                    <p className="text-blue-100/70 text-sm">Programa de apoio à submissão de projetos no Comitê de Ética em Pesquisa (CEP) e formatação de artigos.</p>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>

          {/* Right Column: Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-32">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/30 to-blue-900/30 rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative p-8 rounded-3xl bg-[#00152b]/90 backdrop-blur-xl border border-white/20 shadow-2xl text-center flex flex-col items-center">
                  
                  {/* Decorative Profile Ring */}
                  <div className="relative w-40 h-40 mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/50 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border-4 border-[#001021] overflow-hidden bg-blue-900/50">
                      {/* Substituto elegante de imagem, caso não tenha a foto da pessoa */}
                      <img 
                        src="/coordinators/CAEP.png" 
                        alt="Diretoria CAEP" 
                        className="w-full h-full object-cover object-center opacity-80"
                      />
                    </div>
                  </div>

                  <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
                    Diretoria Atual
                  </span>

                  <h3 className="text-2xl font-bold font-serif text-white mb-1">Membro DADG</h3>
                  <p className="text-blue-200/80 font-medium mb-6">Diretor(a) da CAEP</p>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

                  <p className="text-sm text-blue-100/60 leading-relaxed italic">
                    "Acreditamos que a pesquisa transforma a medicina, e a extensão transforma o médico."
                  </p>

                  <button className="mt-8 w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    Entrar em Contato
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
