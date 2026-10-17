import { expect, test } from "vitest";
import { film, resetFilm, toggleLayer } from "./film-store";

test("toggleLayer alterna só a camada pedida", () => {
  resetFilm();
  toggleLayer("lotes");
  expect(film.get().layers).toEqual({ relevo: true, hidrografia: true, lotes: false, pontos: true });
  toggleLayer("lotes");
  expect(film.get().layers.lotes).toBe(true);
});
