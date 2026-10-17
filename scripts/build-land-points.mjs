// Gera public/data/land-points.json: pontos de Fibonacci na esfera que caem sobre terra firme.
// Dados: world-atlas (land-110m), derivado do Natural Earth, que é de domínio público.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import { fibonacciSphere } from "../components/three/objects/globe.ts";

const require = createRequire(import.meta.url);
const topology = JSON.parse(await readFile(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topology, topology.objects.land);

const SAMPLES = 16000;
const points = [];
for (const [lat, lon] of fibonacciSphere(SAMPLES)) {
  if (geoContains(land, [lon, lat])) points.push(+lat.toFixed(2), +lon.toFixed(2));
}

await mkdir("public/data", { recursive: true });
const json = JSON.stringify({ points });
await writeFile("public/data/land-points.json", json);
console.log(`${points.length / 2} pontos de terra (${(json.length / 1024).toFixed(1)} KB)`);
