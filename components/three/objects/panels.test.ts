import { expect, test } from "vitest";
import { panelPose } from "./panels";

test("poses nos extremos", () => {
  expect(panelPose(2, 4, 0, 0).position[1]).toBeCloseTo(0.7);
  expect(panelPose(2, 4, 0, 0).rotation[0]).toBeCloseTo(-Math.PI / 2);
  const p = panelPose(0, 4, 1, 0);
  const q = panelPose(3, 4, 1, 0);
  expect(Math.hypot(p.position[0], p.position[2])).toBeCloseTo(3);
  expect(p.position[0]).toBeLessThan(0);
  expect(q.position[0]).toBeGreaterThan(0);
  expect(panelPose(1, 4, 1, 1).scale).toBe(0);
});

test("no arco os painéis ficam em pé e virados para fora do centro", () => {
  const p = panelPose(3, 4, 1, 0);
  expect(p.rotation[0]).toBeCloseTo(0);
  expect(p.rotation[1]).toBeGreaterThan(0);
});
