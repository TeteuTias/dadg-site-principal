"use client"
import React from "react";
import "../../globals.css";
import "./styles.scss";

const ClevPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Elementos de fundo decorativos */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

      {/* Conteúdo Principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header com Logo e Título */}
        <section className="mb-16 sm:mb-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-6xl sm:text-8xl font-bold gradient-text mb-6">
                CLEV
              </h1>
              <h2 className="text-2xl sm:text-3xl text-white/90 font-light tracking-wide mb-6">
                Coordenadoria Local de Estágios e Vivências
              </h2>
              <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transformando experiências acadêmicas em oportunidades de crescimento profissional.
              </p>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-64 sm:w-72 h-64 sm:h-72">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-blue-500/50 shadow-2xl bg-gradient-to-br from-blue-600 to-blue-800">
                  <img 
                    src="/CLEV.jpg" 
                    alt="Logo CLEV" 
                    className="w-full h-full object-cover object-[center_30%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Cards */}
        <section className="mb-16 sm:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 - Quem Somos */}
            <div className="group relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Quem Somos</h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Somos a Coordenadoria Local de Estágios e Vivências, responsável por gerenciar e organizar as experiências práticas dos estudantes de medicina.
                </p>
              </div>
            </div>

            {/* Card 2 - O que buscamos */}
            <div className="group relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">O que buscamos</h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Buscamos proporcionar experiências práticas de qualidade, garantindo que os estudantes tenham acesso a estágios e vivências que complementem sua formação acadêmica.
                </p>
              </div>
            </div>

            {/* Card 3 - Nossa missão */}
            <div className="group relative bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Nossa missão</h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Garantir que cada estudante tenha acesso a experiências práticas de qualidade, contribuindo para uma formação médica completa e excelente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Valores */}
        <section className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-3xl p-8 sm:p-12 backdrop-blur-sm border border-blue-500/20 mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Excelência",
                description: "Na formação prática"
              },
              {
                title: "Organização",
                description: "E eficiência"
              },
              {
                title: "Compromisso",
                description: "Com a qualidade"
              },
              {
                title: "Inovação",
                description: "Nos processos"
              }
            ].map((valor, index) => (
              <div key={index} className="group bg-blue-900/20 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors duration-500">
                  <svg 
                    className="w-6 h-6 text-blue-400 check-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{valor.title}</h3>
                <p className="text-blue-100/70">{valor.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção do QR Code WhatsApp */}
        <section className="mb-16 sm:mb-24">
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-3xl p-8 sm:p-12 backdrop-blur-sm border border-blue-500/20">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Entre no nosso grupo do WhatsApp</h2>
              <p className="text-blue-100/80 mb-8 max-w-2xl">
                Faça parte do nosso grupo do WhatsApp para receber todas as informaçõs sobre os eventos da CLEV.
              </p>
              <div className="relative w-64 h-64 bg-white rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/QRCLEV.png" 
                  alt="QR Code WhatsApp CLEV" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl"></div>
              </div>
              <p className="text-blue-100/70 mt-6 text-sm">
                Escaneie o QR Code para entrar no grupo
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClevPage;
