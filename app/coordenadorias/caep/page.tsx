"use client";

import React from "react";
import { CoordenadoriaLayout, ContentSection } from "../../components/CoordenadoriaLayout";
import { Lightbulb, Microscope, BookOpen, GraduationCap, Award, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function CaepPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  const projects = [
    {
      title: "Simpósio de Iniciação Científica",
      desc: "Organização do evento anual para apresentação de resumos e artigos científicos produzidos pelos acadêmicos durante o semestre.",
      icon: Microscope,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Projeto Saúde na Escola",
      desc: "Ações de extensão voltadas para a educação em saúde em escolas públicas da região, focando em prevenção primária.",
      icon: Lightbulb,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      title: "Mentoria Acadêmica",
      desc: "Programa de apoio à submissão de projetos no Comitê de Ética em Pesquisa (CEP) e formatação de artigos científicos.",
      icon: BookOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <CoordenadoriaLayout
      acronym="CAEP"
      title="Coordenadoria Acadêmica de Extensão e Pesquisa"
      description="A CAEP atua fomentando a pesquisa científica, promovendo simpósios, congressos e projetos de extensão que impactam a sociedade."
      logoSrc="/coordinators/CAEP.jpg"
      themeColor="indigo"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContentSection title="Nossa Missão">
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed">
              Fomentar o pensamento científico e a responsabilidade social entre os estudantes de medicina do IMEPAC. A CAEP atua como ponte entre a sala de aula e a comunidade.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-indigo-50'}`}>
                <GraduationCap className="text-indigo-500 w-6 h-6" />
                <span className="font-medium">Formação Global</span>
              </div>
              <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-indigo-50'}`}>
                <Award className="text-indigo-500 w-6 h-6" />
                <span className="font-medium">Excelência Acadêmica</span>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Visão de Futuro">
          <div className="flex flex-col gap-4">
            <p>
              Consolidar o IMEPAC como um polo de produção científica de alta relevância regional e nacional, integrando ensino, pesquisa e extensão de forma indissociável.
            </p>
            <div className={`mt-4 p-6 rounded-2xl border-l-4 border-indigo-500 ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-50'}`}>
              <blockquote className="italic opacity-90">
                "A pesquisa é o que move a medicina para o futuro, e a extensão é o que traz esse futuro para o presente da comunidade."
              </blockquote>
            </div>
          </div>
        </ContentSection>
      </div>

      <ContentSection title="Projetos em Andamento">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {projects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/10' 
                  : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-xl'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150 ${project.bg}`} />
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-12 ${project.bg}`}>
                <project.icon className={`w-8 h-8 ${project.color}`} />
              </div>
              
              <h3 className={`text-xl font-bold mb-3 transition-colors ${isDark ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                {project.title}
              </h3>
              
              <p className={`text-base leading-relaxed ${isDark ? 'text-blue-100/70' : 'text-slate-600'}`}>
                {project.desc}
              </p>

              
            </motion.div>
          ))}
        </div>
      </ContentSection>
    </CoordenadoriaLayout>
  );
}
