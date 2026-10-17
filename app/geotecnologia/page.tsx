import type { Metadata } from "next";
import CtaBand from "@/components/ui/CtaBand";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ServiceGrid from "@/components/ui/ServiceGrid";
import { metadataFor } from "@/content/metadata";
import { routeFor } from "@/content/routes";
import { services } from "@/content/services";
import { site } from "@/content/site";

const route = routeFor("/geotecnologia")!;

export const metadata: Metadata = metadataFor("/geotecnologia");

export default function GeotecnologiaPage() {
  return (
    <>
      <PageHero eyebrow="Geotecnologia" title="O território como dado." lead={route.description} tone="dark" />
      <div className="relative bg-night text-white">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <Reveal as="h2" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            O que fazemos com GIS
          </Reveal>
          <div className="mt-12">
            <ServiceGrid items={services.geotecnologia} tone="dark" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-t border-white/10 px-4 py-24 sm:px-6">
          <h2 className="font-mono text-xs tracking-[0.24em] text-gis uppercase">Ferramentas</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Trabalhamos com ArcGIS e plataformas baseadas em GIS, escolhendo a ferramenta pelo problema — não o
            contrário.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {site.gisTools.map((t) => (
              <li key={t} className="rounded-full border border-white/20 px-5 py-2 font-mono text-sm text-white/85">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <CtaBand
          tone="dark"
          title="Tem um território para entender? Vamos colocar no mapa."
          message="Olá! Vim pelo site da Turinq e quero conversar sobre um projeto de geotecnologia."
        />
      </div>
    </>
  );
}
