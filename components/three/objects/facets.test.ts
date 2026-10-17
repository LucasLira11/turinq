import { expect, test } from "vitest";
import { buildFacets, facetShade, scatterOffset } from "./facets";

const dist = (p: number[], q: number[]) => Math.hypot(...p.map((v, k) => v - q[k]));

test("contagem e gap", () => {
  expect(buildFacets(1, 0)).toHaveLength(80);
  const [f] = buildFacets(1, 0.1);
  const [g] = buildFacets(1, 0);
  expect(dist(f.a, f.centroid)).toBeLessThan(dist(g.a, g.centroid));
});

test("paleta determinística ~70/20/10", () => {
  const s = Array.from({ length: 1000 }, (_, i) => facetShade(i));
  expect(facetShade(7)).toBe(facetShade(7));
  expect(s.filter((x) => x === "brand").length).toBeGreaterThan(600);
  expect(s.filter((x) => x === "black").length).toBeLessThan(150);
});

test("scatterOffset fica entre os raios 3 e 6", () => {
  for (let i = 0; i < 80; i++) {
    const r = Math.hypot(...scatterOffset(i, 1));
    expect(r).toBeGreaterThanOrEqual(3);
    expect(r).toBeLessThanOrEqual(6);
  }
});
