
import React from "react";
import { useParams, Link } from "react-router-dom";
import { leagueData } from "@/models/League";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, GraduationCap, Users, Calendar, Info, Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LeagueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const league = leagueData.find((l) => l.id === id);

  if (!league) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Liga não encontrada</h1>
        <p className="mb-8">A liga acadêmica que você procura não foi encontrada.</p>
        <Button asChild>
          <Link to="/leagues">Voltar para ligas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 animate-in fade-in duration-500">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/leagues">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para todas as ligas
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-10">
        {/* Cabeçalho da liga com logo e título */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-green-100 shadow-sm">
          <div className="flex-shrink-0 w-32 h-32 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-200">
            {/* Placeholder para logo da liga */}
            <GraduationCap className="h-16 w-16 text-green-600" />
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-green-700 mb-2">{league.name}</h1>
            <p className="text-lg text-green-600">{league.description}</p>
            
            {league.specialty && (
              <p className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Especialidade: {league.specialty}
              </p>
            )}
          </div>
        </div>

        {/* Sobre nós e Nossa Missão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-2">
              <Info className="h-5 w-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
              <CardTitle className="text-green-700">Sobre Nós</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600/80">
                {league.aboutUs || "Espaço reservado para informações sobre a liga acadêmica. Os líderes da liga irão adicionar uma descrição personalizada sobre a história, objetivos e visão da liga."}
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
                {league.mission || "Espaço reservado para a missão da liga acadêmica. Os líderes da liga irão adicionar uma descrição personalizada sobre a missão e valores que guiam as atividades da liga."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informações detalhadas */}
        <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-700">Informações</CardTitle>
            <CardDescription>Detalhes sobre a liga e suas atividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {league.leaders && league.leaders.length > 0 && (
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Líderes</h3>
                    <p>{league.leaders.join(", ")}</p>
                  </div>
                </div>
              )}

              {league.meetingSchedule && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Horários de Reunião</h3>
                    <p>{league.meetingSchedule}</p>
                  </div>
                </div>
              )}

              {league.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Contato</h3>
                    <a 
                      href={`mailto:${league.email}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {league.email}
                    </a>
                  </div>
                </div>
              )}

              {league.activities && league.activities.length > 0 && (
                <div className="flex items-start gap-2">
                  <GraduationCap className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Atividades</h3>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      {league.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeagueDetail;
