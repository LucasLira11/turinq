import type { Metadata } from "next";
import CtaBand from "@/components/ui/CtaBand";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ServiceGrid from "@/components/ui/ServiceGrid";
import { projects } from "@/content/projects";
import { metadataFor } from "@/content/metadata";
import { routeFor } from "@/content/routes";
import { services } from "@/content/services";

const route = routeFor("/sites-e-sistemas")!;

export const metadata: Metadata = metadataFor("/sites-e-sistemas");

export default function SitesESistemasPage() {
  return (
    <>
      <PageHero eyebrow="Sites e sistemas" title="Software que dura." lead={route.description} tone="light" />
      <div className="relative bg-paper text-ink">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <Reveal as="h2" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            O que construímos
          </Reveal>
          <div className="mt-12">
            <ServiceGrid items={services.sitesESistemas} tone="light" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-t border-ink/10 px-4 py-24 sm:px-6">
          <Reveal as="h2" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Projetos de destaque
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <li key={p.title} className="flex flex-col rounded-3xl border border-ink/10 bg-white/60 p-8">
                <p className="font-mono text-xs tracking-[0.2em] text-steel uppercase">{p.tag}</p>
                <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/75">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <CtaBand tone="light" title="Do primeiro esboço ao sistema no ar. Vamos conversar?" />
      </div>
    </>
  );
}
