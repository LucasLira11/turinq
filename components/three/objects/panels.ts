// Painéis de telas do ato 4: nascem das camadas GIS empilhadas e se abrem num arco voltado
// para a câmera; no fechamento se dobram até sumir no centro.

type V3 = [number, number, number];
export type ScreenKind = "site" | "portal" | "erp" | "app";
export type PanelPose = { position: V3; rotation: V3; scale: number };

export const SCREEN_ORDER: ScreenKind[] = ["site", "portal", "erp", "app"];
// Distância vertical entre as camadas GIS empilhadas (e entre os painéis antes de se abrirem).
export const LAYER_GAP = 0.35;

const ARC_RADIUS = 3;
const ARC_SPREAD = (72 * Math.PI) / 180;
const ARC_Y = 0.6;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function panelPose(i: number, n: number, morph: number, fold: number): PanelPose {
  const theta = n > 1 ? -ARC_SPREAD / 2 + (ARC_SPREAD * i) / (n - 1) : 0;
  const stacked: V3 = [0, i * LAYER_GAP, 0];
  const arc: V3 = [ARC_RADIUS * Math.sin(theta), ARC_Y, ARC_RADIUS * Math.cos(theta)];
  const open: V3 = [mix(stacked[0], arc[0], morph), mix(stacked[1], arc[1], morph), mix(stacked[2], arc[2], morph)];
  return {
    position: [open[0] * (1 - fold), open[1] * (1 - fold), open[2] * (1 - fold)],
    rotation: [mix(-Math.PI / 2, 0, morph), theta * morph, 0],
    scale: 1 - fold,
  };
}
