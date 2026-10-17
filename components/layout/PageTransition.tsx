"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TOKENS } from "@/lib/color";
import { facetGrid } from "./facet-grid";

const TRIS = facetGrid(12, 7);

let overlay: SVGSVGElement | null = null;
let covered = false;
let safety: ReturnType<typeof setTimeout> | undefined;

// Anima todos os triângulos (Web Animations, sem biblioteca) e resolve quando o último termina.
function animateAll(from: Keyframe, to: Keyframe, duration: number, stagger: number, easing: string) {
  const polys = overlay ? Array.from(overlay.querySelectorAll("polygon")) : [];
  const animations = polys.map((p, i) =>
    p.animate([from, to], { duration, delay: TRIS[i].delay * stagger, easing, fill: "forwards" }),
  );
  return Promise.all(animations.map((a) => a.finished)).then(() => undefined);
}

// Cobre a tela com as facetas antes de trocar de página. Resolve na hora se o overlay não existir.
export function cover(): Promise<void> {
  if (!overlay) return Promise.resolve();
  overlay.style.visibility = "visible";
  covered = true;
  // Se a navegação não acontecer (erro, mesma rota), a tela não fica coberta para sempre.
  clearTimeout(safety);
  safety = setTimeout(uncover, 4000);
  return animateAll(
    { opacity: 0, transform: "scale(0.3)" },
    { opacity: 1, transform: "scale(1)" },
    300,
    150,
    "cubic-bezier(0.33, 1, 0.68, 1)",
  );
}

function uncover() {
  clearTimeout(safety);
  if (!overlay || !covered) return;
  covered = false;
  const el = overlay;
  animateAll(
    { opacity: 1, transform: "scale(1)" },
    { opacity: 0, transform: "scale(0.3)" },
    350,
    200,
    "cubic-bezier(0.32, 0, 0.67, 0)",
  ).then(() => {
    if (!covered) el.style.visibility = "hidden";
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
