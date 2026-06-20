"use client";

import React from "react";
import { CoordenadoriaLayout, ContentSection } from "../../components/CoordenadoriaLayout";
import { Heart, Globe, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function CaesPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  const values = [
    { title: "Compromisso", desc: "Com a excelência acadêmica", icon: ShieldCheck },
    { title: "Ética", desc: "Em todas as nossas ações", icon: Heart },
    { title: "Comunidade", desc: "Foco na saúde da população", icon: Globe },
    { title: "Inovação", desc: "Evolução constante", icon: Sparkles },
  ];

  return (
    <CoordenadoriaLayout
      acronym="CAES"
      title="Coordenadoria Acadêmica de Educação em Saúde"
      description="Trazendo e levando a educação na saúde para a comunidade onde ela pode transformar a qualidade de vida da população para melhor."
      logoSrc="/coordinators/CAES2.jpg"
      themeColor="green"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ContentSection title="Quem Somos">
            <p className="text-lg leading-relaxed">
              Somos a Coordenadoria Acadêmica de Educação em Saúde. Trabalhamos incansavelmente para promover 
              projetos e ações focados em aprimorar a educação contínua da saúde dentro e fora da comunidade acadêmica.
            </p>
            <div className={`mt-6 p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className="text-sm font-medium italic">
                "Educação não transforma o mundo. Educação muda pessoas. Pessoas transformam o mundo."
              </p>
            </div>
          </ContentSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <ContentSection title="O que buscamos">
            <p className="text-lg leading-relaxed">
              Buscamos trazer e levar a educação na saúde para a comunidade onde ela pode transformar a qualidade de vida da população para melhor, criando um ambiente de prevenção e bem-estar.
            </p>
            <ul className="mt-6 space-y-3">
              {['Impacto Social Direto', 'Prevenção Primária', 'Engajamento Comunitário'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </ContentSection>
        </motion.div>
      </div>

      <ContentSection title="Nossos Valores">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-3xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/50' 
                  : 'bg-white border-emerald-50 hover:shadow-lg hover:border-emerald-200'
              }`}
            >
              <val.icon className={`w-10 h-10 mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h4 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{val.title}</h4>
              <p className={`text-sm ${isDark ? 'text-emerald-100/60' : 'text-slate-500'}`}>{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </ContentSection>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <ContentSection title="Nossa Missão">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-xl font-medium leading-relaxed">
                Trabalhamos para impactar positivamente a vida das pessoas e transformar a comunidade em um lugar melhor, 
                aliando a nossa prática médica estudantil ao compromisso com a transformação social e a saúde pública.
              </p>
            </div>
            <div className={`p-8 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <Heart className={`w-16 h-16 animate-pulse ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
          </div>
          
        </ContentSection>
      </motion.div>
    </CoordenadoriaLayout>
  );
}
