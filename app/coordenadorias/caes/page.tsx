import React from "react";

const QuemSomos: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center px-6 py-16 max-w-5xl mx-auto space-y-12">
      {/* Círculo com imagem */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-blue-600 transition-transform duration-300 hover:scale-110">
        <img
          src="/CAES.jpg"
          alt="Ícone"
          className="w-full h-full object-cover"
        />
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      </div>

      {/* Título principal */}
      <h1 className="text-6xl font-extrabold text-gray-900 tracking-wide">
        Quem Somos
      </h1>

      {/* Container de Informações */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card "O que buscamos" */}
        <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition">
          <h2 className="text-3xl font-semibold mb-4">O que buscamos</h2>
          <p className="text-lg leading-relaxed">
            Lorem ipsum
          </p>
        </div>

        {/* Card "Nossos valores" */}
        <div className="bg-gray-100 text-gray-800 p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition">
          <h2 className="text-3xl font-semibold mb-4">Nossos valores</h2>
          <ul className="text-lg space-y-3">
            <li>✅ </li>
            <li>✅ </li>
            <li>✅ </li>
            <li>✅ </li>
          </ul>
        </div>
      </div>

      {/* Missão */}
      <div className="w-full bg-gray-900 text-white p-10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4">Nossa missão</h2>
        <p className="text-lg leading-relaxed">
          Lorem ipsum
        </p>
      </div>
    </div>
  );
};

export default QuemSomos;
