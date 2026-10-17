"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setBackdropColor } from "@/components/layout/Backdrop";
import { getLenis } from "@/components/layout/SmoothScroll";
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
    // A partir daqui o filme controla fundo e tom; o script de antes da hidratação para (ToneScript).
    (window as unknown as { __turinqFilmReady?: boolean }).__turinqFilmReady = true;
    const snap = reduced || prefersReducedMotion();
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-act]"));
    const texts = sections.map((s) => s.querySelector<HTMLElement>("[data-act-text]"));
    let boxes: SectionBox[] = [];
    let exits: number[] = [];

    const measure = () => {
      // A última seção desconta uma tela de altura fixa (100svh), não a janela atual: a barra de
      // endereço do celular aparecendo ou sumindo não pode mover o fim do filme.
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;top:0;width:0;height:100svh;visibility:hidden";
      document.body.append(probe);
      const screen = probe.offsetHeight || window.innerHeight;
      probe.remove();
      boxes = sections.map((el, i) => ({
        id: el.dataset.act as ActId,
        top: el.getBoundingClientRect().top + window.scrollY,
        length: Math.max(1, el.offsetHeight - (i === sections.length - 1 ? screen : 0)),
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
    // Foco do teclado num ato fora da janela de leitura: rola até o meio da janela, para o fundo
    // e o tom acompanharem o texto (senão o texto focado fica sobre o fundo do ato vizinho).
    const onFocus = (e: FocusEvent) => {
      const section = (e.target as Element).closest<HTMLElement>("[data-act]");
      const i = section ? sections.indexOf(section) : -1;
      const b = boxes[i];
      if (!b || b.id === "abertura") return;
      if (textOpacity(b.id, clamp01((window.scrollY - b.top) / b.length), exits[i]) >= 0.99) return;
      const end = Math.min(0.9, exits[i]);
      const from = Math.min(0.2, Math.max(0, end - 0.15));
      const to = Math.max(from, end - 0.1);
      const target = b.top + b.length * ((from + to) / 2);
      requestAnimationFrame(() => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(target, { immediate: true });
        else window.scrollTo(0, target);
      });
    };

    // Alturas mudam quando as fontes e o layout terminam de carregar: remede ao mudar o tamanho do
    // filme ou de qualquer bloco de texto.
    const resize = new ResizeObserver(onLayout);
    resize.observe(root);
    texts.forEach((t) => t && resize.observe(t));
    root.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayout);
    onLayout();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      root.removeEventListener("focusin", onFocus);
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
