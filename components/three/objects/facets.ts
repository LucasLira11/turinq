// Facetas da esfera geodésica do logo: cada triângulo separado, com uma fresta até o vizinho.

import { IcosahedronGeometry } from "three";
import { mulberry32 } from "@/lib/math";

type V3 = [number, number, number];
export type Facet = { a: V3; b: V3; c: V3; centroid: V3; normal: V3 };

const sub = (p: V3, q: V3): V3 => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const cross = (p: V3, q: V3): V3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const norm = (p: V3): V3 => {
  const l = Math.hypot(...p) || 1;
  return [p[0] / l, p[1] / l, p[2] / l];
};
const towards = (p: V3, c: V3, t: number): V3 => [p[0] + (c[0] - p[0]) * t, p[1] + (c[1] - p[1]) * t, p[2] + (c[2] - p[2]) * t];

// `gap` é a fração (0–1) que cada vértice anda em direção ao centroide da própria face.
export function buildFacets(detail: number, gap: number): Facet[] {
  const pos = new IcosahedronGeometry(1, detail).getAttribute("position");
  const facets: Facet[] = [];
  for (let i = 0; i < pos.count; i += 3) {
    const [a, b, c] = [0, 1, 2].map((k) => [pos.getX(i + k), pos.getY(i + k), pos.getZ(i + k)] as V3);
    const centroid: V3 = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
    let normal = norm(cross(sub(b, a), sub(c, a)));
    if (normal[0] * centroid[0] + normal[1] * centroid[1] + normal[2] * centroid[2] < 0) {
      normal = [-normal[0], -normal[1], -normal[2]];
    }
    facets.push({ a: towards(a, centroid, gap), b: towards(b, centroid, gap), c: towards(c, centroid, gap), centroid, normal });
  }
  return facets;
}

// Proporção de cores do ícone: maioria índigo, algumas claras, poucas pretas.
export function facetShade(i: number, seed = 1): "brand" | "light" | "black" {
  const r = mulberry32(seed * 1000 + i * 97)();
  if (r < 0.7) return "brand";
  if (r < 0.9) return "light";
  return "black";
}

export function scatterOffset(i: number, seed: number): V3 {
  const rand = mulberry32(seed * 7919 + i * 31);
  const z = rand() * 2 - 1;
  const t = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  const r = 3 + rand() * 3;
  return [r * s * Math.cos(t), r * s * Math.sin(t), r * z];
}
