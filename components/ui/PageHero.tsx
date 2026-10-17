import type { ReactNode } from "react";
import type { Tone } from "@/content/routes";

type Props = { eyebrow: string; title: string; lead: string; tone: Tone; children?: ReactNode };

// Topo das páginas internas: fundo transparente para a cena 3D aparecer atrás.
export default function PageHero({ eyebrow, title, lead, tone, children }: Props) {
  const dark = tone === "dark";
  return (
    <section className="relative flex min-h-[80svh] items-end">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 sm:px-6">
        <p className={`font-mono text-xs tracking-[0.24em] uppercase ${dark ? "text-gis" : "text-brand"}`}>{eyebrow}</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.04] font-semibold tracking-tight text-balance sm:text-6xl">
          {title}
        </h1>
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${dark ? "text-white/80" : "text-ink/75"}`}>{lead}</p>
        {children}
      </div>
    </section>
  );
}
