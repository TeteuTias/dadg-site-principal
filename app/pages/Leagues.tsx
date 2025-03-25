
import React from "react";
import { Link } from "react-router-dom";
import { leagueData } from "../models/leagues";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { GraduationCap, Info, Target } from "lucide-react";

const LeaguesPage = () => {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden p-8">
      {/* Background image with opacity */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img
          src="/lovable-uploads/09d1671a-1808-48c0-97b3-78772fa97b1f.png"
          alt="CLAM Logo"
          className="object-contain opacity-10 max-w-full max-h-full"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-12 animate-in fade-in duration-500">
        {/* Title and introduction section */}
        <section className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
            Coordenadoria de Ligas Acadêmicas de Medicina
          </h1>
          <p className="text-xl text-green-600 max-w-2xl mx-auto font-medium tracking-wide">
            Conheça todas as nossas ligas acadêmicas e suas atividades
          </p>
        </section>

        {/* About Us and Our Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-2">
              <Info className="h-5 w-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
              <CardTitle className="text-green-700">Sobre Nós</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600/80">
                A Coordenadoria de Ligas Acadêmicas de Medicina (CLAM) é responsável por supervisionar 
                e apoiar todas as ligas acadêmicas da faculdade de medicina. Trabalhamos para garantir 
                que cada liga tenha os recursos necessários para desenvolver atividades de ensino, 
                pesquisa e extensão de alta qualidade.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-2">
              <Target className="h-5 w-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
              <CardTitle className="text-green-700">Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600/80">
                Nossa missão é promover a excelência acadêmica através do suporte às ligas, 
                incentivando o desenvolvimento de habilidades clínicas, de pesquisa e comunicação. 
                Buscamos criar um ambiente integrado onde estudantes possam aprofundar seus 
                conhecimentos em diversas especialidades médicas.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-green-700 text-center mt-4 mb-6">
          Nossas Ligas Acadêmicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagueData.map((league) => (
            <Link to={`/leagues/${league.id}`} key={league.id} className="group">
              <Card className="h-full overflow-hidden border-green-100 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-green-200 hover:-translate-y-1 hover:bg-green-50/50">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <div className="p-2 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <GraduationCap className="h-5 w-5 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                  <div>
                    <CardTitle className="text-green-700 text-lg">{league.description}</CardTitle>
                    <p className="text-sm text-green-600/90 mt-0.5">{league.name}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  {league.specialty && (
                    <p className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block mb-2">
                      {league.specialty}
                    </p>
                  )}
                  <CardDescription className="text-green-600/80 line-clamp-2 mt-1">
                    Clique para ver mais detalhes sobre esta liga acadêmica.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default LeaguesPage;
