"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { onIdle } from "@/lib/idle";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

// Scroll suave (Lenis), carregado só quando o navegador fica ocioso. Lenis rola a própria
// janela, então os listeners nativos de scroll (o filme, o Reveal) continuam funcionando.
export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (reduced || prefersReducedMotion()) {
      document.documentElement.dataset.motion = "reduce";
      return;
    }
    delete document.documentElement.dataset.motion;
    let cancelled = false;
    let instance: Lenis | null = null;
    const cancelIdle = onIdle(() => {
      import("lenis").then(({ default: LenisClass }) => {
        if (cancelled) return;
        instance = new LenisClass({ autoRaf: true });
        lenis = instance;
      });
    }, 2500);
    return () => {
      cancelled = true;
      cancelIdle();
      instance?.destroy();
      lenis = null;
    };
  }, [reduced]);

  // Só em navegação: no primeiro carregamento o navegador restaura a posição do scroll.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
