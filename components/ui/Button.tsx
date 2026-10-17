import Link from "@/components/layout/TransitionLink";
import type { ReactNode } from "react";
import type { Tone } from "@/content/routes";

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: "solid" | "ghost";
  tone?: Tone;
  className?: string;
};

const STYLES = {
  solid: {
    light: "bg-ink text-white hover:bg-brand",
    dark: "bg-white text-night hover:bg-gis",
  },
  ghost: {
    light: "border border-ink/20 text-ink hover:border-ink/60",
    dark: "border border-white/25 text-white hover:border-white/70",
  },
} as const;

export default function Button({ href, children, external, variant = "solid", tone = "light", className = "" }: Props) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold tracking-wide transition-colors duration-300 ${STYLES[variant][tone]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
