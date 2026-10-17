"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Props = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
};

// Revela o texto linha a linha, cada linha subindo por trás de uma máscara.
export default function Reveal({ as: Tag = "div", delay = 0, className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      // Lê a preferência direto: na hidratação o hook ainda devolve o valor do servidor (false).
      if (reduced || prefersReducedMotion() || !ref.current) return;
      const el = ref.current;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
            delay,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, delay] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
