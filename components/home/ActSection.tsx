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
    <section
      id={act.id}
      data-act={act.id}
      aria-label={act.label}
      className="relative scroll-mt-0"
      style={{ height: `${height}svh` }}
    >
      <div
        data-act-text
        className={`sticky top-[28svh] mx-auto w-full max-w-7xl px-4 sm:px-6 ${tone === "dark" ? "text-white" : "text-ink"}`}
      >
        <div className={`max-w-xl ${ALIGN[align]}`}>{children}</div>
      </div>
    </section>
  );
}
