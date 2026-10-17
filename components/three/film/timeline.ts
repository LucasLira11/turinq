// Linha do tempo do plano-sequência da home: cada ato ocupa um trecho do progresso (0–1).

import type { Tone } from "@/content/routes";
import { lerpHex, relativeLuminance, TOKENS } from "@/lib/color";
import { clamp01, smoothstep } from "@/lib/math";

export type ActId = "abertura" | "anos" | "planeta" | "territorio" | "telas" | "fechamento";
export type Act = { id: ActId; label: string; start: number; end: number };

export const ACTS: readonly Act[] = [
  { id: "abertura", label: "Abertura", start: 0, end: 0.03 },
  { id: "anos", label: "20+ anos", start: 0.03, end: 0.2 },
  { id: "planeta", label: "Planeta", start: 0.2, end: 0.4 },
  { id: "territorio", label: "Território", start: 0.4, end: 0.62 },
  { id: "telas", label: "Telas", start: 0.62, end: 0.82 },
  { id: "fechamento", label: "Fechamento", start: 0.82, end: 1 },
];

// Altura total de scroll do filme, em svh; cada ato recebe a sua fração.
export const FILM_HEIGHT_SVH = 700;

const ACT_BY_ID = Object.fromEntries(ACTS.map((a) => [a.id, a])) as Record<ActId, Act>;

export function actAt(p: number): Act {
  return ACTS.find((a) => p >= a.start && p < a.end) ?? ACTS[ACTS.length - 1];
}

export function localProgress(p: number, id: ActId): number {
  const a = ACT_BY_ID[id];
  return clamp01((p - a.start) / (a.end - a.start));
}

// As transições de fundo ficam entre as janelas de texto dos atos (20–80% de cada um),
// para o texto nunca cair sobre um cinza intermediário.
const BACKGROUND_KEYS: [number, string][] = [
  [0, TOKENS.silver100],
  [0.17, TOKENS.silver100],
  [0.215, TOKENS.night],
  [0.62, TOKENS.night],
  [0.655, TOKENS.paper],
  [1, TOKENS.paper],
];

export function backgroundAt(p: number): string {
  const x = clamp01(p);
  for (let i = 1; i < BACKGROUND_KEYS.length; i++) {
    const [p1, c1] = BACKGROUND_KEYS[i];
    if (x <= p1) {
      const [p0, c0] = BACKGROUND_KEYS[i - 1];
      return lerpHex(c0, c1, p1 === p0 ? 1 : (x - p0) / (p1 - p0));
    }
  }
  return BACKGROUND_KEYS[BACKGROUND_KEYS.length - 1][1];
}

export function toneAt(p: number): Tone {
  return relativeLuminance(backgroundAt(p)) > 0.205 ? "light" : "dark";
}

export function textColorFor(tone: Tone): string {
  return tone === "light" ? TOKENS.ink : "#FFFFFF";
}

export function timecodeAt(p: number, totalSec = 90): string {
  const s = Math.floor(clamp01(p) * totalSec);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function snapProgress(p: number): number {
  const a = actAt(p);
  return (a.start + a.end) / 2;
}

// Posição de cada seção de ato na página (px). `length` é quanto se rola dentro dela:
// a última desconta uma tela, porque o filme termina quando o fim dela chega ao rodapé da janela.
export type SectionBox = { id: ActId; top: number; length: number };

// O topo de cada seção corresponde ao início do seu ato, qualquer que seja a altura dela.
export function progressAt(scrollY: number, boxes: SectionBox[]): number {
  if (!boxes.length || scrollY <= boxes[0].top) return 0;
  for (const b of boxes) {
    if (scrollY < b.top + b.length) {
      const a = ACT_BY_ID[b.id];
      return a.start + clamp01((scrollY - b.top) / b.length) * (a.end - a.start);
    }
  }
  return 1;
}

// Opacidade do texto de um ato pelo progresso local da sua seção: aparece entre 10–20% e some
// no trecho de 10% que termina em `exit` (padrão 90%). `exit` é antecipado quando o texto é alto
// e o sticky o soltaria antes. A abertura já começa visível; o fechamento não some.
export function textOpacity(id: ActId, local: number, exit = 0.9): number {
  const fadeIn = id === "abertura" ? 1 : smoothstep(0.1, 0.2, local);
  const end = Math.min(0.9, exit);
  const fadeOut = id === "fechamento" ? 1 : 1 - smoothstep(end - 0.1, end, local);
  return fadeIn * fadeOut;
}
