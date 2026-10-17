"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { setBackdropColor } from "@/components/layout/Backdrop";
import { film, resetFilm } from "@/components/three/film/film-store";
import {
  backgroundAt,
  progressAt,
  snapProgress,
  textOpacity,
  toneAt,
  type ActId,
  type SectionBox,
} from "@/components/three/film/timeline";
import { clamp01 } from "@/lib/math";
import { useReducedMotion } from "@/lib/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Liga o scroll da home ao filme: progresso global, cor de fundo, tom e opacidade do texto de cada ato.
export default function FilmScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-act]"));
      const texts = sections.map((s) => s.querySelector<HTMLElement>("[data-act-text]"));
      let boxes: SectionBox[] = [];
      let exits: number[] = [];

      const measure = () => {
        boxes = sections.map((el, i) => ({
          id: el.dataset.act as ActId,
          top: el.getBoundingClientRect().top + window.scrollY,
          length: Math.max(1, el.offsetHeight - (i === sections.length - 1 ? window.innerHeight : 0)),
        }));
        // Progresso local em que o sticky começa a empurrar o texto para fora da tela.
        exits = sections.map((el, i) => {
          const text = texts[i];
          if (!text) return 0.9;
          const stickyTop = parseFloat(getComputedStyle(text).top) || 0;
          return (el.offsetHeight - stickyTop - text.offsetHeight) / boxes[i].length;
        });
      };

      const update = () => {
        const y = window.scrollY;
        const p = progressAt(y, boxes);
        const shown = reduced ? snapProgress(p) : p;
        film.set({ progress: shown });
        setBackdropColor(backgroundAt(shown));
        document.documentElement.dataset.tone = toneAt(shown);
        boxes.forEach((b, i) => {
          const text = texts[i];
          if (text) text.style.opacity = String(textOpacity(b.id, clamp01((y - b.top) / b.length), exits[i]));
        });
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: update,
        onRefresh: () => {
          measure();
          update();
        },
      });
      measure();
      update();
    },
    { scope: ref, dependencies: [reduced] },
  );

  useEffect(() => () => resetFilm(), []);

  return (
    <div ref={ref} id="film" className="relative">
      {children}
    </div>
  );
}
