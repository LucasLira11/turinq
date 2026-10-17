// Fatos da empresa. Só entra aqui o que o Lucas confirmou; campo null ou lista
// vazia é TODO e os componentes omitem o item em vez de inventar um valor.

export type Stat = { value: string; label: string };

export type Site = {
  name: string;
  tagline: string;
  whatsapp: string;
  email: string | null;
  address: string | null;
  foundedYear: number | null;
  social: { label: string; url: string }[];
  gisTools: string[];
  stats: Stat[];
};

export const site: Site = {
  name: "Turinq",
  tagline: "Tecnologia e Desenvolvimento",
  whatsapp: "5522997793222",
  // TODO(Lucas): e-mail de contato da Turinq
  email: null,
  // TODO(Lucas): endereço / cidade
  address: null,
  // TODO(Lucas): ano de fundação
  foundedYear: null,
  // TODO(Lucas): redes sociais (Instagram, LinkedIn...)
  social: [],
  // TODO(Lucas): confirmar ferramentas além do ArcGIS (ArcGIS Pro / Online / Enterprise, QGIS...)
  gisTools: ["ArcGIS"],
  stats: [
    { value: "20+", label: "Anos de mercado" },
    { value: "15+", label: "Projetos entregues" },
    { value: "98%", label: "Satisfação dos clientes" },
    { value: "5+", label: "Especialistas" },
  ],
};

const DEFAULT_MESSAGE = "Olá! Vim pelo site da Turinq e gostaria de conversar sobre um projeto.";

export function whatsappUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type ContactChannel = { kind: "whatsapp" | "email"; label: string; href: string };

export function contactChannels(s: Site): ContactChannel[] {
  const channels: ContactChannel[] = [{ kind: "whatsapp", label: "WhatsApp", href: whatsappUrl() }];
  if (s.email) channels.push({ kind: "email", label: s.email, href: `mailto:${s.email}` });
  return channels;
}

export function siteUrl(env: Record<string, string | undefined> = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL;
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
