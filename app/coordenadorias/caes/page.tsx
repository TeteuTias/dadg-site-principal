import React from "react";
import "../../globals.css"; // Mantemos os estilos globais sem afetar o fundo

const QuemSomos: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#034d3c] to-[#021f16] flex justify-center py-16">
      <div className="max-w-6xl w-full flex flex-col items-center space-y-12 px-6">
        {/* Círculo com imagem */}
        <div className="relative w-56 h-56 rounded-full overflow-hidden shadow-2xl border-4 border-green-500 transform transition-transform duration-500 hover:scale-105">
          <img src="/CAES.jpg" alt="Ícone" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
        </div>

        {/* "Quem Somos" */}
        <div className="bg-[#056653] text-white p-12 rounded-lg shadow-xl w-full text-center transform hover:scale-105 transition">
          <h2 className="text-4xl font-semibold mb-4">Quem Somos</h2>
          <p className="text-lg leading-relaxed">
            Somos a Coordenadoria Acadêmica de Educação em Saúde. 
          </p>
        </div>

        {/* Container de Informações */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">O que buscamos</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Buscamos trazer e levar a educação na saúde para comunidade onde ela pode transformar a qualidade de vida da população para melhor.
            </p>
          </div>

          <div className="bg-white text-black p-8 rounded-xl shadow-lg transform hover:scale-105 transition">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Nossos valores</h2>
            <ul className="text-lg text-gray-600 space-y-3">
              <li>✅ Compromisso com a excelência</li>
              <li>✅ Ética </li>
              <li>✅ Educação e saúde para a população</li>
              <li>✅ Inovação e evolução constante</li>
            </ul>
          </div>
        </div>

        {/* Missão */}
        <div className="bg-[#056653] text-white p-12 rounded-lg shadow-xl w-full text-center transform hover:scale-105 transition">
          <h2 className="text-4xl font-semibold mb-4">Nossa missão</h2>
          <p className="text-lg leading-relaxed">
            Trabalhamos para impactar positivamente a vida das pessoas e transformar a comunidade em um lugar melhor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuemSomos;
