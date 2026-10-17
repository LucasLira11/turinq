"use client";

import { useSyncExternalStore } from "react";
import { createStore } from "@/lib/store";

// Coordenada sorteada pela cena do globo na 404, mostrada também no texto da página.
export const lostPin = createStore<{ pin: [number, number] | null }>({ pin: null });

export function useLostPin(): [number, number] | null {
  return useSyncExternalStore(
    lostPin.subscribe,
    () => lostPin.get().pin,
    () => null,
  );
}
