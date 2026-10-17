import type { ReactNode } from "react";
import type { Tone } from "@/content/routes";
import { FILM_HEIGHT_SVH, type Act } from "@/components/three/film/timeline";

type Props = {
  act: Act;
  tone: Tone;
  align?: "left" | "right" | "center";
  children: ReactNode;
};

const ALIGN = {
  left: "mr-auto",
  right: "ml-auto",
  center: "mx-auto text-center",
} as const;

// Um ato do filme: a seção dá o tempo de scroll, o bloco sticky segura o texto na tela.
export default function ActSection({ act, tone, align = "left", children }: Props) {
  const extra = act.id === "abertura" ? 100 : 0;
  const height = (act.end - act.start) * FILM_HEIGHT_SVH + extra;

  return (
    <section data-act={act.id} aria-label={act.label} className="relative" style={{ height: `${height}svh` }}>
      {/* Âncora a 30% da seção: um link para o ato cai onde o texto dele já está visível. */}
      <span id={act.id} aria-hidden className="absolute top-[30%]" />
      <div
        data-act-text
        className={`sticky top-[22svh] mx-auto w-full max-w-7xl px-4 sm:px-6 ${tone === "dark" ? "text-white" : "text-ink"}`}
      >
        <div className={`max-w-xl ${ALIGN[align]}`}>{children}</div>
      </div>
    </section>
  );
}
