import { expect, test } from "vitest";
import { ROUTES } from "@/content/routes";
import sitemap from "./sitemap";

test("sitemap cobre todas as rotas, com URL absoluta", () => {
  const entries = sitemap();
  expect(entries.map((e) => new URL(e.url).pathname).sort()).toEqual(ROUTES.map((r) => r.path).sort());
});
