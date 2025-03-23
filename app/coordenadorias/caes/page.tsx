import React from "react";
import "../../globals.css"; // Mantemos os estilos globais sem afetar o fundo

const QuemSomos: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#034d3c]/80 to-[#021f16]/90 flex justify-center py-16">
      <div className="max-w-6xl w-full flex flex-col items-center space-y-16 px-6">
        {/* Seção do Logo e Título */}
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          {/* Círculo com imagem */}
          <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)] border-4 border-green-500 transform transition-all duration-700 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-green-400 animate-float">
            <img src="/CAES.jpg" alt="Ícone" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          </div>

          {/* Título CAES */}
          <div className="text-center">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-white mb-4 drop-shadow-lg animate-title-glow">
              CAES
            </h1>
            <h2 className="text-2xl text-white/90 font-medium tracking-wide animate-slide-up">
              Coordenadoria Acadêmica de Educação em Saúde
            </h2>
          </div>
        </div>

        {/* "Quem Somos" */}
        <div className="bg-[#056653]/95 backdrop-blur-md text-white p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] w-full text-center transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-white/30 animate-slide-in-left delay-200">
          <h2 className="text-4xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200 animate-fade-in">Quem Somos</h2>
          <p className="text-lg leading-relaxed animate-slide-in-left delay-300">
            Somos a Coordenadoria Acadêmica de Educação em Saúde. 
          </p>
        </div>

        {/* Container de Informações */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-green-100 animate-slide-in-right delay-300">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#034d3c] to-[#056653] animate-fade-in">O que buscamos</h2>
            <p className="text-lg text-gray-800 leading-relaxed animate-slide-in-right delay-400">
              Buscamos trazer e levar a educação na saúde para comunidade onde ela pode transformar a qualidade de vida da população para melhor.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-green-100 animate-scale-in delay-400">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#034d3c] to-[#056653] animate-fade-in">Nossos valores</h2>
            <ul className="text-lg text-gray-800 space-y-3 animate-scale-in delay-500">
              <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                <span className="group-hover:text-[#034d3c] transition-colors duration-300">Compromisso com a excelência</span>
              </li>
              <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                <span className="group-hover:text-[#034d3c] transition-colors duration-300">Ética</span>
              </li>
              <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                <span className="group-hover:text-[#034d3c] transition-colors duration-300">Educação e saúde para a população</span>
              </li>
              <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                <span className="group-hover:text-[#034d3c] transition-colors duration-300">Inovação e evolução constante</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Missão */}
        <div className="bg-[#056653]/95 backdrop-blur-md text-white p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] w-full text-center transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-white/30 animate-slide-in-left delay-500">
          <h2 className="text-4xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200 animate-fade-in">Nossa missão</h2>
          <p className="text-lg leading-relaxed animate-slide-in-left delay-600">
            Trabalhamos para impactar positivamente a vida das pessoas e transformar a comunidade em um lugar melhor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuemSomos;
