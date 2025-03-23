
export interface League {
  id: string;
  name: string;
  description?: string;
  leaders?: string[];
  email?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  meetingSchedule?: string;
  createdAt?: Date;
}

export const leagueData: League[] = [
  { id: "lacohp", name: "LACOHP" },
  { id: "lafim", name: "LAFIM" },
  { id: "laps", name: "LAPS" },
  { id: "lapa", name: "LAPA" },
  { id: "lai", name: "LAI" },
  { id: "lafarm", name: "LAFARM" },
  { id: "lame", name: "LAME" },
  { id: "lamfac", name: "LAMFAC" },
  { id: "laic", name: "LAIC" },
  { id: "ligami", name: "LIGAMI" },
  { id: "laplast", name: "LAPLAST" },
  { id: "lacca", name: "LACCA" },
  { id: "lamelp", name: "LAMELP" },
  { id: "laot", name: "LAOT" },
  { id: "uroliga", name: "UROLIGA" },
  { id: "luma", name: "LUMA" },
  { id: "lume", name: "LUME" },
  { id: "lucmsc", name: "LUCMSC" },
  { id: "lagastro", name: "LAGASTRO" },
  { id: "lagem", name: "LAGEM" },
  { id: "lanut", name: "LANUT" },
  { id: "lasem", name: "LASEM" },
  { id: "laad", name: "LAAD" },
  { id: "lacor", name: "LACOR" },
  { id: "laderm", name: "LADERM" },
  { id: "lago", name: "LAGO" },
  { id: "lane", name: "LANE" },
  { id: "laonco", name: "LAONCO" },
  { id: "lanefro", name: "LANEFRO" },
  { id: "lar", name: "LAR" },
  { id: "lupa", name: "LUPA" },
  { id: "laard", name: "LAARD" },
  { id: "laoto", name: "LAOTO" },
  { id: "laoa", name: "LAOA" },
  { id: "liap", name: "LIAP" },
  { id: "lae", name: "LAE" }
];
