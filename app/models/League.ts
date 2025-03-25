
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
  aboutUs?: string;
  mission?: string;
  logoUrl?: string;
}

export const leagueData: League[] = [
  { 
    id: "lacohp", 
    name: "Liga Acadêmica de Comunicação, Humanização e Plantão da Palhaçada", 
    description: "LACOHP",
    specialty: "Comunicação e Humanização",
    activities: ["Aulas teóricas", "Atividades práticas", "Pesquisa científica"],
    aboutUs: "Somos uma liga dedicada ao estudo da comunicação em saúde e humanização no atendimento, fundada por estudantes interessados em aprofundar conhecimentos nesta área específica.",
    mission: "Promover o conhecimento em comunicação e humanização na saúde, desenvolver habilidades interpessoais e formar profissionais conscientes da importância da comunicação humanizada no atendimento aos pacientes."
  },
  { 
    id: "lafim", 
    name: "Liga Acadêmica de Fisiologia Médica", 
    description: "LAFIM",
    specialty: "Fisiologia"
  },
  { 
    id: "laps", 
    name: "Liga Acadêmica de Primeiros Socorros", 
    description: "LAPS",
    specialty: "Primeiros Socorros",
    activities: ["Treinamentos práticos", "Simulações", "Projetos de extensão"] 
  },
  { 
    id: "lapa", 
    name: "Liga Acadêmica de Patologia de Araguari", 
    description: "LAPA",
    specialty: "Patologia"
  },
  { 
    id: "lai", 
    name: "Liga Acadêmica de Infectologia", 
    description: "LAI",
    specialty: "Infectologia",
    activities: ["Estudos epidemiológicos", "Vigilância em saúde", "Debate científico"]
  },
  { 
    id: "lafarm", 
    name: "Liga Acadêmica de Farmacologia IMEPAC", 
    description: "LAFARM",
    specialty: "Farmacologia",
    activities: ["Pesquisa farmacológica", "Análise de medicamentos", "Estudos clínicos"]
  },
  { 
    id: "lame", 
    name: "Liga Acadêmica de Medicina do Esporte", 
    description: "LAME",
    specialty: "Medicina Esportiva",
    activities: ["Avaliação física", "Medicina preventiva no esporte", "Reabilitação esportiva"]
  },
  { 
    id: "lamfac", 
    name: "Liga Acadêmica de Medicina da Família e Comunidade", 
    description: "LAMFAC",
    specialty: "Medicina de Família",
    activities: ["Visitas domiciliares", "Atenção primária", "Medicina preventiva"]
  },
  { 
    id: "laic", 
    name: "Liga Acadêmica de Alergia e Imunologia Clínica", 
    description: "LAIC",
    specialty: "Imunologia",
    activities: ["Estudo de doenças autoimunes", "Alergologia", "Imunização"] 
  },
  { 
    id: "ligami", 
    name: "Liga Acadêmica de Medicina Intensiva", 
    description: "LIGAMI",
    specialty: "Medicina Intensiva",
    activities: ["Protocolos de UTI", "Ventilação mecânica", "Condutas em emergências"]
  },
  { 
    id: "laplast", 
    name: "Liga Acadêmica de Cirurgia Plástica",
    description: "LAPLAST" 
  },
  { 
    id: "lacca", 
    name: "Liga Acadêmica de Clínica Cirúrgica de Araguari",
    description: "LACCA" 
  },
  { 
    id: "lamelp", 
    name: "Liga Acadêmica de Medicina Legal e Perícias Médicas",
    description: "LAMELP" 
  },
  { 
    id: "laot", 
    name: "Liga Acadêmica de Ortopedia e Traumatologia",
    description: "LAOT" 
  },
  { 
    id: "uroliga", 
    name: "Liga Academia de Urologia",
    description: "UROLIGA" 
  },
  { 
    id: "luma", 
    name: "Liga Universitária de Mastologia",
    description: "LUMA" 
  },
  { 
    id: "lume", 
    name: "Liga Universitária de Medicina de Emergência",
    description: "LUME" 
  },
  { 
    id: "lucmsc", 
    name: "Liga Acadêmica de Clínica Médica e Saúde Coletiva",
    description: "LUCMSC" 
  },
  { 
    id: "lagastro", 
    name: "Liga Acadêmica de Gastroenterologia",
    description: "LAGASTRO" 
  },
  { 
    id: "lagem", 
    name: "Liga Academia de Genética e Embriologia Médica",
    description: "LAGEM" 
  },
  { 
    id: "lanut", 
    name: "Liga Acadêmica de Nutrologia",
    description: "LANUT" 
  },
  { 
    id: "lasem", 
    name: "Liga Acadêmica de Semiologia Médica",
    description: "LASEM" 
  },
  { 
    id: "laad", 
    name: "Liga Acadêmica de Anatomia e Dissecação",
    description: "LAAD" 
  },
  { 
    id: "lacor", 
    name: "Liga de Cardiologia de Araguari",
    description: "LACOR" 
  },
  { 
    id: "laderm", 
    name: "Liga Acadêmica de Dermatologia",
    description: "LADERM" 
  },
  { 
    id: "lago", 
    name: "Liga Acadêmica de Ginecologia e Obstetrícia",
    description: "LAGO" 
  },
  { 
    id: "lane", 
    name: "Liga Acadêmica de Neurologia",
    description: "LANE" 
  },
  { 
    id: "laonco", 
    name: "Liga Acadêmica de Oncologia",
    description: "LAONCO" 
  },
  { 
    id: "lanefro", 
    name: "Liga Acadêmica de Nefrologia",
    description: "LANEFRO" 
  },
  { 
    id: "lar", 
    name: "Liga Acadêmica de Reumatologia",
    description: "LAR" 
  },
  { 
    id: "lupa", 
    name: "Liga Acadêmica de Psiquiatria de Araguari",
    description: "LUPA" 
  },
  { 
    id: "laard", 
    name: "Liga Acadêmica de Anestesiologia, Reanimação e Dor",
    description: "LAARD" 
  },
  { 
    id: "laoto", 
    name: "Liga Acadêmica de Otorrinolaringologia",
    description: "LAOTO" 
  },
  { 
    id: "laoa", 
    name: "Liga Acadêmica de Oftalmologia",
    description: "LAOA" 
  },
  { 
    id: "liap", 
    name: "Liga Academia de Pneumologia",
    description: "LIAP" 
  },
  { 
    id: "lae", 
    name: "Liga Acadêmica de Endocrinologia",
    description: "LAE" 
  },
  { 
    id: "laget", 
    name: "Liga de Gestão, Empreendedorismo e Tecnologia",
    description: "LAGET" 
  }
];
