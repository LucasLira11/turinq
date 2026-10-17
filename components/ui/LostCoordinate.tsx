"use client";

import { useLostPin } from "@/components/three/scenes/lost-pin";

const coord = (v: number, neg: string, pos: string) => `${Math.abs(v).toFixed(2)}°${v < 0 ? neg : pos}`;

// Mostra a coordenada que o globo da 404 marcou (só aparece quando o 3D está ativo).
export default function LostCoordinate() {
  const pin = useLostPin();
  if (!pin) return null;
  return (
    <p className="mt-3 font-mono text-xs tracking-[0.14em] text-white/70 tabular-nums">
      {coord(pin[0], "S", "N")} · {coord(pin[1], "W", "E")}
    </p>
  );
}
