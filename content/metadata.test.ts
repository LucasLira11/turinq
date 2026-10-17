import { expect, test } from "vitest";
import { metadataFor } from "./metadata";
import { routeFor } from "./routes";

test("metadata por página leva título e descrição também para o Open Graph, com canonical", () => {
  const route = routeFor("/sobre")!;
  const m = metadataFor("/sobre");
  expect(m.title).toBe(route.title);
  expect(m.description).toBe(route.description);
  expect(m.openGraph).toMatchObject({ title: route.title, description: route.description, url: "/sobre" });
  expect(m.alternates).toEqual({ canonical: "/sobre" });
});
