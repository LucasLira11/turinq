import { expect, test } from "vitest";
import { contrastRatio } from "@/lib/color";
import {
  ACTS,
  actAt,
  backgroundAt,
  localProgress,
  progressAt,
  snapProgress,
  textColorFor,
  textOpacity,
  timecodeAt,
  toneAt,
  type SectionBox,
} from "./timeline";

test("atos cobrem [0,1] sem buracos", () => {
  ACTS.forEach((a, i) => {
    if (i) expect(a.start).toBe(ACTS[i - 1].end);
  });
  expect(ACTS[0].start).toBe(0);
  expect(ACTS.at(-1)!.end).toBe(1);
});

test("actAt e localProgress", () => {
  expect(actAt(0).id).toBe("abertura");
  expect(actAt(0.3).id).toBe("planeta");
  expect(actAt(1).id).toBe("fechamento");
  expect(localProgress(0.3, "planeta")).toBeCloseTo(0.5);
  expect(localProgress(0.9, "planeta")).toBe(1);
});

test("fundo e tom nos pontos-chave", () => {
  expect(backgroundAt(0)).toBe("#E9ECF2");
  expect(backgroundAt(0.4)).toBe("#0B0E16");
  expect(backgroundAt(1)).toBe("#F2F3F6");
  expect([0, 0.3, 0.5, 0.9].map(toneAt)).toEqual(["light", "dark", "dark", "light"]);
});

test("act text windows keep AA contrast", () => {
  for (const a of ACTS) {
    const from = a.start + (a.end - a.start) * 0.2;
    const to = a.start + (a.end - a.start) * 0.8;
    for (let p = from; p <= to; p += 0.005) {
      expect(contrastRatio(textColorFor(toneAt(p)), backgroundAt(p))).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test("timecode e snap", () => {
  expect(timecodeAt(0)).toBe("00:00");
  expect(timecodeAt(0.5)).toBe("00:45");
  expect(timecodeAt(1)).toBe("01:30");
  expect(snapProgress(0.25)).toBeCloseTo(0.3);
});

// Seções com alturas arbitrárias, empilhadas a partir de y = 500 (o filme não começa no topo da página).
const boxes: SectionBox[] = (() => {
  let top = 500;
  return ACTS.map((a, i) => {
    const length = 300 + i * 100;
    const box = { id: a.id, top, length };
    top += length;
    return box;
  });
})();

test("progressAt: topo de cada seção = início do ato", () => {
  boxes.forEach((b, i) => expect(progressAt(b.top, boxes)).toBeCloseTo(ACTS[i].start));
  const planeta = boxes[2];
  expect(progressAt(planeta.top + planeta.length / 2, boxes)).toBeCloseTo(0.3);
  expect(progressAt(0, boxes)).toBe(0);
  expect(progressAt(1e9, boxes)).toBe(1);
});

test("textOpacity: janelas de 20–80% e as exceções da abertura e do fechamento", () => {
  expect(textOpacity("abertura", 0)).toBe(1);
  expect(textOpacity("abertura", 1)).toBe(0);
  expect(textOpacity("anos", 0)).toBe(0);
  expect(textOpacity("anos", 0.5)).toBe(1);
  expect(textOpacity("anos", 0.95)).toBe(0);
  expect(textOpacity("planeta", 0.2)).toBe(1);
  expect(textOpacity("planeta", 0.8)).toBe(1);
  expect(textOpacity("fechamento", 1)).toBe(1);
});

test("textOpacity some antes do ponto em que o sticky solta o texto", () => {
  expect(textOpacity("anos", 0.55, 0.7)).toBe(1);
  expect(textOpacity("anos", 0.7, 0.7)).toBe(0);
  expect(textOpacity("anos", 0.65, 0.7)).toBeGreaterThan(0);
  expect(textOpacity("anos", 0.65, 0.7)).toBeLessThan(1);
});
