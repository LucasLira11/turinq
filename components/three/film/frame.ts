// Estado de todos os objetos do filme para um progresso: números de 0 a 1, contínuos.

import { clamp01, easeOutExpo, smoothstep } from "@/lib/math";

export type FilmFrame = {
  assemble: number;
  explode: number;
  sphereOpacity: number;
  wireOpacity: number;
  globeOpacity: number;
  terrainOpacity: number;
  layerSpread: number;
  panelMorph: number;
  foldBack: number;
};

const INTRO_SECONDS = 2.5;

export function introAt(seconds: number): number {
  return easeOutExpo(clamp01(seconds / INTRO_SECONDS));
}

// A montagem da esfera só toca no topo da página e sem movimento reduzido.
export function shouldPlayIntro(progress: number, reducedMotion: boolean): boolean {
  return !reducedMotion && progress < 0.03;
}

const band = (p: number, inA: number, inB: number, outA: number, outB: number) =>
  smoothstep(inA, inB, p) * (1 - smoothstep(outA, outB, p));

export function filmFrameAt(p: number, introT: number): FilmFrame {
  const foldBack = smoothstep(0.84, 0.94, p);
  return {
    // Enquanto invisível (telas), a esfera se desmonta; no fechamento volta a se montar.
    assemble: clamp01(introT) * (1 - smoothstep(0.76, 0.8, p) * (1 - foldBack)),
    // anos: a esfera se abre; fim de planeta: as facetas voltam sobre o globo
    explode: band(p, 0.04, 0.12, 0.3, 0.38),
    sphereOpacity: Math.max(1 - smoothstep(0.2, 0.28, p), foldBack),
    wireOpacity: band(p, 0.2, 0.26, 0.3, 0.36),
    globeOpacity: band(p, 0.26, 0.33, 0.48, 0.54),
    terrainOpacity: band(p, 0.45, 0.5, 0.68, 0.74),
    // as camadas se separam enquanto o painel de camadas está na tela
    layerSpread: smoothstep(0.47, 0.55, p),
    panelMorph: smoothstep(0.63, 0.73, p),
    foldBack,
  };
}
