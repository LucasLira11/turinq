// Nível de qualidade do 3D, escolhido pela tela e pelo aparelho.

export type Quality = "high" | "low" | "static";
export type QualityEnv = { webgl: boolean; forceStatic: boolean; width: number; cores?: number; memory?: number };

export const QUALITY_SETTINGS: Record<
  "high" | "low",
  { dpr: [number, number]; dust: number; landStride: number; terrainSegments: number }
> = {
  high: { dpr: [1, 2], dust: 600, landStride: 1, terrainSegments: 256 },
  low: { dpr: [1, 1], dust: 300, landStride: 2, terrainSegments: 128 },
};

export function pickQuality(env: QualityEnv): Quality {
  if (!env.webgl || env.forceStatic) return "static";
  if (env.width < 768) return "low";
  if (env.cores !== undefined && env.cores <= 4) return "low";
  if (env.memory !== undefined && env.memory <= 4) return "low";
  return "high";
}

// Só no cliente. `?nowebgl` força o poster estático.
export function detectQualityEnv(search: string): QualityEnv {
  const canvas = document.createElement("canvas");
  const webgl = !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    webgl,
    forceStatic: new URLSearchParams(search).has("nowebgl"),
    width: window.innerWidth,
    cores: nav.hardwareConcurrency,
    memory: nav.deviceMemory,
  };
}
