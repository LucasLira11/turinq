import { expect, test } from "vitest";
import { contactChannels, site, siteUrl, whatsappUrl } from "./site";
import { projects } from "./projects";
import { services } from "./services";
import { ROUTES } from "./routes";

test("whatsappUrl codifica a mensagem padrão", () => {
  expect(whatsappUrl()).toBe(
    "https://wa.me/5522997793222?text=" +
      encodeURIComponent("Olá! Vim pelo site da Turinq e gostaria de conversar sobre um projeto."),
  );
  expect(whatsappUrl("Oi & tchau")).toBe("https://wa.me/5522997793222?text=Oi%20%26%20tchau");
});

test("contactChannels omite e-mail ausente", () => {
  expect(contactChannels({ ...site, email: null }).map((c) => c.kind)).toEqual(["whatsapp"]);
  expect(contactChannels({ ...site, email: "a@b.com" })[1]).toEqual({
    kind: "email",
    label: "a@b.com",
    href: "mailto:a@b.com",
  });
});

test("números confirmados, exatamente", () => {
  expect(site.stats).toEqual([
    { value: "20+", label: "Anos de mercado" },
    { value: "15+", label: "Projetos entregues" },
    { value: "98%", label: "Satisfação dos clientes" },
    { value: "5+", label: "Especialistas" },
  ]);
});

test("nenhum conteúdo exportado contém TODO ou lorem", () => {
  expect(JSON.stringify({ site, projects, services, ROUTES })).not.toMatch(/TODO|lorem/i);
});

test("siteUrl: env explícita > Vercel > localhost", () => {
  expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://turinq.com.br" })).toBe("https://turinq.com.br");
  expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "turinq.vercel.app" })).toBe("https://turinq.vercel.app");
  expect(siteUrl({})).toBe("http://localhost:3000");
});
