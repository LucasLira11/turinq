import type { Metadata } from "next";
import CtaBand from "@/components/ui/CtaBand";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { routeFor } from "@/content/routes";
import { site } from "@/content/site";

const route = routeFor("/sobre")!;

export const metadata: Metadata = { title: route.title, description: route.description };

const STEPS = [
  { title: "Diagnóstico", text: "Entendemos o problema, quem vai usar e o que precisa mudar antes de escrever uma linha de código." },
  { title: "Projeto", text: "Desenhamos a solução, as telas e a arquitetura, com prazos e entregas combinados com você." },
  { title: "Entrega", text: "Desenvolvemos em etapas que você acompanha, testando cada parte antes de ir para o ar." },
  { title: "Suporte", text: "Depois do lançamento, seguimos junto: ajustes, evolução e manutenção." },
];

export default function SobrePage() {
  return (
    <>
      <PageHero eyebrow="Sobre a Turinq" title="Mais de 20 anos escrevendo software que dura." lead={route.description} tone="light" />
      <div className="relative bg-paper text-ink">
        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <div>
            <Reveal as="h2" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Tecnologia com história
            </Reveal>
            <p className="mt-6 text-lg leading-relaxed text-ink/75">
              A Turinq desenvolve software há mais de duas décadas: sites institucionais, sistemas de gestão, aplicativos e
              soluções em geotecnologia. Atendemos de empresas a entidades sindicais, com a mesma atenção a quem vai usar o
              sistema todos os dias.
            </p>
            {site.foundedYear && (
              <p className="mt-4 text-lg leading-relaxed text-ink/75">Desde {site.foundedYear}.</p>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-6 self-start">
            {site.stats.map((s) => (
              <div key={s.label} className="flex flex-col rounded-3xl border border-ink/10 p-6">
                <dt className="text-sm text-ink/70">{s.label}</dt>
                <dd className="order-first font-display text-4xl font-semibold text-brand">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mx-auto max-w-7xl border-t border-ink/10 px-4 py-24 sm:px-6">
          <Reveal as="h2" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Como trabalhamos
          </Reveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-3xl border border-ink/10 p-6">
                <span className="font-mono text-xs text-steel">0{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <CtaBand tone="light" title="Vamos começar pelo diagnóstico do seu projeto?" />
      </div>
    </>
  );
}
