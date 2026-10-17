import Link from "next/link";
import ActSection from "@/components/home/ActSection";
import HeroWordmark from "@/components/home/HeroWordmark";
import FilmScroll from "@/components/home/FilmScroll";
import { ACTS } from "@/components/three/film/timeline";
import Button from "@/components/ui/Button";
import FacetBullet from "@/components/ui/FacetBullet";
import FilmProgress from "@/components/ui/FilmProgress";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { contactChannels, site, siteUrl, whatsappUrl } from "@/content/site";

const act = Object.fromEntries(ACTS.map((a) => [a.id, a])) as Record<(typeof ACTS)[number]["id"], (typeof ACTS)[number]>;

const GIS_CAPABILITIES = ["Mapas web interativos", "Geoprocessamento", "Painéis geográficos", "Sistemas com base GIS"];
const SCREENS = ["Sites institucionais", "Portais sindicais", "Sistemas de gestão", "Aplicativos"];

const eyebrow = "font-mono text-xs tracking-[0.24em] uppercase";
const h2 = "font-display text-3xl leading-[1.08] font-semibold tracking-tight sm:text-5xl";

export default function Home() {
  const url = siteUrl();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url,
    logo: new URL("/logo-turinq.png", url).toString(),
    slogan: site.tagline,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-22-99779-3222",
      contactType: "customer service",
      availableLanguage: "Portuguese",
      ...(site.email ? { email: site.email } : {}),
    },
  };

  return (
    <>
      <JsonLd data={organization} />
      <FilmProgress />
      <FilmScroll>
        <ActSection act={act.abertura} tone="light">
          <HeroWordmark />
          <h1 className="mt-10 font-display text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
            Do site institucional ao mapa do território.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/75">
            Há mais de 20 anos a Turinq desenvolve sites, sistemas e soluções em geotecnologia — com atuação especial na
            área sindical.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={whatsappUrl()} external>
              Iniciar um projeto
            </Button>
            <Button href="#anos" variant="ghost">
              Ver o que fazemos
            </Button>
          </div>
        </ActSection>

        <ActSection act={act.anos} tone="light">
          <Reveal as="h2" className={h2}>
            Mais de 20 anos escrevendo software que dura.
          </Reveal>
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {site.stats.map((s) => (
              <div key={s.label} className="flex flex-col border-t border-ink/15 pt-4">
                <dt className="text-sm text-ink/70">{s.label}</dt>
                <dd className="order-first font-display text-4xl font-semibold text-brand">{s.value}</dd>
              </div>
            ))}
          </dl>
        </ActSection>

        <ActSection act={act.planeta} tone="dark">
          <p className={`${eyebrow} text-gis`}>Geotecnologia</p>
          <Reveal as="h2" className={`${h2} mt-5`}>
            Geotecnologia: o território como dado.
          </Reveal>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Projetos com ArcGIS e plataformas baseadas em GIS, que transformam localização em decisão.
          </p>
          <Link href="/geotecnologia" className="mt-8 inline-block font-bold text-gis underline-offset-4 hover:underline">
            Conheça a geotecnologia da Turinq →
          </Link>
        </ActSection>

        <ActSection act={act.territorio} tone="dark" align="right">
          <Reveal as="h2" className={h2}>
            Cada camada, uma resposta.
          </Reveal>
          <ul className="mt-8 space-y-3">
            {GIS_CAPABILITIES.map((c) => (
              <li key={c} className="flex items-center gap-3 text-lg text-white/85">
                <FacetBullet className="text-gis" />
                {c}
              </li>
            ))}
          </ul>
        </ActSection>

        <ActSection act={act.telas} tone="light">
          <Reveal as="h2" className={h2}>
            Das camadas às telas.
          </Reveal>
          <ul className="mt-8 space-y-3">
            {SCREENS.map((s) => (
              <li key={s} className="flex items-center gap-3 text-lg text-ink/80">
                <FacetBullet className="text-brand" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-bold text-steel">
            <Link href="/sindical" className="underline-offset-4 hover:underline">
              Área sindical →
            </Link>
            <Link href="/sites-e-sistemas" className="underline-offset-4 hover:underline">
              Sites e sistemas →
            </Link>
          </div>
        </ActSection>

        <ActSection act={act.fechamento} tone="light" align="center">
          <Reveal as="h2" className={h2}>
            Vamos mapear o seu próximo projeto.
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {contactChannels(site).map((c) => (
              <Button key={c.kind} href={c.href} external={c.kind === "whatsapp"} variant={c.kind === "whatsapp" ? "solid" : "ghost"}>
                {c.kind === "whatsapp" ? "Conversar no WhatsApp" : c.label}
              </Button>
            ))}
          </div>
        </ActSection>
      </FilmScroll>
    </>
  );
}
