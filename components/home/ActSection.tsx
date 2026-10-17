import type { ReactNode } from "react";
import type { Tone } from "@/content/routes";
import { FILM_HEIGHT_SVH, type Act } from "@/components/three/film/timeline";

type Props = {
  act: Act;
  tone: Tone;
  align?: "left" | "right" | "center";
  // Fundo escuro translúcido atrás do texto, para cenas 3D muito detalhadas atrás dele.
  scrim?: boolean;
  children: ReactNode;
};

const ALIGN = {
  left: "mr-auto",
  right: "ml-auto",
  center: "mx-auto text-center",
} as const;

// Cartão translúcido atrás do texto. No celular o 3D fica atrás do texto (não cabe ao lado),
// então todo ato ganha o cartão abaixo de `sm`.
const SCRIM_ALWAYS = "rounded-3xl bg-night/55 p-6 backdrop-blur-[3px] sm:p-8";
const SCRIM_MOBILE_DARK = "max-sm:rounded-3xl max-sm:bg-night/55 max-sm:p-5 max-sm:backdrop-blur-[3px]";
const SCRIM_MOBILE_LIGHT = "max-sm:rounded-3xl max-sm:bg-paper/75 max-sm:p-5 max-sm:backdrop-blur-[3px]";

// Um ato do filme: a seção dá o tempo de scroll, o bloco sticky segura o texto na tela.
export default function ActSection({ act, tone, align = "left", scrim = false, children }: Props) {
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
        <div className={`max-w-xl ${ALIGN[align]} ${scrim ? SCRIM_ALWAYS : tone === "dark" ? SCRIM_MOBILE_DARK : SCRIM_MOBILE_LIGHT}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
