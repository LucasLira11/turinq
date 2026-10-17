"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { WORDMARK } from "./wordmark-data";

gsap.registerPlugin(useGSAP);

const last = WORDMARK.letters[WORDMARK.letters.length - 1];
const TOTAL_WIDTH = last.x + last.width;

type Props = {
  animate?: boolean;
  // Com `animate`, o wordmark fica escondido até `play` virar true e então se desdobra.
  play?: boolean;
  tagline?: boolean;
  onDone?: () => void;
  className?: string;
};

// "turinq" com as formas exatas do logo oficial. Cada letra é um <svg> próprio para
// poder dobrar em 3D (rotateX) como papel se desdobrando.
export default function Wordmark({ animate = false, play = true, tagline = false, onDone, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const waiting = animate && !play;

  useGSAP(
    () => {
      if (!animate || !play) return;
      if (reduced) {
        onDone?.();
        return;
      }
      const tl = gsap.timeline({ onComplete: onDone });
      tl.from("[data-letter]", {
        rotateX: -90,
        filter: "brightness(0.45)",
        transformOrigin: "50% 0%",
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
      });
      if (tagline) tl.from("[data-tagline]", { opacity: 0, y: 8, duration: 0.8, ease: "expo.out" }, "-=0.4");
    },
    { scope: ref, dependencies: [animate, play, reduced] },
  );

  return (
    <div ref={ref} className={className} style={waiting ? { visibility: "hidden" } : undefined}>
      <div
        role="img"
        aria-label="turinq"
        className="relative w-full [perspective:800px]"
        style={{ aspectRatio: `${TOTAL_WIDTH} / ${WORDMARK.height}` }}
      >
        {WORDMARK.letters.map((l) => (
          <svg
            key={l.char}
            data-letter
            aria-hidden
            viewBox={`0 0 ${l.width} ${WORDMARK.height}`}
            className="absolute top-0 h-full"
            style={{ left: `${(l.x / TOTAL_WIDTH) * 100}%`, width: `${(l.width / TOTAL_WIDTH) * 100}%` }}
          >
            <path d={l.d} fill="currentColor" fillRule={WORDMARK.fillRule} />
          </svg>
        ))}
      </div>
      {tagline && (
        <p data-tagline className="mt-[0.9em] text-[0.62em] font-bold tracking-[0.32em] whitespace-nowrap uppercase">
          Tecnologia e Desenvolvimento
        </p>
      )}
    </div>
  );
}
