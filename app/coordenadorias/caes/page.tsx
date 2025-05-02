"use client";

import React, { useEffect } from "react";
import "../../globals.css";
import "./styles.css";

const QuemSomos: React.FC = () => {
  useEffect(() => {
    // Criar partículas
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
      for (let i = 0; i < 65; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        // Distribuir as partículas verticalmente
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="caes-container min-h-screen">
      <div className="caes-background"></div>
      <div className="particles"></div>
      
      <div className="caes-content max-w-7xl mx-auto px-6 py-16">
        {/* Seção do Logo e Título */}
        <div className="logo-container flex flex-col items-center space-y-12 mb-24">
          <div className="logo-circle w-80 h-80 rounded-full overflow-hidden border-4 border-green-500 shadow-2xl animate-float">
            <img 
              src="/CAES.jpg" 
              alt="Logo CAES" 
              className="logo-image w-full h-full object-cover"
            />
          </div>
          
          <div className="title-container text-center space-y-6">
            <h1 className="title-glow text-9xl font-bold animate-glow">
              CAES
            </h1>
            <h2 className="text-3xl text-white/90 font-medium tracking-wide">
              Coordenadoria Acadêmica de Educação em Saúde
            </h2>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Quem Somos */}
          <div className="info-card p-10">
            <h2 className="text-4xl font-semibold text-white mb-8">Quem Somos</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Somos a Coordenadoria Acadêmica de Educação em Saúde.
            </p>
          </div>

          {/* O que buscamos */}
          <div className="info-card p-10">
            <h2 className="text-4xl font-semibold text-white mb-8">O que buscamos</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Buscamos trazer e levar a educação na saúde para comunidade onde ela pode transformar a qualidade de vida da população para melhor.
            </p>
          </div>
        </div>

        {/* Nossos Valores */}
        <div className="info-card p-10 mb-20">
          <h2 className="text-4xl font-semibold text-white mb-12">Nossos valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="value-item text-xl text-white/90">
              Compromisso com a excelência
            </div>
            <div className="value-item text-xl text-white/90">
              Ética
            </div>
            <div className="value-item text-xl text-white/90">
              Educação e saúde para a população
            </div>
            <div className="value-item text-xl text-white/90">
              Inovação e evolução constante
            </div>
          </div>
        </div>

        {/* Missão */}
        <div className="info-card p-10">
          <h2 className="text-4xl font-semibold text-white mb-8">Nossa missão</h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Trabalhamos para impactar positivamente a vida das pessoas e transformar a comunidade em um lugar melhor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuemSomos;
