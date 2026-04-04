export type SiteNavItem = {
  href: string;
  label: string;
  description: string;
};

export type SocialAccount = {
  name: string;
  handle: string;
  url: string;
};

export type CoordinatorSlug = "caep" | "caes" | "clam" | "cac" | "clev";

export type CoordinatorProfile = {
  slug: CoordinatorSlug;
  shortName: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  imageSrc: string;
  accent: {
    primary: string;
    secondary: string;
    surface: string;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  overview: Array<{
    title: string;
    text: string;
  }>;
  mission: string;
  values: string[];
  highlights: string[];
  team?: Array<{
    name: string;
    role: string;
    photo: string;
  }>;
  qrCode?: {
    src: string;
    title: string;
    caption: string;
  };
};

export const siteNavigation: SiteNavItem[] = [
  { href: "/", label: "Inicio", description: "Visao geral do DADG" },
  { href: "/certificados", label: "Certificados", description: "Busque e valide certificados" },
  { href: "/coordenadorias", label: "Coordenadorias", description: "Conheca os nucleos de atuacao" },
  { href: "/eventos", label: "Eventos", description: "Calendario academico e programacao" },
  { href: "/mural", label: "Mural", description: "Avisos e comunicados" },
  { href: "/sobre", label: "Sobre", description: "Historia, missao e valores" },
  { href: "/contato", label: "Contato", description: "Instagram, e-mail e canais" },
  { href: "/ouvidoria", label: "Ouvidoria", description: "Envie manifestacoes e sugestoes" },
];

export const socialAccounts: SocialAccount[] = [
  { name: "DADG ImePAC", handle: "@dadg.imepac", url: "https://instagram.com/dadg.imepac" },
  { name: "CAEP ImePAC", handle: "@caep.imepac", url: "https://instagram.com/caep.imepac" },
  { name: "CLAM ImePAC", handle: "@clam.imepac", url: "https://instagram.com/clam.imepac" },
  { name: "CLEV ImePAC Araguari", handle: "@clevimepacaraguari", url: "https://instagram.com/clevimepacaraguari" },
  { name: "CAES ImePAC", handle: "@caes.imepac", url: "https://instagram.com/caes.imepac" },
  { name: "COEPS Araguari", handle: "@coeps.araguari", url: "https://instagram.com/coeps.araguari" },
];

export const homepageHighlights = [
  {
    title: "Acesso rapido a servicos",
    text: "Certificados, calendario, mural e canais de contato ficam a poucos cliques, em uma estrutura mais clara e objetiva.",
  },
  {
    title: "Representacao com organizacao",
    text: "O site passa a apresentar o DADG como uma instituicao estudantil forte, com comunicacao profissional e bem segmentada.",
  },
  {
    title: "Experiencia pensada para estudantes",
    text: "Cada pagina prioriza legibilidade, orientacao e fluxo, sem perder as funcoes que ja sustentam o dia a dia academico.",
  },
];

export const supportPillars = [
  "Representacao estudantil",
  "Extensao e pesquisa",
  "Educacao em saude",
  "Ligas academicas",
  "Certificados e tecnologia",
  "Estagios e vivencias",
];

export const coordinatorProfiles: Record<CoordinatorSlug, CoordinatorProfile> = {
  caep: {
    slug: "caep",
    shortName: "CAEP",
    title: "CAEP",
    subtitle: "Coordenadoria Academica de Extensao e Pesquisa",
    summary: "Conecta ensino, pesquisa e extensao em iniciativas com impacto academico e social.",
    description:
      "A CAEP fortalece o ambiente universitario ao aproximar estudantes de projetos, pesquisas e acoes extensionistas que ampliam a formacao medica.",
    imageSrc: "/coordinators/CAEP.png",
    accent: {
      primary: "#000066",
      secondary: "#3366CC",
      surface: "rgba(51, 102, 204, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Pesquisa e extensao" },
      { label: "Atuacao", value: "Integracao academica" },
      { label: "Perfil", value: "Inovacao cientifica" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "Somos a coordenadoria responsavel por fomentar e coordenar as atividades de extensao e pesquisa dentro da estrutura do DADG.",
      },
      {
        title: "O que buscamos",
        text: "Promover a integracao entre ensino, pesquisa e extensao por meio de projetos que contribuam para o desenvolvimento academico e social.",
      },
      {
        title: "Como contribuimos",
        text: "Criamos pontes entre alunos, projetos e oportunidades para transformar curiosidade cientifica em acao concreta.",
      },
    ],
    mission:
      "Promover o desenvolvimento academico por meio da integracao entre ensino, pesquisa e extensao, contribuindo para a formacao de profissionais comprometidos com a transformacao social.",
    values: [
      "Excelencia academica",
      "Inovacao cientifica",
      "Compromisso social",
      "Integracao com a comunidade",
    ],
    highlights: [
      "Apoio a projetos com impacto para a comunidade",
      "Estreitamento entre teoria, pratica e producao cientifica",
      "Valorizacao de uma formacao medica mais completa",
    ],
  },
  caes: {
    slug: "caes",
    shortName: "CAES",
    title: "CAES",
    subtitle: "Coordenadoria Academica de Educacao em Saude",
    summary: "Leva educacao em saude para dentro e para fora da faculdade com foco em transformacao social.",
    description:
      "A CAES organiza iniciativas educativas que aproximam conhecimento, prevencao e impacto social, reforcando o compromisso do curso com a comunidade.",
    imageSrc: "/coordinators/CAES.jpg",
    accent: {
      primary: "#056653",
      secondary: "#16A34A",
      surface: "rgba(22, 163, 74, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Educacao em saude" },
      { label: "Impacto", value: "Comunidade" },
      { label: "Direcao", value: "Prevencao e cuidado" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "Somos a coordenadoria dedicada a desenvolver iniciativas de educacao em saude com linguagem acessivel e impacto real.",
      },
      {
        title: "O que buscamos",
        text: "Levar educacao em saude para a comunidade e ampliar a consciencia sobre temas que transformam a qualidade de vida da populacao.",
      },
      {
        title: "Como atuamos",
        text: "Conectamos estudantes, conhecimento e acao pratica em projetos voltados para orientacao, prevencao e promocao da saude.",
      },
    ],
    mission:
      "Trabalhamos para impactar positivamente a vida das pessoas e transformar a comunidade em um lugar melhor por meio da educacao em saude.",
    values: [
      "Compromisso com a excelencia",
      "Etica",
      "Educacao em saude para a populacao",
      "Inovacao e evolucao constante",
    ],
    highlights: [
      "Projetos com linguagem clara e orientada ao cuidado",
      "Vivencias que aproximam estudantes da realidade social",
      "Fortalecimento da responsabilidade coletiva em saude",
    ],
  },
  clam: {
    slug: "clam",
    shortName: "CLAM",
    title: "CLAM",
    subtitle: "Coordenadoria de Ligas Academicas de Medicina",
    summary: "Organiza, integra e da visibilidade ao ecossistema de ligas academicas da Imepac.",
    description:
      "A CLAM conecta ligas, estudantes e oportunidades, fortalecendo a cultura academica e o aprofundamento em diferentes areas da medicina.",
    imageSrc: "/coordinators/CLAM.png",
    accent: {
      primary: "#0A7A1A",
      secondary: "#22C55E",
      surface: "rgba(34, 197, 94, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Ligas academicas" },
      { label: "Atuacao", value: "Integracao e organizacao" },
      { label: "Perfil", value: "Protagonismo estudantil" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "A CLAM e o orgao responsavel por coordenar e integrar todas as ligas academicas da Imepac.",
      },
      {
        title: "Objetivo central",
        text: "Promover integracao entre as ligas, incentivar o desenvolvimento cientifico e ampliar as possibilidades de aprendizado.",
      },
      {
        title: "Como apoiamos",
        text: "Facilitamos o acesso a informacoes, fortalecemos a identidade das ligas e organizamos a vitrine de oportunidades academicas.",
      },
    ],
    mission:
      "Fomentar um ambiente colaborativo no qual as ligas academicas contribuam para uma formacao medica de excelencia.",
    values: [
      "Integracao",
      "Organizacao",
      "Autonomia estudantil",
      "Desenvolvimento cientifico",
    ],
    highlights: [
      "Navegacao organizada por ciclo academico",
      "Apresentacao clara da identidade de cada liga",
      "Maior visibilidade para projetos e areas de atuacao",
    ],
  },
  cac: {
    slug: "cac",
    shortName: "CAC",
    title: "CAC",
    subtitle: "Coordenadoria Academica de Certificados e TI",
    summary: "Cuida dos fluxos de certificados e evolui a experiencia digital do DADG.",
    description:
      "A CAC atua como ponte entre organizacao, tecnologia e atendimento, melhorando processos internos e a usabilidade dos servicos oferecidos aos estudantes.",
    imageSrc: "/coordinators/CAC.jpeg",
    accent: {
      primary: "#050A4A",
      secondary: "#3B82F6",
      surface: "rgba(59, 130, 246, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Certificados e TI" },
      { label: "Atuacao", value: "Processos digitais" },
      { label: "Perfil", value: "Organizacao e suporte" },
    ],
    overview: [
      {
        title: "Visao",
        text: "Ser a ponte entre setores, pessoas e ideias com empatia, organizacao e excelencia.",
      },
      {
        title: "Missao operacional",
        text: "Garantir inovacao e organizacao para os processos de certificados e melhorar continuamente a experiencia digital dos discentes.",
      },
      {
        title: "Papel no site",
        text: "A CAC sustenta fluxos que precisam funcionar de verdade: busca, validacao, visualizacao e distribuicao de certificados.",
      },
    ],
    mission:
      "Trazer clareza, agilidade e tecnologia para os processos que precisam ser confiaveis e simples para todos os estudantes.",
    values: [
      "Empatia",
      "Transparencia",
      "Agilidade",
      "Organizacao",
      "Colaboracao",
    ],
    highlights: [
      "Melhoria continua dos fluxos digitais do DADG",
      "Atendimento mais claro para quem precisa de certificados",
      "Apoio tecnico para dar escala e consistencia aos processos",
    ],
    team: [
      { name: "Mateus Rosa", role: "Coordenador", photo: "/membersCAC/mateus.jpg" },
      { name: "Nicoly Gonzaga", role: "Coordenadora", photo: "/membersCAC/nicoly.jpeg" },
      { name: "Gianluca Zambiazi", role: "Nucleo de apoio", photo: "/membersCAC/gianluca.jpeg" },
      { name: "Rafaela Luiza Gonzaga", role: "Nucleo de apoio", photo: "/membersCAC/rafaela.png" },
      { name: "Lucas Borges", role: "Nucleo de apoio", photo: "/membersCAC/lucas.jpg" },
      { name: "Heloisa Benatt", role: "Nucleo de apoio", photo: "/membersCAC/helo.jpeg" },
    ],
  },
  clev: {
    slug: "clev",
    shortName: "CLEV",
    title: "CLEV",
    subtitle: "Coordenadoria Local de Estagios e Vivencias",
    summary: "Transforma experiencias praticas em oportunidades de crescimento academico e profissional.",
    description:
      "A CLEV organiza experiencias, estagios e vivencias que conectam estudantes a contextos praticos importantes para sua formacao medica.",
    imageSrc: "/coordinators/CLEV.jpg",
    accent: {
      primary: "#526C94",
      secondary: "#60A5FA",
      surface: "rgba(96, 165, 250, 0.18)",
    },
    stats: [
      { label: "Foco", value: "Estagios e vivencias" },
      { label: "Atuacao", value: "Experiencias praticas" },
      { label: "Perfil", value: "Crescimento profissional" },
    ],
    overview: [
      {
        title: "Quem somos",
        text: "Somos a coordenadoria responsavel por gerenciar e organizar experiencias praticas para os estudantes de medicina.",
      },
      {
        title: "O que buscamos",
        text: "Garantir acesso a estagios e vivencias que complementem a formacao academica com qualidade e relevancia.",
      },
      {
        title: "Como apoiamos",
        text: "Ajudamos os alunos a transformar interesse em oportunidade por meio de organizacao, orientacao e acesso.",
      },
    ],
    mission:
      "Garantir que cada estudante tenha acesso a experiencias praticas de qualidade, contribuindo para uma formacao medica completa e excelente.",
    values: [
      "Excelencia na formacao pratica",
      "Organizacao e eficiencia",
      "Compromisso com a qualidade",
      "Inovacao nos processos",
    ],
    highlights: [
      "Proximidade com vivencias que ampliam repertorio",
      "Mais organizacao para oportunidades extracurriculares",
      "Rede de informacoes acessivel e direta",
    ],
    qrCode: {
      src: "/QRCLEV.png",
      title: "Grupo oficial da CLEV",
      caption: "Escaneie o QR Code para entrar no grupo do WhatsApp e receber informacoes sobre eventos e vivencias.",
    },
  },
};

export const coordinatorCards = Object.values(coordinatorProfiles).map((profile) => ({
  slug: profile.slug,
  shortName: profile.shortName,
  title: profile.subtitle,
  summary: profile.summary,
  imageSrc: profile.imageSrc,
  accent: profile.accent,
}));
