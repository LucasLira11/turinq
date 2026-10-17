import type { Metadata } from "next";
import CtaBand from "@/components/ui/CtaBand";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ServiceGrid from "@/components/ui/ServiceGrid";
import { projects } from "@/content/projects";
import { routeFor } from "@/content/routes";
import { services } from "@/content/services";

const route = routeFor("/sindical")!;

export const metadata: Metadata = { title: route.title, description: route.description };

export default function SindicalPage() {
  const cases = projects.filter((p) => p.area === "sindical");

  return (
    <>
      <PageHero eyebrow="Área sindical" title="Tecnologia para quem representa." lead={route.description} tone="light" />
      <div className="relative bg-paper text-ink">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <Reveal as="h2" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            O que a sua entidade ganha
          </Reveal>
          <div className="mt-12">
            <ServiceGrid items={services.sindical} tone="light" />
          </div>
        </section>

        {cases.length > 0 && (
          <section className="mx-auto max-w-7xl border-t border-ink/10 px-4 py-24 sm:px-6">
            <h2 className="font-mono text-xs tracking-[0.24em] text-brand uppercase">Projetos</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {cases.map((p) => (
                <li key={p.title} className="rounded-3xl border border-ink/10 p-8">
                  <p className="font-mono text-xs tracking-[0.2em] text-steel uppercase">{p.tag}</p>
                  <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink/75">{p.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <CtaBand
          tone="light"
          title="Sua entidade merece um portal à altura da categoria."
          message="Olá! Vim pelo site da Turinq e quero conversar sobre um projeto para a nossa entidade sindical."
        />
      </div>
    </>
  );
}
