"use client";

import Link from "next/link";
import Monogram from "@/components/brand/Monogram";
import Wordmark from "@/components/brand/Wordmark";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/content/routes";
import { whatsappUrl } from "@/content/site";

const NAV = ROUTES.filter((r) => r.inNav);

export default function Header() {
  const pathname = usePathname();
  // Guarda a rota em que o menu foi aberto: navegar fecha o menu sem efeito extra.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-ink/10 bg-paper/70 pr-2 pl-5 text-ink backdrop-blur-xl transition-colors duration-500 tone-dark:border-white/10 tone-dark:bg-night/60 tone-dark:text-white">
        <Link
          href="/"
          aria-label="Turinq — início"
          className="flex items-center gap-2.5 text-brand transition-colors tone-dark:text-white"
        >
          <Monogram className="h-7 w-7" />
          <Wordmark className="w-[74px]" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {NAV.map((r) => (
            <Link
              key={r.path}
              href={r.path}
              aria-current={pathname === r.path ? "page" : undefined}
              className="text-[13px] font-semibold tracking-wide opacity-70 transition-opacity hover:opacity-100 aria-[current=page]:opacity-100"
            >
              {r.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand tone-dark:bg-white tone-dark:text-night tone-dark:hover:bg-gis"
          >
            Fale conosco
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpenOn(open ? null : pathname)}
            className="rounded-full px-3 py-2.5 text-[13px] font-bold md:hidden"
          >
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="mx-auto mt-2 flex max-w-7xl flex-col rounded-3xl border border-ink/10 bg-paper/95 p-3 text-ink backdrop-blur-xl md:hidden tone-dark:border-white/10 tone-dark:bg-night/95 tone-dark:text-white"
        >
          {NAV.map((r) => (
            <Link
              key={r.path}
              href={r.path}
              aria-current={pathname === r.path ? "page" : undefined}
              className="rounded-2xl px-4 py-3 font-display text-lg aria-[current=page]:bg-ink/5 tone-dark:aria-[current=page]:bg-white/10"
            >
              {r.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
