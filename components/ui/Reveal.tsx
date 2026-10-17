"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { onIdle } from "@/lib/idle";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

type Props = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
};

// Revela o texto linha a linha, cada linha subindo por trás de uma máscara. O GSAP só é baixado
// quando o navegador fica ocioso; texto que já está na tela nessa hora não é escondido de novo.
export default function Reveal({ as: Tag = "div", delay = 0, className, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || prefersReducedMotion()) return;
    let cancelled = false;
    let revert = () => {};

    const cancelIdle = onIdle(() => {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(
        ([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
          if (cancelled || el.getBoundingClientRect().top < window.innerHeight) return;
          gsap.registerPlugin(ScrollTrigger, SplitText);
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
          revert = () => split.revert();
        },
      );
    }, 3000);

    return () => {
      cancelled = true;
      cancelIdle();
      revert();
    };
  }, [reduced, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
