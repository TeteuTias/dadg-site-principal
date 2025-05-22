'use client'
import './style.css';
import React from 'react';
import { Poppins } from 'next/font/google';
import { FaHeartbeat, FaUserMd, FaStar, FaInfoCircle, FaListUl } from 'react-icons/fa';
const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

export default function LamePage() {
  return (
    <main className="lame-main" style={poppins.style}>
      <div className="lame-header">
        <div className="lame-logo-circle-pro">
          <span className="lame-logo-text">Logo</span>
        </div>
        <div className="lame-title-block">
          <h1 className="lame-title-gradient">Liga Acadêmica de Medicina Esportiva</h1>
          <div className="lame-info-card-pro">
            <div className="lame-info-item-pro">
              <FaStar className="lame-info-icon" />
              <span className="lame-info-label-pro">Sigla</span>
              <span className="lame-info-value-pro">LAME</span>
            </div>
            <div className="lame-info-item-pro">
              <FaHeartbeat className="lame-info-icon" />
              <span className="lame-info-label-pro">Área</span>
              <span className="lame-info-value-pro">Medicina Esportiva</span>
            </div>
          </div>
        </div>
      </div>

      <section className="lame-section-card">
        <div className="lame-section-header">
          <FaUserMd className="lame-section-icon" />
          <h2 className="lame-section-title">Orientador</h2>
        </div>
        <div className="lame-section-content">Dr. Jorge Pereira Lemes</div>
      </section>

      <section className="lame-section-card">
        <div className="lame-section-header">
          <FaStar className="lame-section-icon" />
          <h2 className="lame-section-title">Diferencial</h2>
        </div>
        <div className="lame-section-content">
          A LAME se destaca por oferecer uma abordagem interdisciplinar na promoção da saúde e no cuidado com o corpo em movimento, trabalhando em conjunto com fisioterapeutas, educadores físicos, nutricionistas e psicólogos. A liga realiza estágios e vivências práticas, além de ações sociais como eventos educativos em escolas, minicursos sobre primeiros socorros e atendimento a atletas, sempre com base em evidências científicas. Sua atuação abrange desde o esporte de alto rendimento até o cuidado com pessoas de todas as idades, incluindo portadores de doenças crônicas.
        </div>
      </section>

      <section className="lame-section-card">
        <div className="lame-section-header">
          <FaInfoCircle className="lame-section-icon" />
          <h2 className="lame-section-title">Sobre</h2>
        </div>
        <div className="lame-section-content">
          A Liga Acadêmica de Medicina Esportiva (LAME) é dedicada à promoção da saúde e ao cuidado com o corpo em movimento, atuando na prevenção, diagnóstico e tratamento de lesões relacionadas à prática esportiva. Com um enfoque interdisciplinar, a liga trabalha em parceria com profissionais de diversas áreas para oferecer um cuidado integrado aos pacientes. Sob a orientação do Dr. Jorge Pereira Lemes, a LAME realiza eventos educativos, minicursos e ações sociais, sempre com o objetivo de disseminar conhecimento e promover um estilo de vida ativo e saudável.
        </div>
      </section>

      <section className="lame-section-card">
        <div className="lame-section-header">
          <FaListUl className="lame-section-icon" />
          <h2 className="lame-section-title">Exemplos de Atuação e Projetos</h2>
        </div>
        <ul className="lame-section-list">
          <li><span className="lame-list-bullet" />OASH Run: evento realizado em colaboração com a OASH, promovendo a prática esportiva e a saúde.</li>
          <li><span className="lame-list-bullet" />Minicursos sobre primeiros socorros, fraturas expostas e atendimento a atletas: realizados em parceria com a LAPS e LAORTI, oferecendo capacitação prática aos participantes.</li>
          <li><span className="lame-list-bullet" />Ações educativas em escolas: em colaboração com o Projeto Sonhar, a LAME promoveu palestras sobre a importância da atividade física e alimentação saudável para crianças e adolescentes.</li>
        </ul>
      </section>

      <section className="lame-section-card">
        <div className="lame-section-header">
          <FaInfoCircle className="lame-section-icon" />
          <h2 className="lame-section-title">Texto Geral</h2>
        </div>
        <div className="lame-section-content">
          A Liga Acadêmica de Medicina Esportiva (LAME) é uma entidade dedicada à promoção da saúde e ao cuidado com o corpo em movimento, atuando na prevenção, diagnóstico e tratamento de lesões relacionadas à prática esportiva. Sob a orientação do Dr. Jorge Pereira Lemes, médico esportivo e nutrólogo com vasta experiência em clínica geral e urgência e emergência, a LAME se destaca por sua abordagem interdisciplinar, trabalhando em conjunto com fisioterapeutas, educadores físicos, nutricionistas e psicólogos. O diferencial da liga inclui a realização de estágios, vivências práticas e ações sociais, como o OASH Run, um evento em colaboração com a OASH que promove a prática esportiva e a saúde. Além disso, a LAME já organizou minicursos sobre primeiros socorros, fraturas expostas e atendimento a atletas, em parceria com a LAPS e LAORTI, oferecendo capacitação prática aos participantes. A liga também promoveu ações educativas em escolas, em colaboração com o Projeto Sonhar, com palestras sobre a importância da atividade física e alimentação saudável para crianças e adolescentes. Com uma atuação abrangente, que vai desde o esporte de alto rendimento até o cuidado com pessoas de todas as idades, incluindo portadores de doenças crônicas, a LAME é uma referência na área de medicina esportiva, sempre baseando suas ações em evidências científicas.
        </div>
      </section>
    </main>
  );
} 