// Geometria do globo. Sem imports: scripts/build-land-points.mjs importa este arquivo direto pelo Node.

// Pontos quase uniformes na esfera (espiral de Fibonacci), como pares [lat, lon] em graus.
export function fibonacciSphere(n: number): [number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const raw = (((i * golden * 180) / Math.PI) % 360) - 180;
    points.push([lat, raw]);
  }
  return points;
}

// Coordenada aleatória uniforme na esfera (a latitude vem do arco-seno para não concentrar nos polos).
export function randomLatLon(rng: () => number): [number, number] {
  const lat = (Math.asin(rng() * 2 - 1) * 180) / Math.PI;
  const lon = rng() * 360 - 180;
  return [lat, lon];
}

export function vec3ToLatLon(x: number, y: number, z: number): { lat: number; lon: number } {
  const r = Math.hypot(x, y, z) || 1;
  return { lat: (Math.asin(y / r) * 180) / Math.PI, lon: (Math.atan2(x, z) * 180) / Math.PI };
}

export function latLonToVec3(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  return [r * Math.cos(phi) * Math.sin(lambda), r * Math.sin(phi), r * Math.cos(phi) * Math.cos(lambda)];
}
