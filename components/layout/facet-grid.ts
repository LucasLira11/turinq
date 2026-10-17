// Grade de triângulos (2 por célula, diagonal alternada como as facetas do logo) que cobre
// a tela na transição entre páginas. Coordenadas em 0–100; `delay` cresce na diagonal (0–1).
export function facetGrid(cols: number, rows: number): { points: string; delay: number }[] {
  const w = 100 / cols;
  const h = 100 / rows;
  const r2 = (v: number) => +v.toFixed(2);
  const pt = (x: number, y: number) => `${r2(x)},${r2(y)}`;
  const tris: { points: string; delay: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [x0, y0, x1, y1] = [c * w, r * h, (c + 1) * w, (r + 1) * h];
      const delay = (c + r) / (cols - 1 + rows - 1);
      if ((c + r) % 2 === 0) {
        tris.push({ points: [pt(x0, y0), pt(x1, y0), pt(x0, y1)].join(" "), delay });
        tris.push({ points: [pt(x1, y0), pt(x1, y1), pt(x0, y1)].join(" "), delay });
      } else {
        tris.push({ points: [pt(x0, y0), pt(x1, y0), pt(x1, y1)].join(" "), delay });
        tris.push({ points: [pt(x0, y0), pt(x1, y1), pt(x0, y1)].join(" "), delay });
      }
    }
  }
  return tris;
}
