
import React from "react";
import { useParams, Link } from "react-router-dom";
import { leagueData } from "@/models/League";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, GraduationCap, Users, Calendar } from "lucide-react";
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
    <div className="container max-w-4xl py-8 animate-in fade-in duration-500">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/leagues">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para todas as ligas
        </Link>
      </Button>

      <Card className="mb-8">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <CardTitle className="text-3xl">{league.name}</CardTitle>
            </div>
          </div>
          <CardDescription className="text-lg mt-2">
            {league.description || "Informações sobre esta liga acadêmica serão adicionadas em breve."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueDetail;
