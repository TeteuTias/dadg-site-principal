'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './style.css';

const ligasBasico = [
    'Liga Acadêmica de Comunicação, Humanização e Plantão da Palhaçada (LACOHP)',
    'Liga Acadêmica de Fisiologia Médica (LAFIM)',
    'Liga Acadêmica de Genética Médica (LAGEM)',
    'Liga Acadêmica de Medicina do Esporte (LAME)',
    'Liga Acadêmica de Nutrologia (LANUT)',
    'Liga Acadêmica de Patologia de Araguari (LAPA)',
    'Liga Acadêmica de Primeiros Socorros (LAPS)',
    'Liga Acadêmica de Semiologia Médica (LASEM)',
    'Liga Acadêmica de Farmacologia (LAFARM)',
    'Liga Acadêmica de Medicina da Família e Comunidade (LAMFAC)',
    'Liga Acadêmica de Gestão e Empreendedorismo (LAGET)',
    'Liga Acadêmica de Cuidados Paliativos (LACP)'
];

const ligasClinico = [
    'Liga Acadêmica de Cardiologia (LACOR)',
    'Liga Acadêmica de Dermatologia (LADERM)',
    'Liga Acadêmica de Ginecologia e Obstetrícia (LAGO)',
    'Liga Acadêmica de Neurologia (LANE)',
    'Liga Acadêmica de Oncologia (LAONCO)',
    'Liga Acadêmica de Reumatologia (LAR)',
    'Liga Acadêmica de Psiquiatria (LUPA)',
    'Liga Acadêmica de Anestesiologia, Reanimação e Dor (LAARD)',
    'Liga Acadêmica de Oftalmologia (LAOA)',
    'Liga Universitária de Mastologia (LUMA)',
    'Liga Acadêmica de Pediatria (LAPED)',
    'Liga Universitária de Otorrinolaringologia (LAOTO)',
    'Liga Universitária de Medicina de Emergência (LUME)',
    'Liga Acadêmica de Medicina Intensiva (LIGAMI)',
    'Liga Acadêmica de Pneumologia (LIAP)',
    'Liga Acadêmica de Clínica Cirúrgica (LACCA)',
    'Liga Acadêmica de Endocrinologia (LAE)',
    'Liga Acadêmica de Nefrologia e Urologia (LANEU)',
    'Liga Acadêmica de Cirurgia Plástica (LAPLAST)',
    'Liga Acadêmica de Medicina Legal e Perícia Médica (LAMELP)',
    'Liga Acadêmica de Ortopedia e Traumatologia (LAOT)',
    'Liga Acadêmica de Clínica Médica e Saúde (LUCMSC)',
    'Liga Acadêmica de Infectologia e Imunologia Clínica (LAIIC)',
    'Liga Acadêmica de Gastroenterologia (LAGASTRO)'
];

export default function CLAMPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        // Criar partículas
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer) {
            for (let i = 0; i < 65; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 8}s`;
                particlesContainer.appendChild(particle);
            }
        }
    }, []);

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="clam-container">
            <div className="clam-background"></div>
            <div className="particles"></div>
            
            <div className="clam-content">
                {/* Seção do Logo e Título */}
                <div className="logo-container">
                    <div className="logo-circle">
                        <Image
                            src="/CLAM.png"
                            alt="Logo CLAM"
                            width={180}
                            height={180}
                            className="logo-image"
                        />
                    </div>
                    
                    <div className="title-container">
                        <h1 className="title-glow">CLAM</h1>
                        <h2 className="text-3xl text-white/90 font-medium tracking-wide">
                            Coordenadoria de Ligas Acadêmicas de Medicina
                        </h2>
                    </div>
                </div>

                {/* Informações */}
                <div className="info-container">
                    <h2>Quem Somos</h2>
                    <p>
                        A CLAM (Coordenadoria de Ligas Acadêmicas de Medicina) é o órgão responsável por coordenar e integrar todas as ligas acadêmicas da Imepac.
                    </p>
                </div>

                <div className="info-container">
                    <h2>Nossos Objetivos</h2>
                    <p>
                        Promover a integração entre as ligas acadêmicas, fomentar o desenvolvimento acadêmico e científico, e contribuir para a formação médica de excelência.
                    </p>
                </div>

                {/* Seções Colapsáveis */}
                <div className="collapsible">
                    <div 
                        className="collapsible-header"
                        onClick={() => toggleSection('basico')}
                    >
                        <span>Ciclo Básico</span>
                        <span className={`arrow ${activeSection === 'basico' ? 'active' : ''}`}>▼</span>
                    </div>
                    <div className={`collapsible-content ${activeSection === 'basico' ? 'active' : ''}`}>
                        <ul className="liga-list">
                            {ligasBasico.map((liga, index) => (
                                <li key={index} className="liga-item">{liga}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="collapsible">
                    <div 
                        className="collapsible-header"
                        onClick={() => toggleSection('clinico')}
                    >
                        <span>Ciclo Clínico</span>
                        <span className={`arrow ${activeSection === 'clinico' ? 'active' : ''}`}>▼</span>
                    </div>
                    <div className={`collapsible-content ${activeSection === 'clinico' ? 'active' : ''}`}>
                        <ul className="liga-list">
                            {ligasClinico.map((liga, index) => (
                                <li key={index} className="liga-item">{liga}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
