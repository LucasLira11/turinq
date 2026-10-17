import { expect, test } from "vitest";
import { filmFrameAt, introAt, shouldPlayIntro } from "./frame";

const keys = [
  "assemble",
  "explode",
  "sphereOpacity",
  "wireOpacity",
  "globeOpacity",
  "terrainOpacity",
  "layerSpread",
  "panelMorph",
  "foldBack",
] as const;

test("valores em [0,1] e contínuos", () => {
  for (let p = 0; p < 1; p += 0.001) {
    const a = filmFrameAt(p, 1);
    const b = filmFrameAt(p + 0.001, 1);
    keys.forEach((k) => {
      expect(a[k]).toBeGreaterThanOrEqual(0);
      expect(a[k]).toBeLessThanOrEqual(1);
      expect(Math.abs(a[k] - b[k])).toBeLessThan(0.05);
    });
  }
});

test("marcos dos atos", () => {
  expect(filmFrameAt(0, 0).assemble).toBe(0);
  expect(filmFrameAt(0, 1)).toMatchObject({ assemble: 1, explode: 0, sphereOpacity: 1 });
  expect(filmFrameAt(0.15, 1).explode).toBeGreaterThan(0.5);
  expect(filmFrameAt(0.35, 1).globeOpacity).toBe(1);
  expect(filmFrameAt(0.55, 1).terrainOpacity).toBe(1);
  expect(filmFrameAt(0.75, 1).panelMorph).toBe(1);
  expect(filmFrameAt(1, 1)).toMatchObject({ foldBack: 1, sphereOpacity: 1 });
});

test("no fechamento a esfera se remonta enquanto os painéis se dobram", () => {
  expect(filmFrameAt(0.82, 1).assemble).toBe(0);
  expect(filmFrameAt(0.89, 1).assemble).toBeGreaterThan(0);
  expect(filmFrameAt(0.89, 1).assemble).toBeLessThan(1);
  expect(filmFrameAt(1, 1).assemble).toBe(1);
});

test("intro só no topo e sem reduced motion", () => {
  expect(shouldPlayIntro(0, false)).toBe(true);
  expect(shouldPlayIntro(0.5, false)).toBe(false);
  expect(shouldPlayIntro(0, true)).toBe(false);
  expect(introAt(0)).toBe(0);
  expect(introAt(2.5)).toBe(1);
});
