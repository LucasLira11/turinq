// Câmera e transformação do globo ao longo do filme. A câmera nunca troca de espaço:
// no território é o globo que cresce sob ela até a superfície virar o plano do terreno (y = 0).

import { Quaternion, Vector3 } from "three";
import { latLonToVec3, vec3ToLatLon } from "@/components/three/objects/globe";
import { easeInOutCubic, smoothstep } from "@/lib/math";

type V3 = [number, number, number];
export type CameraPose = { position: V3; target: V3; fov: number };

const KEYS: [number, V3][] = [
  [0, [0, 0, 4.2]],
  [0.2, [0, 0, 4.2]],
  [0.36, [0, 0.6, 3.2]],
  [0.4, [0, 0.6, 3.2]],
  [0.46, [0, 1.6, 2.6]],
  [0.52, [0, 1.2, 1.8]],
  // sobe para ver as camadas GIS empilhadas
  [0.62, [0, 1.7, 2.3]],
  // recua para ver o arco de painéis inteiro
  [0.74, [0, 1.2, 7.5]],
  [0.82, [0, 1.2, 7.5]],
  [0.94, [0, 0, 4.2]],
  [1, [0, 0, 4.2]],
];

export function cameraAt(p: number): CameraPose {
  let position = KEYS[KEYS.length - 1][1];
  for (let i = 1; i < KEYS.length; i++) {
    const [p1, b] = KEYS[i];
    if (p <= p1) {
      const [p0, a] = KEYS[i - 1];
      const t = easeInOutCubic(Math.max(0, (p - p0) / (p1 - p0)));
      position = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      break;
    }
  }
  return { position, target: [0, 0, 0], fov: 40 };
}

// Ponto do mergulho: Sudeste do Brasil.
export const DIVE_LAT = -22;
export const DIVE_LON = -43;

const UP = new Vector3(0, 1, 0);
const DIVE_TO_TOP = new Quaternion().setFromUnitVectors(new Vector3(...latLonToVec3(DIVE_LAT, DIVE_LON, 1)), UP);
const spinAt = (p: number) => new Quaternion().setFromAxisAngle(UP, p * Math.PI * 1.2);

export function globeTransformAt(p: number): { center: V3; radius: number; quaternion: [number, number, number, number] } {
  const turnIn = smoothstep(0.4, 0.47, p);
  const turnOut = smoothstep(0.66, 0.76, p);
  const grow = smoothstep(0.45, 0.55, p) - smoothstep(0.66, 0.76, p);
  const sink = smoothstep(0.41, 0.47, p) - smoothstep(0.7, 0.78, p);

  const q = spinAt(p).slerp(DIVE_TO_TOP, turnIn).slerp(spinAt(p), turnOut);
  const radius = 40 ** grow;
  return { center: [0, 0 - radius * sink, 0], radius, quaternion: [q.x, q.y, q.z, q.w] };
}

const EARTH_RADIUS_M = 6_371_000;

// Coordenadas mostradas no HUD. Antes do mergulho: o ponto do globo sob a câmera e a altitude
// sobre ele; no território: o alvo deslocado pela posição da câmera (0,5° por unidade).
export function hudAt(p: number): { lat: number; lon: number; alt: number } {
  const { position } = cameraAt(p);
  if (p >= 0.47) {
    return { lat: DIVE_LAT - position[2] * 0.5, lon: DIVE_LON + position[0] * 0.5, alt: Math.max(0, position[1]) * 1000 };
  }
  const g = globeTransformAt(p);
  const local = new Vector3(position[0] - g.center[0], position[1] - g.center[1], position[2] - g.center[2]);
  const distance = local.length();
  local.applyQuaternion(new Quaternion(...g.quaternion).invert());
  const { lat, lon } = vec3ToLatLon(local.x, local.y, local.z);
  return { lat, lon, alt: Math.max(0, distance - g.radius) * EARTH_RADIUS_M };
}
