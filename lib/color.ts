// Tokens de cor da marca e utilitários para interpolar e medir contraste (WCAG 2.x).

export const TOKENS = {
  silver100: "#E9ECF2",
  silver300: "#C9CED9",
  paper: "#F2F3F6",
  brand: "#4E5472",
  brandLight: "#8FA3C7",
  steel: "#3F6A8A",
  night: "#0B0E16",
  nightSurface: "#121725",
  ink: "#1A1D29",
  gis: "#7FD1C7",
} as const;

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(v: number): string {
  return Math.round(v).toString(16).padStart(2, "0").toUpperCase();
}

export function lerpHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return "#" + ca.map((v, i) => toHex(v + (cb[i] - v) * t)).join("");
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
