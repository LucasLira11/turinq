"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setBackdropColor } from "@/components/layout/Backdrop";
import { resetFilm, setProgress } from "@/components/three/film/film-store";
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
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

// Liga o scroll da home ao filme: progresso global, cor de fundo, tom e opacidade do texto de cada ato.
// Listener nativo (sem biblioteca): o cálculo todo está nas funções puras da timeline.
export default function FilmScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const snap = reduced || prefersReducedMotion();
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
      const shown = snap ? snapProgress(p) : p;
      setProgress(shown);
      setBackdropColor(backgroundAt(shown));
      document.documentElement.dataset.tone = toneAt(shown);
      boxes.forEach((b, i) => {
        const text = texts[i];
        if (text) text.style.opacity = String(textOpacity(b.id, clamp01((y - b.top) / b.length), exits[i]));
      });
    };

    let frame = 0;
    const onScroll = () => {
      frame ||= requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    const onLayout = () => {
      measure();
      update();
    };
    // Fontes e imagens que terminam de carregar mudam alturas: remede quando o filme muda de tamanho.
    const resize = new ResizeObserver(onLayout);
    resize.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayout);
    onLayout();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onLayout);
    };
  }, [reduced]);

  useEffect(() => () => resetFilm(), []);

  return (
    <div ref={ref} id="film" className="relative">
      {children}
    </div>
  );
}
