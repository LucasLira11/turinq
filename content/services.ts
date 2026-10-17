// O que a Turinq faz em cada área. Capacidades descritas sem nome de cliente.

export type Service = { title: string; description: string };

export const services: {
  geotecnologia: Service[];
  sindical: Service[];
  sitesESistemas: Service[];
} = {
  geotecnologia: [
    {
      title: "Mapas web interativos",
      description: "Mapas publicados na web para consultar, filtrar e compartilhar informação geográfica sem instalar nada.",
    },
    {
      title: "Geoprocessamento",
      description: "Análises espaciais que cruzam camadas de dados para responder onde, quanto e o que muda no território.",
    },
    {
      title: "Painéis geográficos",
      description: "Indicadores e mapas lado a lado, para acompanhar o território em tempo real e decidir com base em dados.",
    },
    {
      title: "Sistemas com base GIS",
      description: "Aplicações sob medida que integram dados geográficos ao fluxo de trabalho da sua equipe.",
    },
  ],
  sindical: [
    {
      title: "Portal institucional",
      description: "Site da entidade com notícias publicadas por um editor próprio, simples para a equipe de comunicação.",
    },
    {
      title: "Filiação online",
      description: "Fluxo de filiação pela internet, com os dados chegando organizados para a secretaria.",
    },
    {
      title: "Convênios",
      description: "Área de convênios e benefícios organizada por categoria, fácil de manter e de consultar.",
    },
    {
      title: "Migração de sites antigos",
      description: "Migração de conteúdo de plataformas antigas, como WordPress, preservando notícias, imagens e autores.",
    },
  ],
  sitesESistemas: [
    {
      title: "Sites institucionais",
      description: "Sites rápidos, acessíveis e otimizados para buscadores, que apresentam a sua empresa com clareza.",
    },
    {
      title: "Sistemas sob medida",
      description: "ERPs e plataformas de gestão que automatizam a operação e crescem junto com o negócio.",
    },
    {
      title: "Aplicativos mobile",
      description: "Apps para iOS e Android com foco em experiência de uso e desempenho.",
    },
  ],
};
