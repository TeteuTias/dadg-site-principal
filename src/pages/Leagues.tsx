
import React from "react";
import { Link } from "react-router-dom";
import { leagueData } from "@/models/League";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const LeaguesPage = () => {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden p-8">
      {/* Imagem de fundo com opacidade */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img
          src="/lovable-uploads/09d1671a-1808-48c0-97b3-78772fa97b1f.png"
          alt="CLAM Logo"
          className="object-contain opacity-10 max-w-full max-h-full"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-12 animate-in fade-in duration-500">
        {/* Seção de título e introdução */}
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Coordenadoria de Ligas Acadêmicas de Medicina
          </h1>
          <p className="text-xl text-green-600 max-w-2xl mx-auto">
            Conheça todas as nossas ligas acadêmicas e suas atividades
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagueData.map((league) => (
            <Link to={`/leagues/${league.id}`} key={league.id}>
              <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 border-green-100 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-700">{league.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-green-600/80">
                    {league.description || "Clique para ver mais detalhes sobre esta liga acadêmica."}
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
