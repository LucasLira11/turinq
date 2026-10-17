"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/use-reduced-motion";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __ScrollTrigger: typeof ScrollTrigger }).__ScrollTrigger = ScrollTrigger;
    }
    // A barra de endereço do celular muda a altura da janela; não recalcular o filme por isso.
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (reduced) return;

    const instance = new Lenis({ autoRaf: false });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, [reduced]);

  // Só em navegação: no primeiro carregamento o navegador restaura a posição do scroll.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
