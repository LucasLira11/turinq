// Geometria do globo. Sem imports: scripts/build-land-points.mjs importa este arquivo direto pelo Node.

export function latLonToVec3(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  return [r * Math.cos(phi) * Math.sin(lambda), r * Math.sin(phi), r * Math.cos(phi) * Math.cos(lambda)];
}
