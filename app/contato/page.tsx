import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { metadataFor } from "@/content/metadata";
import { routeFor } from "@/content/routes";
import { contactChannels, site } from "@/content/site";

const route = routeFor("/contato")!;

export const metadata: Metadata = metadataFor("/contato");

const DESCRIPTIONS = {
  whatsapp: "Resposta mais rápida. A mensagem já vai pronta, é só contar o seu projeto.",
  email: "Para mandar arquivos, briefings e detalhes com calma.",
} as const;

export default function ContatoPage() {
  return (
    <>
      <PageHero eyebrow="Contato" title="Vamos conversar." lead={route.description} tone="light" />
      <div className="relative bg-paper text-ink">
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-24 sm:px-6 md:grid-cols-2">
          {contactChannels(site).map((c) => (
            <a
              key={c.kind}
              href={c.href}
              target={c.kind === "whatsapp" ? "_blank" : undefined}
              rel={c.kind === "whatsapp" ? "noopener noreferrer" : undefined}
              className="group rounded-3xl border border-ink/10 p-10 transition-colors hover:border-brand"
            >
              <p className="font-mono text-xs tracking-[0.24em] text-steel uppercase">{c.kind === "whatsapp" ? "WhatsApp" : "E-mail"}</p>
              <p className="mt-6 font-display text-2xl font-semibold sm:text-3xl">
                {c.kind === "whatsapp" ? "(22) 99779-3222" : c.label}
              </p>
              <p className="mt-4 leading-relaxed text-ink/75">{DESCRIPTIONS[c.kind]}</p>
              <span className="mt-8 inline-block font-bold text-brand group-hover:underline">Abrir conversa →</span>
            </a>
          ))}
          {site.address && (
            <div className="rounded-3xl border border-ink/10 p-10">
              <p className="font-mono text-xs tracking-[0.24em] text-steel uppercase">Endereço</p>
              <p className="mt-6 text-lg">{site.address}</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
