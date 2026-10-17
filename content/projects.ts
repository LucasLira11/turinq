// Projetos confirmados pelo Lucas (vindos do site anterior). Sem nome de cliente.

export type Project = {
  tag: string;
  title: string;
  description: string;
  area: "sistemas" | "sindical" | "mobile";
};

export const projects: Project[] = [
  {
    tag: "Sistema ERP",
    title: "Plataforma de Gestão Completa",
    description:
      "Sistema empresarial robusto com controle de finanças, gestão de afiliações e módulos administrativos.",
    area: "sistemas",
  },
  {
    tag: "Portal Corporativo",
    title: "Site Institucional Dinâmico",
    description: "Plataforma profissional para empresas com sistema integrado de publicações e notícias diárias.",
    area: "sistemas",
  },
  {
    tag: "App Mobile (IA)",
    title: "Rastreamento Inteligente",
    description:
      "Aplicativo mobile para monitoramento e localização de transportes, otimizado com Inteligência Artificial.",
    area: "mobile",
  },
];
