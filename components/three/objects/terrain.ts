// Relevo procedural do território: ruído de valor (fBm, 4 oitavas), determinístico e em [0, 1].
// Domínio: x, z ∈ [-1, 1].

function hash(ix: number, iz: number, seed: number): number {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iz, 668265263) ^ Math.imul(seed, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const fade = (t: number) => t * t * (3 - 2 * t);

function valueNoise(x: number, z: number, seed: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = fade(x - ix);
  const fz = fade(z - iz);
  const a = hash(ix, iz, seed);
  const b = hash(ix + 1, iz, seed);
  const c = hash(ix, iz + 1, seed);
  const d = hash(ix + 1, iz + 1, seed);
  return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
}

export function heightAt(x: number, z: number, seed = 11): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1.6;
  let norm = 0;
  for (let o = 0; o < 4; o++) {
    sum += amp * valueNoise(x * freq + 10, z * freq + 10, seed + o);
    norm += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum / norm;
}

// Nascentes: os pontos mais altos de uma grade 21×21, afastados pelo menos 0,3 entre si.
export function riverSources(n: number, seed = 11): [number, number][] {
  const grid: { p: [number, number]; h: number }[] = [];
  for (let i = 0; i <= 20; i++) {
    for (let j = 0; j <= 20; j++) {
      const p: [number, number] = [-0.9 + i * 0.09, -0.9 + j * 0.09];
      grid.push({ p, h: heightAt(p[0], p[1], seed) });
    }
  }
  grid.sort((a, b) => b.h - a.h);
  const picked: [number, number][] = [];
  for (const { p } of grid) {
    if (picked.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) >= 0.3)) picked.push(p);
    if (picked.length === n) break;
  }
  return picked;
}

// Rio: desce pelo gradiente do relevo até um mínimo local ou a borda do domínio.
export function traceRiver(start: [number, number], steps: number, seed = 11): [number, number][] {
  const STEP = 0.01;
  const EPS = 0.004;
  const path: [number, number][] = [start];
  let [x, z] = start;
  let h = heightAt(x, z, seed);
  for (let i = 0; i < steps; i++) {
    const gx = (heightAt(x + EPS, z, seed) - heightAt(x - EPS, z, seed)) / (2 * EPS);
    const gz = (heightAt(x, z + EPS, seed) - heightAt(x, z - EPS, seed)) / (2 * EPS);
    const len = Math.hypot(gx, gz);
    if (len < 1e-6) break;
    // Passo adaptativo: se o passo cheio sobe (curvatura do relevo), tenta passos menores.
    let moved = false;
    for (let step = STEP; step > STEP / 16 && !moved; step /= 2) {
      const nx = x - (gx / len) * step;
      const nz = z - (gz / len) * step;
      if (Math.abs(nx) > 1 || Math.abs(nz) > 1) break;
      const nh = heightAt(nx, nz, seed);
      if (nh <= h) {
        x = nx;
        z = nz;
        h = nh;
        path.push([x, z]);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return path;
}
