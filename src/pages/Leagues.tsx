
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
    <div className="container py-8 mx-auto animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Ligas Acadêmicas</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Conheça todas as nossas ligas acadêmicas e suas atividades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagueData.map((league) => (
          <Link to={`/leagues/${league.id}`} key={league.id}>
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <CardTitle>{league.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {league.description || "Clique para ver mais detalhes sobre esta liga acadêmica."}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LeaguesPage;
