import { expect, test } from "vitest";
import { groupByRanges, splitSubpaths, subpathXRange, translatePath } from "./subpaths";

const d = "M 10 0 L 20 0 20 10 Z M 12 2 L 18 2 18 8 Z M 50 0 C 55 0, 60 5, 60 10 Z";

test("split e faixa x", () => {
  expect(splitSubpaths(d)).toHaveLength(3);
  expect(subpathXRange(splitSubpaths(d)[2])).toEqual([50, 60]);
});

test("agrupa por faixa, preservando furos", () => {
  const groups = groupByRanges(splitSubpaths(d), [
    [0, 40],
    [40, 80],
  ]);
  expect(groups).toHaveLength(2);
  expect(splitSubpaths(groups[0])).toHaveLength(2);
});

test("translatePath desloca x e y de cada ponto", () => {
  expect(translatePath("M 10 5 L 20 7, 30 9", 10, 5)).toBe("M 0 0 L 10 2, 20 4");
});
