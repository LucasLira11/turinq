"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "@/lib/store";

export type LayerId = "relevo" | "hidrografia" | "lotes" | "pontos";

export type FilmState = {
  progress: number;
  introDone: boolean;
  pointer: { x: number; y: number };
  layers: Record<LayerId, boolean>;
  camera: { lat: number; lon: number; alt: number };
};

const initial = (): FilmState => ({
  progress: 0,
  introDone: false,
  pointer: { x: 0, y: 0 },
  layers: { relevo: true, hidrografia: true, lotes: true, pontos: true },
  camera: { lat: 0, lon: 0, alt: 0 },
});

export const film = createStore<FilmState>(initial());

export function resetFilm(): void {
  film.set(initial());
}

// O seletor deve devolver um valor primitivo ou estável; um objeto novo a cada chamada re-renderiza sem parar.
export function useFilm<S>(selector: (s: FilmState) => S): S {
  return useSyncExternalStore(
    film.subscribe,
    () => selector(film.get()),
    () => selector(initial()),
  );
}

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  (window as unknown as { __turinqFilm: typeof film }).__turinqFilm = film;
}
