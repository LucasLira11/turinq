import { expect, test } from "vitest";
import { ROUTES, sceneForPath, toneForPath } from "./routes";

test("cena e tom por rota", () => {
  expect(["/", "/geotecnologia", "/sindical", "/sites-e-sistemas", "/sobre", "/contato"].map(sceneForPath)).toEqual([
    "film",
    "terrain",
    "panels",
    "panels",
    "sphere",
    "sphere",
  ]);
  expect(sceneForPath("/nao-existe")).toBe("globe");
  expect(toneForPath("/geotecnologia")).toBe("dark");
  expect(toneForPath("/nao-existe")).toBe("dark");
  expect(toneForPath("/sobre")).toBe("light");
});

test("paths únicos e títulos preenchidos", () => {
  expect(new Set(ROUTES.map((r) => r.path)).size).toBe(ROUTES.length);
  ROUTES.forEach((r) => {
    expect(r.title.length).toBeGreaterThan(10);
    expect(r.description.length).toBeGreaterThan(50);
  });
});
