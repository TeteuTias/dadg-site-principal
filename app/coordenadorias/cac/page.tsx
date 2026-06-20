"use client";

import React from "react";
import Image from "next/image";
import { CoordenadoriaLayout, ContentSection } from "../../components/CoordenadoriaLayout";
import { motion } from "framer-motion";
import { Target, Rocket, Heart, Users } from "lucide-react";
import { useTheme } from "next-themes";

const teamMembers = [
  { name: 'Mateus Rosa', role: 'Coordenador', photo: '/membersCAC/mateus.jpg' },
  { name: 'Nicoly Gonzaga', role: 'Coordenadora', photo: '/membersCAC/nicoly.jpeg' },
  { name: 'Gianluca Zambiazi', role: 'Núcleo de Apoio', photo: '/membersCAC/gianluca.jpeg' },
  { name: 'Rafaela Luiza Gonzaga', role: 'Núcleo de Apoio', photo: '/membersCAC/rafaela.png' },
  { name: 'Lucas Borges', role: 'Núcleo de Apoio', photo: '/membersCAC/lucas.jpg' },
  { name: 'Heloísa Benatt', role: 'Núcleo de Apoio', photo: '/membersCAC/helo.jpeg' },
  { name: 'Vitor Barcelos', role: 'Núcleo de Apoio', photo: '/membersCAC/vitor_barcelos.jpg' },
  { name: 'Gabriel Ramalho', role: 'Núcleo de Apoio', photo: '/membersCAC/gabriel_ramalho.jpg' }
];

export default function CacPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <CoordenadoriaLayout
      acronym="CAC"
      title="Coordenadoria Acadêmica de Certificados e TI"
      description="O CAC atua trazendo inovação, tecnologia e organização para os processos de Certificados do DADG e melhorando a plataforma do aluno."
      logoSrc="/coordinators/CAC.jpg"
      themeColor="blue"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ContentSection title="Visão">
          <div className="flex flex-col gap-4">
            <Target className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <p>Ser a ponte entre setores, pessoas e ideias com empatia e excelência, tornando-se referência em gestão digital acadêmica.</p>
          </div>
        </ContentSection>

        <ContentSection title="Missão">
          <div className="flex flex-col gap-4">
            <Rocket className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <p>Garantir inovação e organização para os certificados e aprimorar o portal para trazer a melhor experiência para os discentes.</p>
          </div>
        </ContentSection>

        <ContentSection title="Valores">
          <div className="flex flex-col gap-4">
            <Heart className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <p>Empatia, Transparência, Agilidade, Organização e Colaboração em cada linha de código e cada documento emitido.</p>
          </div>
        </ContentSection>
      </div>

      <ContentSection title={`Equipe CAC ${new Date().getFullYear()}`}>
        <div className="flex items-center gap-3 mb-8">
          <Users className={`w-6 h-6 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
          <p className="italic opacity-80">Nossa coordenadoria valoriza cada conquista como um reconhecimento oficial.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-500 bg-white/40 dark:bg-white/5 border-blue-100/50 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 group overflow-hidden relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`relative w-28 h-28 rounded-full mb-4 overflow-hidden border-4 transition-transform duration-500 group-hover:scale-110 ${isDark ? 'border-blue-900/50 group-hover:border-blue-500' : 'border-blue-100 group-hover:border-blue-300'}`}>
                {member.photo ? (
                  <Image src={member.photo} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold opacity-50">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {member.name}
                </h3>
                <p className={`text-sm font-medium px-3 py-1 rounded-full ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </ContentSection>
    </CoordenadoriaLayout>
  );
}
