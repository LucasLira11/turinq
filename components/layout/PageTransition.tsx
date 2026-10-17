"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { TOKENS } from "@/lib/color";
import { facetGrid } from "./facet-grid";

const TRIS = facetGrid(12, 7);

let overlay: SVGSVGElement | null = null;
let covered = false;
let safety: ReturnType<typeof setTimeout> | undefined;

// Cobre a tela com as facetas antes de trocar de página. Resolve na hora se o overlay não existir.
export function cover(): Promise<void> {
  const el = overlay;
  if (!el) return Promise.resolve();
  return new Promise((resolve) => {
    el.style.visibility = "visible";
    covered = true;
    gsap.fromTo(
      el.querySelectorAll("polygon"),
      { opacity: 0, scale: 0.3 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        stagger: (i: number) => TRIS[i].delay * 0.15,
        onComplete: () => resolve(),
      },
    );
    // Se a navegação não acontecer (erro, mesma rota), a tela não fica coberta para sempre.
    clearTimeout(safety);
    safety = setTimeout(uncover, 4000);
  });
}

function uncover() {
  const el = overlay;
  clearTimeout(safety);
  if (!el || !covered) return;
  covered = false;
  gsap.to(el.querySelectorAll("polygon"), {
    opacity: 0,
    scale: 0.3,
    duration: 0.35,
    ease: "power2.in",
    stagger: (i: number) => TRIS[i].delay * 0.2,
    onComplete: () => {
      el.style.visibility = "hidden";
    },
  });
}

// Transição entre páginas como um corte de filme: triângulos cobrem a tela e se abrem na nova rota.
export default function PageTransition() {
  const pathname = usePathname();

  useEffect(() => {
    uncover();
  }, [pathname]);

  return (
    <svg
      ref={(el) => {
        overlay = el;
      }}
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      style={{ visibility: "hidden" }}
    >
      {TRIS.map((t, i) => (
        <polygon
          key={i}
          points={t.points}
          fill={i % 5 === 0 ? TOKENS.nightSurface : TOKENS.night}
          stroke={i % 5 === 0 ? TOKENS.nightSurface : TOKENS.night}
          strokeWidth={0.4}
          style={{ transformBox: "fill-box", transformOrigin: "center", opacity: 0 }}
        />
      ))}
    </svg>
  );
}
