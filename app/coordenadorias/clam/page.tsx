"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CoordenadoriaLayout, ContentSection } from "../../components/CoordenadoriaLayout";
import { IAcademicLeague } from "@/app/lib/models/AcademicLeagues";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CLAMPage() {
  const [activeSection, setActiveSection] = useState<"basic" | "clinic" | null>(null);
  const [data, setData] = useState<Pick<IAcademicLeague, "_id" | "name" | "acronym" | "type">[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/get/getAllNamesAndAcronym");
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (section: "basic" | "clinic") => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <CoordenadoriaLayout
      acronym="CLAM"
      title="Coordenadoria de Ligas Acadêmicas de Medicina"
      description="A CLAM é o órgão responsável por coordenar e integrar todas as ligas acadêmicas da Imepac, fomentando o desenvolvimento científico."
      logoSrc="/coordinators/CLAM_logo.png"
      themeColor="red"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContentSection title="Quem Somos">
          <p>
            A CLAM atua como o pilar central na coordenação e integração de todas as Ligas Acadêmicas de Medicina.
            Nós conectamos os alunos aos mais variados projetos extracurriculares.
          </p>
        </ContentSection>

        <ContentSection title="Nossos Objetivos">
          <p>
            Promover a integração entre as ligas acadêmicas, fomentar o desenvolvimento acadêmico e científico, e contribuir 
            para a formação médica de excelência através da pesquisa e extensão.
          </p>
        </ContentSection>
      </div>

      <ContentSection title="Ligas Acadêmicas">
        <div className="space-y-6 mt-4">
          {/* Ciclo Básico */}
          <div className="rounded-2xl border transition-colors duration-300 overflow-hidden bg-white/50 dark:bg-white/5 border-red-100 dark:border-white/10">
            <button 
              onClick={() => toggleSection("basic")}
              className="w-full flex items-center justify-between p-6 font-semibold text-xl transition-colors hover:bg-red-50/50 dark:hover:bg-white/5"
            >
              Ciclo Básico
              {activeSection === "basic" ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            
            {activeSection === "basic" && (
              <div className="p-6 pt-0 border-t border-red-50 dark:border-white/10">
                <ul className="space-y-3 mt-4">
                  {data.filter((league) => league.type === "basic").map((league, index) => (
                    <li key={index}>
                      <Link href={`/coordenadorias/clam/liga/${league._id}`} className="block p-4 rounded-xl border transition-all shadow-sm bg-white dark:bg-transparent border-red-50 dark:border-white/5 hover:border-red-200 dark:hover:border-white/20 dark:hover:bg-white/5">
                        {league.name} <span className="font-bold">({league.acronym})</span>
                      </Link>
                    </li>
                  ))}
                  {data.filter((league) => league.type === "basic").length === 0 && (
                    <p className="text-sm opacity-60">Nenhuma liga encontrada.</p>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Ciclo Clínico */}
          <div className="rounded-2xl border transition-colors duration-300 overflow-hidden bg-white/50 dark:bg-white/5 border-red-100 dark:border-white/10">
            <button 
              onClick={() => toggleSection("clinic")}
              className="w-full flex items-center justify-between p-6 font-semibold text-xl transition-colors hover:bg-red-50/50 dark:hover:bg-white/5"
            >
              Ciclo Clínico
              {activeSection === "clinic" ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            
            {activeSection === "clinic" && (
              <div className="p-6 pt-0 border-t border-red-50 dark:border-white/10">
                <ul className="space-y-3 mt-4">
                  {data.filter((league) => league.type === "clinic").map((league, index) => (
                    <li key={index}>
                      <Link href={`/coordenadorias/clam/liga/${league._id}`} className="block p-4 rounded-xl border transition-all shadow-sm bg-white dark:bg-transparent border-red-50 dark:border-white/5 hover:border-red-200 dark:hover:border-white/20 dark:hover:bg-white/5">
                        {league.name} <span className="font-bold">({league.acronym})</span>
                      </Link>
                    </li>
                  ))}
                  {data.filter((league) => league.type === "clinic").length === 0 && (
                    <p className="text-sm opacity-60">Nenhuma liga encontrada.</p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </ContentSection>
    </CoordenadoriaLayout>
  );
}
