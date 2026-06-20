"use client";

import React from "react";
import Image from "next/image";
import { CoordenadoriaLayout, ContentSection } from "../../components/CoordenadoriaLayout";
import { useTheme } from "next-themes";
import { CheckCircle2, Globe2, Plane, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function ClevPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  const highlights = [
    { title: "Quem Somos", desc: "Responsáveis por gerenciar e organizar as experiências práticas internacionais e nacionais dos estudantes.", icon: Globe2 },
    { title: "O que buscamos", desc: "Proporcionar experiências práticas de qualidade que complementem a formação médica.", icon: Plane },
    { title: "Nossa Missão", desc: "Garantir acesso a vivências globais, contribuindo para uma formação médica completa.", icon: MapPin }
  ];

  return (
    <CoordenadoriaLayout
      acronym="CLEV"
      title="Coordenadoria Local de Estágios e Vivências"
      description="Transformando experiências acadêmicas em oportunidades de crescimento profissional e conectando você ao mundo prático da medicina."
      logoSrc="/coordinators/CLEV.jpg"
      themeColor="teal"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <ContentSection title={item.title}>
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-teal-500/20' : 'bg-teal-50'}`}>
                  <item.icon className={`w-6 h-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                </div>
                <p className="text-base leading-relaxed">{item.desc}</p>
              </div>
            </ContentSection>
          </motion.div>
        ))}
      </div>

      <ContentSection title="Nossos Valores">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Excelência", desc: "Na formação prática" },
            { title: "Organização", desc: "E eficiência" },
            { title: "Compromisso", desc: "Com a qualidade" },
            { title: "Inovação", desc: "Nos processos" }
          ].map((val, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ scale: 1.05 }}
              className={`flex flex-col items-center text-center p-6 rounded-[2rem] border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-teal-50 hover:shadow-lg'}`}
            >
              <div className={`p-3 rounded-full mb-4 ${isDark ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
                <CheckCircle2 className={`w-8 h-8 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
              </div>
              <span className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{val.title}</span>
              <span className={`text-sm opacity-70 ${isDark ? 'text-teal-100/70' : 'text-slate-600'}`}>{val.desc}</span>
            </motion.div>
          ))}
        </div>
      </ContentSection>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <ContentSection title="Intercâmbios e Vivências">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className={`p-6 rounded-3xl border-l-4 border-teal-500 ${isDark ? 'bg-teal-500/5' : 'bg-teal-50'}`}>
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-teal-500" />
                  Somos a CLEV
                </h4>
                <p className="text-lg leading-relaxed mb-4 text-justify">
                 Focada em proporcionar experiências práticas de excelência, a CLEV gerencia e organiza oportunidades de estágios e vivências para os acadêmicos de medicina. Seja através de intercâmbios ou práticas locais, nosso objetivo é garantir que cada aluno tenha acesso a cenários de aprendizado que complementem sua formação e o preparem para os desafios do mercado de trabalho e da prática médica contemporânea.
                </p>
              </div>
              
              
            </div>
            
            <div className="relative group">
              
               
            </div>
          </div>
        </ContentSection>
      </motion.div>
    </CoordenadoriaLayout>
  );
}
