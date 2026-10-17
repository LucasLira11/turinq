// Vetoriza o logo oficial (public/logo-turinq.png) sem redesenhar: o potrace traça o PNG
// e as formas são separadas em ícone + 6 letras pelas faixas de x medidas no arquivo.
// Saídas: components/brand/wordmark-data.ts, components/brand/monogram-data.ts, app/icon.svg.
import { writeFile } from "node:fs/promises";
import potrace from "potrace";
import { groupByRanges, splitSubpaths, translatePath } from "../components/brand/subpaths.ts";

const SRC = "public/logo-turinq.png";
// Faixas de x no PNG (801×233): ícone, t, u, r, i, n, q.
const RANGES = [
  [0, 240],
  [240, 330],
  [330, 420],
  [420, 490],
  [490, 540],
  [540, 635],
  [635, 740],
];
const CHARS = ["t", "u", "r", "i", "n", "q"];
const BRAND = "#4E5472";

const svg = await new Promise((resolve, reject) =>
  potrace.trace(SRC, { threshold: 160, turdSize: 4, optTolerance: 0.2 }, (err, out) => (err ? reject(err) : resolve(out))),
);
const pathTag = svg.match(/<path[^>]*>/)[0];
const d = pathTag.match(/ d="([^"]+)"/)[1];
const fillRule = pathTag.match(/fill-rule="([^"]+)"/)?.[1] ?? "nonzero";

const [icon, ...letters] = groupByRanges(splitSubpaths(d), RANGES);

function bbox(path) {
  const n = path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

const round = (v) => +v.toFixed(2);
const boxes = letters.map(bbox);
const top = Math.min(...boxes.map((b) => b.minY));
const bottom = Math.max(...boxes.map((b) => b.maxY));
const left = boxes[0].minX;

const wordmark = {
  height: round(bottom - top),
  fillRule,
  letters: letters.map((l, i) => ({
    char: CHARS[i],
    d: translatePath(l, boxes[i].minX, top),
    x: round(boxes[i].minX - left),
    width: round(boxes[i].maxX - boxes[i].minX),
  })),
};

const ib = bbox(icon);
const monogram = {
  width: round(ib.maxX - ib.minX),
  height: round(ib.maxY - ib.minY),
  fillRule,
  d: translatePath(icon, ib.minX, ib.minY),
};

const header = "// Gerado por scripts/trace-logo.mjs a partir de public/logo-turinq.png. Não editar à mão.\n";
await writeFile(
  "components/brand/wordmark-data.ts",
  `${header}export const WORDMARK: {\n  height: number;\n  fillRule: "evenodd" | "nonzero";\n  letters: { char: string; d: string; x: number; width: number }[];\n} = ${JSON.stringify(wordmark, null, 2)};\n`,
);
await writeFile(
  "components/brand/monogram-data.ts",
  `${header}export const MONOGRAM: { width: number; height: number; fillRule: "evenodd" | "nonzero"; d: string } = ${JSON.stringify(monogram, null, 2)};\n`,
);

// Favicon quadrado, com o ícone centralizado.
const side = Math.max(monogram.width, monogram.height);
const ox = round((side - monogram.width) / 2);
const oy = round((side - monogram.height) / 2);
await writeFile(
  "app/icon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-ox} ${-oy} ${side} ${side}"><path fill="${BRAND}" fill-rule="${fillRule}" d="${monogram.d}"/></svg>\n`,
);

console.log(`${wordmark.letters.length} letras, monograma com ${splitSubpaths(icon).length} subpaths, fill-rule ${fillRule}`);
