// Fonte única das rotas: navegação, sitemap, metadata, tom de cor e cena 3D.

export type SceneId = "film" | "terrain" | "panels" | "sphere" | "globe";
export type Tone = "light" | "dark";

export type RouteInfo = {
  path: string;
  label: string;
  title: string;
  description: string;
  tone: Tone;
  scene: SceneId;
  inNav: boolean;
};

export const ROUTES: RouteInfo[] = [
  {
    path: "/",
    label: "Início",
    title: "Turinq — Tecnologia e Desenvolvimento",
    description:
      "Há mais de 20 anos a Turinq desenvolve sites, sistemas e soluções em geotecnologia, com atuação especial na área sindical.",
    tone: "light",
    scene: "film",
    inNav: false,
  },
  {
    path: "/geotecnologia",
    label: "Geotecnologia",
    title: "Geotecnologia com ArcGIS e plataformas GIS",
    description:
      "Mapas web interativos, geoprocessamento, painéis geográficos e sistemas com base GIS para transformar localização em decisão.",
    tone: "dark",
    scene: "terrain",
    inNav: true,
  },
  {
    path: "/sindical",
    label: "Sindical",
    title: "Tecnologia para sindicatos",
    description:
      "Portais institucionais com notícias e editor próprio, filiação online, convênios e migração de sites antigos para entidades sindicais.",
    tone: "light",
    scene: "panels",
    inNav: true,
  },
  {
    path: "/sites-e-sistemas",
    label: "Sites e Sistemas",
    title: "Sites institucionais, sistemas e aplicativos",
    description:
      "Sites institucionais, sistemas de gestão sob medida e aplicativos mobile, do planejamento à entrega e ao suporte.",
    tone: "light",
    scene: "panels",
    inNav: true,
  },
  {
    path: "/sobre",
    label: "Sobre",
    title: "Sobre a Turinq",
    description:
      "Mais de 20 anos de mercado desenvolvendo software que dura: conheça a Turinq, nossos números e como trabalhamos.",
    tone: "light",
    scene: "sphere",
    inNav: true,
  },
  {
    path: "/contato",
    label: "Contato",
    title: "Fale com a Turinq",
    description:
      "Conte o seu projeto para a Turinq pelo WhatsApp e receba o retorno de quem desenvolve sites, sistemas e soluções GIS.",
    tone: "light",
    scene: "sphere",
    inNav: true,
  },
];

export function routeFor(pathname: string): RouteInfo | null {
  return ROUTES.find((r) => r.path === pathname) ?? null;
}

// Rota desconhecida = 404, que usa o globo no escuro.
export function sceneForPath(pathname: string): SceneId {
  return routeFor(pathname)?.scene ?? "globe";
}

export function toneForPath(pathname: string): Tone {
  return routeFor(pathname)?.tone ?? "dark";
}
