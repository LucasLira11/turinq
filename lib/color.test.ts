import { expect, test } from "vitest";
import { contrastRatio, lerpHex, TOKENS } from "./color";

test("lerpHex", () => {
  expect(lerpHex("#000000", "#FFFFFF", 0.5)).toBe("#808080");
  expect(lerpHex("#E9ECF2", "#0B0E16", 0)).toBe("#E9ECF2");
});

test("contraste AA dos pares de texto do design", () => {
  const pairs: [keyof typeof TOKENS, keyof typeof TOKENS][] = [
    ["ink", "paper"],
    ["ink", "silver100"],
    ["brand", "paper"],
    ["steel", "paper"],
    ["brandLight", "night"],
    ["gis", "night"],
  ];
  pairs.forEach(([fg, bg]) => expect(contrastRatio(TOKENS[fg], TOKENS[bg])).toBeGreaterThanOrEqual(4.5));
  expect(contrastRatio("#FFFFFF", TOKENS.night)).toBeGreaterThan(15);
});
