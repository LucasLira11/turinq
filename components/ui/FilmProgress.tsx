"use client";

import { getLenis } from "@/components/layout/SmoothScroll";
import { useFilm } from "@/components/three/film/film-store";
import { ACTS, actAt, timecodeAt, type ActId } from "@/components/three/film/timeline";

const CHAPTERS = ACTS.filter((a) => a.id !== "abertura");

function goTo(id: ActId) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView();
}

// Barra estilo player de vídeo: timecode, capítulos e progresso do plano-sequência.
export default function FilmProgress() {
  const timecode = useFilm((s) => timecodeAt(s.progress));
  const current = useFilm((s) => actAt(s.progress).id);
  const fill = useFilm((s) => Math.round(s.progress * 400) / 400);

  return (
    <>
      <nav
        aria-label="Capítulos"
        className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 items-stretch gap-4 text-ink xl:flex tone-dark:text-white"
      >
        <ol className="flex flex-col justify-between gap-5 py-1 text-right">
          {CHAPTERS.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => goTo(a.id)}
                aria-current={current === a.id ? "step" : undefined}
                className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-55 transition-opacity hover:opacity-100 aria-[current=step]:opacity-100"
              >
                {a.label}
              </button>
            </li>
          ))}
        </ol>
        <div className="relative w-px bg-current/20">
          <div className="absolute inset-x-0 top-0 bg-current" style={{ height: `${fill * 100}%` }} />
        </div>
        <p className="absolute -bottom-9 right-0 font-mono text-[11px] tabular-nums opacity-80">{timecode}</p>
      </nav>

      <p
        aria-hidden
        className="fixed bottom-4 left-4 z-30 rounded-full bg-paper/70 px-3 py-1.5 font-mono text-[11px] text-ink tabular-nums backdrop-blur xl:hidden tone-dark:bg-night/60 tone-dark:text-white"
      >
        {timecode} · {ACTS.find((a) => a.id === current)?.label}
      </p>
    </>
  );
}
