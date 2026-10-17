"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { toneForPath } from "@/content/routes";
import { TOKENS } from "@/lib/color";

let backdrop: HTMLDivElement | null = null;

// Escrita direta no DOM: o filme da home chama isto a cada quadro de scroll.
export function setBackdropColor(hex: string): void {
  if (backdrop) backdrop.style.backgroundColor = hex;
}

export default function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    backdrop = ref.current;
    return () => {
      backdrop = null;
    };
  }, []);

  useEffect(() => {
    // A home começa prateada; dali em diante o filme assume a cor.
    if (pathname === "/") {
      setBackdropColor(TOKENS.silver100);
      document.documentElement.dataset.tone = "light";
      return;
    }
    const tone = toneForPath(pathname);
    setBackdropColor(tone === "dark" ? TOKENS.night : TOKENS.paper);
    document.documentElement.dataset.tone = tone;
  }, [pathname]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: pathname === "/" ? TOKENS.silver100 : TOKENS.paper }}
    />
  );
}
