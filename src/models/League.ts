
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
  fullDescription?: string;
  specialty?: string;
  activities?: string[];
}

export const leagueData: League[] = [
  { 
    id: "lacohp", 
    name: "LACOHP", 
    description: "Liga Acadêmica de Cirurgia Oral e Hospitalar Pediátrica",
    specialty: "Pediatria/Cirurgia",
    activities: ["Aulas teóricas", "Atividades práticas", "Pesquisa científica"]
  },
  { 
    id: "lafim", 
    name: "LAFIM", 
    description: "Liga Acadêmica de Fisioterapia e Medicina",
    specialty: "Fisioterapia",
    activities: ["Estudo de casos clínicos", "Simpósios", "Palestras"]
  },
  { 
    id: "laps", 
    name: "LAPS", 
    description: "Liga Acadêmica de Psiquiatria e Saúde Mental",
    specialty: "Psiquiatria",
    activities: ["Discussões clínicas", "Atendimentos supervisionados", "Projetos de extensão"] 
  },
  { 
    id: "lapa", 
    name: "LAPA", 
    description: "Liga Acadêmica de Pediatria Avançada",
    specialty: "Pediatria",
    activities: ["Acompanhamento ambulatorial", "Seminários", "Cursos de capacitação"]
  },
  { 
    id: "lai", 
    name: "LAI", 
    description: "Liga Acadêmica de Infectologia",
    specialty: "Infectologia",
    activities: ["Estudos epidemiológicos", "Vigilância em saúde", "Debate científico"]
  },
  { 
    id: "lafarm", 
    name: "LAFARM", 
    description: "Liga Acadêmica de Farmacologia",
    specialty: "Farmacologia",
    activities: ["Pesquisa farmacológica", "Análise de medicamentos", "Estudos clínicos"]
  },
  { 
    id: "lame", 
    name: "LAME", 
    description: "Liga Acadêmica de Medicina de Emergência",
    specialty: "Emergência",
    activities: ["Simulações", "Primeiros socorros", "Protocolos de atendimento"]
  },
  { 
    id: "lamfac", 
    name: "LAMFAC", 
    description: "Liga Acadêmica de Medicina de Família e Comunidade",
    specialty: "Medicina de Família",
    activities: ["Visitas domiciliares", "Atenção primária", "Medicina preventiva"]
  },
  { 
    id: "laic", 
    name: "LAIC", 
    description: "Liga Acadêmica de Imunologia Clínica",
    specialty: "Imunologia",
    activities: ["Estudo de doenças autoimunes", "Alergologia", "Imunização"] 
  },
  { 
    id: "ligami", 
    name: "LIGAMI", 
    description: "Liga Acadêmica de Medicina Interna",
    specialty: "Clínica Médica",
    activities: ["Anamnese", "Diagnóstico diferencial", "Condutas terapêuticas"]
  },
  // For the remaining leagues, I'll include the basic information
  { id: "laplast", name: "LAPLAST", description: "Liga Acadêmica de Cirurgia Plástica" },
  { id: "lacca", name: "LACCA", description: "Liga Acadêmica de Cardiologia" },
  { id: "lamelp", name: "LAMELP", description: "Liga Acadêmica de Medicina Legal e Perícia" },
  { id: "laot", name: "LAOT", description: "Liga Acadêmica de Ortopedia e Traumatologia" },
  { id: "uroliga", name: "UROLIGA", description: "Liga Acadêmica de Urologia" },
  { id: "luma", name: "LUMA", description: "Liga Universitária de Medicina Avançada" },
  { id: "lume", name: "LUME", description: "Liga Universitária de Medicina Esportiva" },
  { id: "lucmsc", name: "LUCMSC", description: "Liga Universitária de Cirurgia Minimamente Invasiva" },
  { id: "lagastro", name: "LAGASTRO", description: "Liga Acadêmica de Gastroenterologia" },
  { id: "lagem", name: "LAGEM", description: "Liga Acadêmica de Genética Médica" },
  { id: "lanut", name: "LANUT", description: "Liga Acadêmica de Nutrição" },
  { id: "lasem", name: "LASEM", description: "Liga Acadêmica de Semiologia Médica" },
  { id: "laad", name: "LAAD", description: "Liga Acadêmica de Assistência ao Diabético" },
  { id: "lacor", name: "LACOR", description: "Liga Acadêmica de Coração" },
  { id: "laderm", name: "LADERM", description: "Liga Acadêmica de Dermatologia" },
  { id: "lago", name: "LAGO", description: "Liga Acadêmica de Ginecologia e Obstetrícia" },
  { id: "lane", name: "LANE", description: "Liga Acadêmica de Neurologia" },
  { id: "laonco", name: "LAONCO", description: "Liga Acadêmica de Oncologia" },
  { id: "lanefro", name: "LANEFRO", description: "Liga Acadêmica de Nefrologia" },
  { id: "lar", name: "LAR", description: "Liga Acadêmica de Reumatologia" },
  { id: "lupa", name: "LUPA", description: "Liga Universitária de Patologia" },
  { id: "laard", name: "LAARD", description: "Liga Acadêmica de Assistência Respiratória e Doenças" },
  { id: "laoto", name: "LAOTO", description: "Liga Acadêmica de Otorrinolaringologia" },
  { id: "laoa", name: "LAOA", description: "Liga Acadêmica de Oftalmologia Avançada" },
  { id: "liap", name: "LIAP", description: "Liga Acadêmica de Pneumologia" },
  { id: "lae", name: "LAE", description: "Liga Acadêmica de Endocrinologia" }
];
