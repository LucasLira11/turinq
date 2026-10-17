import { expect, test } from "vitest";
import { facetGrid } from "./facet-grid";

test("facetGrid", () => {
  const g = facetGrid(12, 7);
  expect(g).toHaveLength(168);
  expect(g[0].delay).toBe(0);
  expect(Math.max(...g.map((t) => t.delay))).toBe(1);
});

test("os triângulos cobrem a tela inteira (0–100 nos dois eixos)", () => {
  const coords = facetGrid(12, 7).flatMap((t) => t.points.split(" ").map((p) => p.split(",").map(Number)));
  expect(Math.min(...coords.map((c) => c[0]))).toBe(0);
  expect(Math.max(...coords.map((c) => c[0]))).toBe(100);
  expect(Math.min(...coords.map((c) => c[1]))).toBe(0);
  expect(Math.max(...coords.map((c) => c[1]))).toBe(100);
});
