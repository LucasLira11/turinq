import { expect, test } from "vitest";
import { fibonacciSphere, latLonToVec3 } from "./globe";

test("fibonacciSphere distribui no intervalo", () => {
  const pts = fibonacciSphere(1000);
  expect(pts).toHaveLength(1000);
  pts.forEach(([la, lo]) => {
    expect(Math.abs(la)).toBeLessThanOrEqual(90);
    expect(lo).toBeGreaterThanOrEqual(-180);
    expect(lo).toBeLessThan(180);
  });
});

test("latLonToVec3", () => {
  expect(latLonToVec3(0, 0, 1).map((v) => +v.toFixed(6))).toEqual([0, 0, 1]);
  expect(latLonToVec3(90, 0, 2)[1]).toBeCloseTo(2);
  expect(Math.hypot(...latLonToVec3(-22, -43, 1))).toBeCloseTo(1);
});
