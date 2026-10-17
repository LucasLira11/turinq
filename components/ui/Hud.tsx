"use client";

import { useFilm } from "@/components/three/film/film-store";

const coord = (v: number, neg: string, pos: string) => `${Math.abs(v).toFixed(2)}°${v < 0 ? neg : pos}`;
const altitude = (m: number) => (m >= 10_000 ? `${Math.round(m / 1000).toLocaleString("pt-BR")} km` : `${Math.round(m)} m`);

// Coordenadas da câmera durante o mergulho, como num visor de mapa. Decorativo.
export default function Hud() {
  const lat = useFilm((s) => s.camera.lat);
  const lon = useFilm((s) => s.camera.lon);
  const alt = useFilm((s) => s.camera.alt);
  return (
    <p aria-hidden className="mt-5 font-mono text-[11px] tracking-[0.14em] text-white/70 tabular-nums">
      LAT {coord(lat, "S", "N")} · LON {coord(lon, "W", "E")} · ALT {altitude(alt)}
    </p>
  );
}
