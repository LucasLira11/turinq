"use client";

import { toggleLayer, useFilm, type LayerId } from "@/components/three/film/film-store";

const LAYERS: { id: LayerId; label: string }[] = [
  { id: "relevo", label: "Relevo" },
  { id: "hidrografia", label: "Hidrografia" },
  { id: "lotes", label: "Lotes" },
  { id: "pontos", label: "Pontos de interesse" },
];

function LayerToggle({ id, label }: { id: LayerId; label: string }) {
  const on = useFilm((s) => s.layers[id]);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => toggleLayer(id)}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-white/85 transition-colors hover:bg-white/5"
    >
      <span
        aria-hidden
        className={`size-3.5 shrink-0 rounded-[3px] border transition-colors ${on ? "border-gis bg-gis" : "border-white/40"}`}
      />
      {label}
    </button>
  );
}

// Painel de camadas como num SIG: liga e desliga cada camada do mapa 3D ao vivo.
export default function LayerPanel() {
  return (
    <div role="group" aria-label="Camadas do mapa" className="mt-8 max-w-xs rounded-2xl border border-white/15 bg-night/60 p-3 backdrop-blur">
      <p className="px-2 pb-1 font-mono text-[11px] tracking-[0.2em] text-gis uppercase">Camadas</p>
      <ul>
        {LAYERS.map((l) => (
          <li key={l.id}>
            <LayerToggle {...l} />
          </li>
        ))}
      </ul>
    </div>
  );
}
