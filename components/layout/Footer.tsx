import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/content/routes";
import { contactChannels, site } from "@/content/site";

export default function Footer() {
  const channels = contactChannels(site);

  return (
    <footer className="relative z-10 bg-night text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          {/* Provisório até o logo vetorizado (Task 4). */}
          <Image src="/logo-turinq-branca.png" alt="Turinq" width={180} height={120} className="h-auto w-44" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
            Sites, sistemas e geotecnologia há mais de 20 anos.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="font-mono text-xs tracking-[0.2em] text-brand-light uppercase">Navegação</h2>
          <ul className="mt-5 space-y-3">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <Link href={r.path} className="text-sm text-white/75 transition-colors hover:text-white">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-brand-light uppercase">Contato</h2>
          <ul className="mt-5 space-y-3">
            {channels.map((c) => (
              <li key={c.kind}>
                <a
                  href={c.href}
                  target={c.kind === "whatsapp" ? "_blank" : undefined}
                  rel={c.kind === "whatsapp" ? "noopener noreferrer" : undefined}
                  className="text-sm text-white/75 transition-colors hover:text-white"
                >
                  {c.label}
                </a>
              </li>
            ))}
            {site.address && <li className="text-sm text-white/60">{site.address}</li>}
            {site.social.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-white/75 hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-white/50 sm:px-6">
          © {new Date().getFullYear()} Turinq — Tecnologia e Desenvolvimento
        </p>
      </div>
    </footer>
  );
}
