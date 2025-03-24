
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
    name: "LACOHP", 
    description: "Liga Acadêmica de Comunicação, Humanização e Plantão da Palhaçada",
    specialty: "Comunicação e Humanização",
    activities: ["Aulas teóricas", "Atividades práticas", "Pesquisa científica"],
    aboutUs: "Somos uma liga dedicada ao estudo da comunicação em saúde e humanização no atendimento, fundada por estudantes interessados em aprofundar conhecimentos nesta área específica.",
    mission: "Promover o conhecimento em comunicação e humanização na saúde, desenvolver habilidades interpessoais e formar profissionais conscientes da importância da comunicação humanizada no atendimento aos pacientes."
  },
  { 
    id: "lafim", 
    name: "LAFIM", 
    description: "Liga Acadêmica de Fisiologia Médica",
    specialty: "Fisiologia"
  },
  { 
    id: "laps", 
    name: "LAPS", 
    description: "Liga Acadêmica de Primeiros Socorros",
    specialty: "Primeiros Socorros",
    activities: ["Treinamentos práticos", "Simulações", "Projetos de extensão"] 
  },
  { 
    id: "lapa", 
    name: "LAPA", 
    description: "Liga Acadêmica de Patologia de Araguari",
    specialty: "Patologia"
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
    description: "Liga Acadêmica de Farmacologia IMEPAC",
    specialty: "Farmacologia",
    activities: ["Pesquisa farmacológica", "Análise de medicamentos", "Estudos clínicos"]
  },
  { 
    id: "lame", 
    name: "LAME", 
    description: "Liga Acadêmica de Medicina do Esporte",
    specialty: "Medicina Esportiva",
    activities: ["Avaliação física", "Medicina preventiva no esporte", "Reabilitação esportiva"]
  },
  { 
    id: "lamfac", 
    name: "LAMFAC", 
    description: "Liga Acadêmica de Medicina da Família e Comunidade",
    specialty: "Medicina de Família",
    activities: ["Visitas domiciliares", "Atenção primária", "Medicina preventiva"]
  },
  { 
    id: "laic", 
    name: "LAIC", 
    description: "Liga Acadêmica de Alergia e Imunologia Clínica",
    specialty: "Imunologia",
    activities: ["Estudo de doenças autoimunes", "Alergologia", "Imunização"] 
  },
  { 
    id: "ligami", 
    name: "LIGAMI", 
    description: "Liga Acadêmica de Medicina Intensiva",
    specialty: "Medicina Intensiva",
    activities: ["Protocolos de UTI", "Ventilação mecânica", "Condutas em emergências"]
  },
  { 
    id: "laplast", 
    name: "LAPLAST", 
    description: "Liga Acadêmica de Cirurgia Plástica" 
  },
  { 
    id: "lacca", 
    name: "LACCA", 
    description: "Liga Acadêmica de Clínica Cirúrgica de Araguari" 
  },
  { 
    id: "lamelp", 
    name: "LAMELP", 
    description: "Liga Acadêmica de Medicina Legal e Perícias Médicas" 
  },
  { 
    id: "laot", 
    name: "LAOT", 
    description: "Liga Acadêmica de Ortopedia e Traumatologia" 
  },
  { 
    id: "uroliga", 
    name: "UROLIGA", 
    description: "Liga Acadêmica de Urologia" 
  },
  { 
    id: "luma", 
    name: "LUMA", 
    description: "Liga Universitária de Mastologia" 
  },
  { 
    id: "lume", 
    name: "LUME", 
    description: "Liga Universitária de Medicina de Emergência" 
  },
  { 
    id: "lucmsc", 
    name: "LUCMSC", 
    description: "Liga Acadêmica de Clínica Médica e Saúde Coletiva" 
  },
  { 
    id: "lagastro", 
    name: "LAGASTRO", 
    description: "Liga Acadêmica de Gastroenterologia" 
  },
  { 
    id: "lagem", 
    name: "LAGEM", 
    description: "Liga Acadêmica de Genética e Embriologia Médica" 
  },
  { 
    id: "lanut", 
    name: "LANUT", 
    description: "Liga Acadêmica de Nutrologia" 
  },
  { 
    id: "lasem", 
    name: "LASEM", 
    description: "Liga Acadêmica de Semiologia Médica" 
  },
  { 
    id: "laad", 
    name: "LAAD", 
    description: "Liga Acadêmica de Anatomia e Dissecação" 
  },
  { 
    id: "lacor", 
    name: "LACOR", 
    description: "Liga de Cardiologia de Araguari" 
  },
  { 
    id: "laderm", 
    name: "LADERM", 
    description: "Liga Acadêmica de Dermatologia" 
  },
  { 
    id: "lago", 
    name: "LAGO", 
    description: "Liga Acadêmica de Ginecologia e Obstetrícia" 
  },
  { 
    id: "lane", 
    name: "LANE", 
    description: "Liga Acadêmica de Neurologia" 
  },
  { 
    id: "laonco", 
    name: "LAONCO", 
    description: "Liga Acadêmica de Oncologia" 
  },
  { 
    id: "lanefro", 
    name: "LANEFRO", 
    description: "Liga Acadêmica de Nefrologia" 
  },
  { 
    id: "lar", 
    name: "LAR", 
    description: "Liga Acadêmica de Reumatologia" 
  },
  { 
    id: "lupa", 
    name: "LUPA", 
    description: "Liga Acadêmica de Psiquiatria de Araguari" 
  },
  { 
    id: "laard", 
    name: "LAARD", 
    description: "Liga Acadêmica de Anestesiologia, Reanimação e Dor" 
  },
  { 
    id: "laoto", 
    name: "LAOTO", 
    description: "Liga Acadêmica de Otorrinolaringologia" 
  },
  { 
    id: "laoa", 
    name: "LAOA", 
    description: "Liga Acadêmica de Oftalmologia" 
  },
  { 
    id: "liap", 
    name: "LIAP", 
    description: "Liga Acadêmica de Pneumologia" 
  },
  { 
    id: "lae", 
    name: "LAE", 
    description: "Liga Acadêmica de Endocrinologia" 
  },
  { 
    id: "laget", 
    name: "LAGET", 
    description: "Liga Acadêmica de Gestão, Empreendedorismo e Tecnologia" 
  }
];
