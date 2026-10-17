import { expect, test } from "vitest";
import { film, resetFilm, setProgress, toggleLayer } from "./film-store";

test("setProgress guarda o máximo alcançado (para montar cenas uma vez só)", () => {
  resetFilm();
  setProgress(0.5);
  setProgress(0.2);
  expect(film.get().progress).toBe(0.2);
  expect(film.get().maxProgress).toBe(0.5);
  resetFilm();
  expect(film.get().maxProgress).toBe(0);
});

test("toggleLayer alterna só a camada pedida", () => {
  resetFilm();
  toggleLayer("lotes");
  expect(film.get().layers).toEqual({ relevo: true, hidrografia: true, lotes: false, pontos: true });
  toggleLayer("lotes");
  expect(film.get().layers.lotes).toBe(true);
});
