'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Users, Calendar, ArrowRight, Shield, Activity, HeartHandshake, Building2, BookOpen, MessageCircle, HelpCircle, Mail, MapPin, Instagram, ChevronDown } from 'lucide-react';
import UpcomingSchedulePopup from './components/UpcomingSchedulePopup';
import { motion } from 'framer-motion';
import ImpactStats from './components/ImpactStats';
import WaveDivider from './components/WaveDivider';
import FAQ from './components/FAQ';

// Reusable animation variant for sections
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function Home() {
  return (
    <main className={`min-h-[100dvh] w-full text-gray-800 overflow-x-hidden flex flex-col`}>
      <UpcomingSchedulePopup />

      {/* HERO SECTION */}
      <section
        aria-label="Seção principal do Diretório Acadêmico Diogo Guimarães"
        className="relative w-full min-h-[100dvh] pt-28 pb-20 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      >
        {/* Grid background */}
        <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" />

        <motion.div
          className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-[#002B5B] font-serif"
          >
            Diretório Acadêmico <br className="hidden sm:block" />
            <span>Diogo Guimarães</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mb-8 font-light leading-relaxed mx-auto"
          >
            Conectando estudantes de medicina, promovendo a excelência acadêmica e forjando os líderes da saúde do amanhã.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-4 sm:mt-8 flex justify-center"
          >
            <div className="animate-bounce">
              <ChevronDown size={36} className="text-slate-400 opacity-70" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Wave: Hero (white) → ImpactStats (#002B5B) */}
      <WaveDivider bg="#ffffff" fill="#002B5B" />

      {/* IMPACT STATS */}
      <ImpactStats />

      {/* Wave: ImpactStats (#002B5B) → Missão (#F8FAFC) */}
      <WaveDivider bg="#002B5B" fill="#F8FAFC" flip />

      {/* NOSSA MISSÃO */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="relative z-10 w-full pt-20 pb-12 sm:pt-28 sm:pb-16 px-6 md:px-12 lg:px-16 bg-[#F8FAFC] overflow-hidden"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Coluna 1: Texto */}
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002B5B] mb-6 font-serif">
              Nossa Missão
            </h2>
            <div className="w-20 h-1 bg-[#002B5B]/30 mb-8 rounded-full"></div>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-light mb-6">
              O <strong className="font-semibold text-[#002B5B]">Diretório Acadêmico Diogo Guimarães (DADG)</strong> é a representação máxima dos estudantes de medicina da nossa instituição. 
            </p>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-light">
              Mais do que uma entidade de classe, somos o ponto de convergência entre a dedicação acadêmica, a vocação para o cuidado humano e a força da voz estudantil.
            </p>
          </div>

          {/* Coluna 2: Collage de Imagens */}
          <div className="relative w-full h-[400px] sm:h-[500px]">
            {/* Foto Principal (Fundo) */}
            <div className="absolute top-0 right-0 w-[75%] h-[60%] rounded-3xl overflow-hidden shadow-xl border-4 border-[#F8FAFC] z-10 group">
              <Image src="/missao_1.jpg" alt="Estudantes DADG" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            
            {/* Foto Secundária (Frente, Esquerda) */}
            <div className="absolute bottom-4 left-0 w-[55%] h-[55%] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#F8FAFC] z-20 group">
              <Image src="/missao_2.jpg" alt="Prática Médica" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>

            {/* Foto Terciária (Frente, Direita) */}
            <div className="absolute bottom-10 right-4 w-[40%] h-[40%] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#F8FAFC] z-30 group translate-y-4">
              <Image src="/missao_3.jpg" alt="Integração Acadêmica" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            
            {/* Elemento Decorativo (Pontos) */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(#002B5B_2px,transparent_2px)] [background-size:16px_16px] opacity-10 z-0"></div>
          </div>

        </div>
      </motion.section>

      {/* PILARES */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="relative z-10 w-full pt-16 pb-12 sm:pt-20 sm:pb-16 px-6 bg-[#F8FAFC] overflow-hidden"
      >
        {/* Elementos Decorativos */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-[radial-gradient(#002B5B_2px,transparent_2px)] [background-size:16px_16px] opacity-[0.04] z-0 hidden md:block"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-[radial-gradient(#002B5B_2px,transparent_2px)] [background-size:16px_16px] opacity-[0.04] z-0 hidden md:block"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#002B5B] mb-6 font-serif`}>
              Os Pilares que nos Sustentam
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Trabalhamos diariamente fundamentados em três eixos essenciais para transformar a experiência universitária e a formação médica de cada aluno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
            {/* Pilar 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white text-[#002B5B] rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 group-hover:bg-[#002B5B] group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className={`text-2xl font-bold text-[#002B5B] mb-4 font-serif`}>
                Forjando a Liderança Estudantil
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Empoderamos estudantes para serem agentes ativos na construção da sua própria formação. Promovemos debates críticos e iniciativas sociais, moldando profissionais com visão sistêmica e capacidade de gestão.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white/60 backdrop-blur-sm text-[#002B5B] rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 group-hover:bg-[#002B5B] group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100/50">
                <Activity className="w-10 h-10" />
              </div>
              <h3 className={`text-2xl font-bold text-[#002B5B] mb-4 font-serif`}>
                Compromisso com a Excelência Médica
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complementamos o currículo tradicional fomentando a pesquisa, inovação e pensamento crítico. Por meio de simpósios e workshops, cultivamos um ambiente onde a medicina baseada em evidências é a norma.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white text-[#002B5B] rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 group-hover:bg-[#002B5B] group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100">
                <HeartHandshake className="w-10 h-10" />
              </div>
              <h3 className={`text-2xl font-bold text-[#002B5B] mb-4 font-serif`}>
                Rede de Apoio ao Aluno
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Somos o seu porto seguro: uma rede de acolhimento focada no bem-estar físico e mental. Defendemos ativamente os direitos discentes e promovemos espaços de integração para tornar a experiência universitária mais humana e justa.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Wave: Pilares (#F8FAFC) → Medicina (white) */}
      <WaveDivider bg="#F8FAFC" fill="#ffffff" />

      {/* MEDICINA IMEPAC (BENTO GRID) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="relative z-10 w-full pt-16 pb-12 sm:pt-24 sm:pb-16 px-6 bg-white overflow-hidden"
      >
        {/* Elementos Decorativos */}
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[radial-gradient(#002B5B_2px,transparent_2px)] [background-size:16px_16px] opacity-[0.03] z-0 hidden lg:block pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#002B5B] mb-6 font-serif`}>
              Tradição e Infraestrutura
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              A Medicina IMEPAC Araguari destaca-se por sua estrutura de ponta e profundo compromisso com a saúde pública da região.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Box 1: Hospital (Large) */}
            <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group shadow-lg min-h-[380px] md:min-h-0">
              <Image 
                src="/hospital_sagrada_familia.jpg" 
                alt="Hospital Universitário Sagrada Família" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00152b]/90 via-[#00152b]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 sm:p-10 w-full flex flex-col justify-end h-full">
                <div className="bg-blue-500/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-blue-300/30">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold text-white mb-3 font-serif`}>Hospital Universitário Sagrada Família</h3>
                <p className="text-blue-100/90 leading-relaxed max-w-lg">
                  Um marco na saúde de Araguari e região. O HUSF é o coração do nosso ecossistema de aprendizado prático, oferecendo atendimento humanizado à comunidade e tecnologia de ponta para a formação de excelência dos nossos alunos.
                </p>
              </div>
            </div>

            {/* Box 2: Campus */}
            <div className="relative rounded-3xl overflow-hidden group shadow-lg bg-white min-h-[250px] md:min-h-0">
              <Image 
                src="/imepac_campus.jpg" 
                alt="Campus IMEPAC" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002B5B]/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full text-white flex flex-col justify-end h-full">
                <h3 className={`text-xl font-bold mb-2 font-serif`}>Campus Tecnológico</h3>
                <p className="text-sm text-blue-100">Laboratórios de última geração e espaços projetados para a medicina do futuro.</p>
              </div>
            </div>

            {/* Box 3: Tradition */}
            <div className="relative rounded-3xl overflow-hidden bg-[#002B5B] shadow-lg flex flex-col justify-center p-8 border border-blue-800">
              <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className={`text-2xl font-bold text-white mb-3 font-serif`}>Reconhecimento</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Nota máxima no MEC e dezenas de turmas formadas. Uma história construída com ética, rigor científico e impacto social verdadeiro.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Wave: Medicina (white) → FAQ (#F8FAFC) */}
      <WaveDivider bg="#ffffff" fill="#F8FAFC" flip />

      {/* FAQ */}
      <FAQ />

      {/* Wave: FAQ (#F8FAFC) → Cards (white) */}
      <WaveDivider bg="#F8FAFC" fill="#ffffff" />

      {/* NOVOS CARDS DE ACESSO */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
        className="relative z-10 w-full pt-16 pb-12 sm:pt-24 sm:pb-16 px-6 bg-white overflow-hidden"
      >
        {/* Elemento Decorativo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-5xl bg-[radial-gradient(#002B5B_2px,transparent_2px)] [background-size:24px_24px] opacity-[0.02] z-0 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Card Ouvidoria */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 flex flex-col items-center text-center hover:shadow-xl hover:bg-white/80 transition-all duration-300">
            <div className="w-14 h-14 bg-[#002B5B]/5 border border-[#002B5B]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#002B5B]/10 transition-colors">
              <MessageCircle className="w-7 h-7 text-[#002B5B]" strokeWidth={1.5} />
            </div>
            <h3 className={`text-2xl font-bold text-[#002B5B] mb-4 font-serif`}>Ouvidoria</h3>
            <p className="text-gray-600 mb-8 flex-grow leading-relaxed">Envie sugestões, reclamações ou dúvidas. Sua voz é importante para o DADG.</p>
            <Link href="/ouvidoria" className="w-full py-3 px-6 bg-[#002B5B] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors">
              Enviar manifestação
            </Link>
          </div>

          {/* Card Sobre Nós */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 flex flex-col items-center text-center hover:shadow-xl hover:bg-white/80 transition-all duration-300">
            <div className="w-14 h-14 bg-[#002B5B]/5 border border-[#002B5B]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#002B5B]/10 transition-colors">
              <HelpCircle className="w-7 h-7 text-[#002B5B]" strokeWidth={1.5} />
            </div>
            <h3 className={`text-2xl font-bold text-[#002B5B] mb-4 font-serif`}>Sobre Nós</h3>
            <p className="text-gray-600 mb-8 flex-grow leading-relaxed">Conheça nossa história, missão e valores do Diretório Acadêmico.</p>
            <Link href="/sobre" className="w-full py-3 px-6 bg-[#002B5B] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors">
              Saiba mais
            </Link>
          </div>

          {/* Card Contato */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 flex flex-col items-center text-center hover:shadow-xl hover:bg-white/80 transition-all duration-300">
            <div className="w-14 h-14 bg-[#002B5B]/5 border border-[#002B5B]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#002B5B]/10 transition-colors">
              <Mail className="w-7 h-7 text-[#002B5B]" strokeWidth={1.5} />
            </div>
            <h3 className={`text-2xl font-bold text-[#002B5B] mb-4 font-serif`}>Contato</h3>
            <p className="text-gray-600 mb-8 flex-grow leading-relaxed">Redes sociais e e-mail. Fale conosco e acompanhe nossas novidades.</p>
            <Link href="/contato" className="w-full py-3 px-6 bg-[#002B5B] text-white rounded-xl font-medium hover:bg-blue-900 transition-colors">
              Entre em contato
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Wave: Cards (white) → Footer (#001f45) */}
      <WaveDivider bg="#ffffff" fill="#001f45" flip />

      {/* FOOTER */}
      <footer className="relative z-10 w-full bg-[#001f45] text-white mt-auto">
        {/* Main footer content */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col items-start">
            <div className="mb-5">
              <Image src="/dadg_sem_fundo.png" alt="Logo DADG" width={96} height={96} className="opacity-90 object-contain" />
            </div>
            <h3 className="text-lg font-bold font-serif mb-2 leading-snug">
              Diretório Acadêmico<br />Diogo Guimarães
            </h3>
            <p className="text-blue-200/60 text-sm leading-relaxed mt-2 max-w-xs">
              Representância oficial dos estudantes de Medicina da IMEPAC Araguari, com compromisso com a excelência e o bem-estar discente.
            </p>
            <div className="flex items-start mt-6 text-blue-300/70 text-sm">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Av. Minas Gerais, 1889 — Araguari, MG</span>
            </div>
          </div>

          {/* Col 2 — Links */}
          <div className="flex flex-col">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300/70 mb-5">Navegação</h4>
            <nav aria-label="Links do footer" className="flex flex-col gap-3">
              {[
                { href: "/", label: "Início" },
                { href: "/coordenadorias", label: "Coordenadorias" },
                { href: "/eventos", label: "Eventos" },
                { href: "/certificados", label: "Certificados" },
                { href: "/sobre", label: "Sobre o DADG" },
                { href: "/ouvidoria", label: "Ouvidoria" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-blue-100/70 hover:text-white text-sm transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Social + Contact */}
          <div className="flex flex-col">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-300/70 mb-5">Contato &amp; Redes</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://instagram.com/dadg.imepac"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram do DADG"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@dadgimepac.com.br"
                aria-label="E-mail do DADG"
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-blue-200/60 text-sm leading-relaxed">
              Dúvidas, sugestões ou demandas?
            </p>
            <Link
              href="/ouvidoria"
              className="mt-4 inline-flex items-center text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-xl transition-colors w-fit"
            >
              Fale com a Ouvidoria
            </Link>
          </div>
        </div>


        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-blue-200/40 text-xs">
              &copy; {new Date().getFullYear()} DADG — Diretório Acadêmico Diogo Guimarães · IMEPAC Araguari
            </p>
            <p className="text-blue-200/30 text-xs">
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
