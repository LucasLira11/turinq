"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toneForPath } from "@/content/routes";
import { TOKENS } from "@/lib/color";

// Escrita direta no DOM: o filme da home chama isto a cada quadro de scroll. Busca o elemento
// pelo atributo porque o filme pode chamar antes de os efeitos do Backdrop rodarem.
export function setBackdropColor(hex: string): void {
  const el = document.querySelector<HTMLDivElement>("[data-backdrop]");
  if (el) el.style.backgroundColor = hex;
}

export default function Backdrop() {
  const pathname = usePathname();

  useEffect(() => {
    // Na home quem manda é o filme (FilmScroll), inclusive ao recarregar no meio do scroll.
    if (pathname === "/") return;
    const tone = toneForPath(pathname);
    setBackdropColor(tone === "dark" ? TOKENS.night : TOKENS.paper);
    document.documentElement.dataset.tone = tone;
  }, [pathname]);

  return (
    <div
      data-backdrop
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: pathname === "/" ? TOKENS.silver100 : TOKENS.paper }}
    />
  );
}
