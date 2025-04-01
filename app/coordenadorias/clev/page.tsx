import React from "react";
import "../../globals.css"; // Mantemos os estilos globais sem afetar o fundo

const QuemSomos: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#6d9aca]/80 to-[#b2d4ee]/90 flex justify-center py-16">
            <div className="max-w-6xl w-full flex flex-col items-center space-y-16 px-6">
                {/* Seção do Logo e Título */}
                <div className="flex flex-col items-center space-y-6 animate-fade-in">
                    {/* Círculo com imagem */}
                    <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)] border-4 border-[#526c94] transform transition-all duration-700 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-[#6d9bca] animate-float">
                        <img src="/coordinators/CLEV.jpg" alt="Ícone" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                    </div>

                    {/* Título CLEV */}
                    <div className="text-center">
                        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white mb-4 drop-shadow-lg animate-title-glow">
                            CLEV
                        </h1>
                        <h2 className="text-2xl text-white/90 font-medium tracking-wide animate-slide-up">
                            Coordenadoria Local de Estágios e Vivências
                        </h2>
                    </div>
                </div>


                {/* Container de Informações */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-green-100 animate-slide-in-right delay-300">
                        <h2 className="text-3xl font-semibold text-[#526c94] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#034d3c] to-[#056653] animate-fade-in">Quem somos?</h2>
                        <p className="text-lg text-gray-800 leading-relaxed animate-slide-in-right delay-400">
                            A <span className="font-semibold">Coordenadoria Local de Estágios e Vivências (CLEV)</span> é um núcleo vinculado ao DADG, que por sua vez integra a DENEM - Direção Executiva Nacional dos Estudantes de Medicina, instituição suprapartidária sem fins lucrativos. A CLEV é constituída por estudantes comprometidos a ampliar as oportunidades de aprendizado prático e complementar à formação médica dos estudantes de medicina, ajudando a construir um currículo de qualidade e ampliar as experiências socioculturais, fundamentais para a carreira médica. Atuamos como um elo entre os acadêmicos e as diversas possibilidades de intercâmbio em estágios práticos, clínicos, cirúrgicos e de pesquisa, tanto no Brasil quanto no exterior. Nosso objetivo é proporcionar vivências que agreguem conhecimento, habilidades e uma visão mais ampla da medicina em diferentes contextos.
                        </p>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-green-100 animate-scale-in delay-400">
                        <h2 className="text-3xl font-semibold text-[#526c94] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#034d3c] to-[#056653] animate-fade-in">Nossos Objetivos</h2>
                        Nosso principal propósito é incentivar e facilitar a participação dos estudantes em experiências extracurriculares enriquecedoras. Para isso, buscamos:
                        <ul className="text-lg text-gray-800 space-y-3 animate-scale-in delay-500">
                            <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                                <span className="group-hover:text-[#034d3c] transition-colors duration-300">
                                    Desenvolver e estimular  intercâmbios acadêmicos em instituições nacionais e internacionais;
                                </span>
                            </li>
                            <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                                <span className="group-hover:text-[#034d3c] transition-colors duration-300">
                                    Ampliar o acesso a estágios práticos em hospitais, clínicas e centros de pesquisa;
                                </span>
                            </li>
                            <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                                <span className="group-hover:text-[#034d3c] transition-colors duration-300">
                                    Estimular vivências em realidades diversas, incluindo a atenção primária, medicina rural e assistência em comunidades vulneráveis;
                                </span>
                            </li>
                            <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                                <span className="group-hover:text-[#034d3c] transition-colors duration-300">
                                    Fortalecer parcerias com organizações estudantis e profissionais, criando novas oportunidades de aprendizado e colaboração;
                                </span>
                            </li>
                            <li className="flex items-center gap-2 group hover:translate-x-2 transition-transform duration-300">
                                <span className="text-green-600 group-hover:scale-110 transition-transform duration-300">✓</span>
                                <span className="group-hover:text-[#034d3c] transition-colors duration-300">
                                    Apoiar os estudantes em questões burocráticas e logísticas, facilitando a participação em programas de estágio e pesquisa.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Missão */}
                <div className="bg-[#526c94]/95 backdrop-blur-md text-white p-12 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] w-full text-center transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-white/30 animate-slide-in-left delay-500">
                    <h2 className="text-4xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200 animate-fade-in">Nossa Perspectiva de Gestão</h2>
                    <p className="text-lg leading-relaxed animate-slide-in-left delay-600">
                        Nossa gestão é baseada em princípios de transparência, acessibilidade, parceria e compromisso com a formação acadêmica de qualidade. Buscamos sempre atuar de forma democrática, ouvindo as demandas dos estudantes e promovendo iniciativas alinhadas às suas necessidades e interesses. Além disso, trabalhamos continuamente para expandir nossas parcerias e consolidar a CLEV como um espaço de apoio e oportunidades no ensino médico.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuemSomos;
/*

🌐 Quem somos?


🎯 Nossos objetivos


📄 Nossa perspectiva de gestão


*Se você deseja conhecer mais sobre nossos programas ou participar de alguma de nossas iniciativas, entre em contato conosco!*

*/