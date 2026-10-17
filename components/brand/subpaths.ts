// Utilitários para o path SVG gerado pelo potrace (só comandos absolutos M, L, C).
// Sem imports e sem sintaxe que exija transformação: scripts/trace-logo.mjs importa
// este arquivo direto pelo Node.

const NUMBER = /-?\d+(?:\.\d+)?/g;

export function splitSubpaths(d: string): string[] {
  return d
    .split(/(?=M)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Os números aparecem em pares (x y), então os de índice par são coordenadas x.
export function subpathXRange(sub: string): [number, number] {
  const xs = (sub.match(NUMBER) ?? []).map(Number).filter((_, i) => i % 2 === 0);
  return [Math.min(...xs), Math.max(...xs)];
}

export function groupByRanges(subs: string[], ranges: [number, number][]): string[] {
  const groups: string[][] = ranges.map(() => []);
  for (const sub of subs) {
    const [min, max] = subpathXRange(sub);
    const center = (min + max) / 2;
    const i = ranges.findIndex(([a, b]) => center >= a && center < b);
    if (i >= 0) groups[i].push(sub);
  }
  return groups.map((g) => g.join(" "));
}

export function translatePath(d: string, dx: number, dy: number): string {
  let i = 0;
  return d.replace(NUMBER, (n) => {
    const v = Number(n) - (i++ % 2 === 0 ? dx : dy);
    return String(+v.toFixed(2));
  });
}
