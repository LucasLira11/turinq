"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cover } from "./PageTransition";

type Props = ComponentProps<typeof Link> & { href: string };

// Link interno que passa pela transição de facetas. Âncoras, mesma rota, teclas modificadoras
// (abrir em nova aba) e movimento reduzido seguem o comportamento normal do <Link>.
export default function TransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <Link
      href={href}
      {...rest}
      onClick={async (e) => {
        onClick?.(e);
        if (e.defaultPrevented || reduced) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (!href.startsWith("/") || href.includes("#") || href === pathname) return;
        e.preventDefault();
        await cover();
        router.push(href);
      }}
    />
  );
}
