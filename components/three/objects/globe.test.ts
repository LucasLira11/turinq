import { expect, test } from "vitest";
import { mulberry32 } from "@/lib/math";
import { fibonacciSphere, latLonToVec3, randomLatLon } from "./globe";

test("randomLatLon dentro do globo", () => {
  const rng = mulberry32(1);
  for (let i = 0; i < 100; i++) {
    const [la, lo] = randomLatLon(rng);
    expect(Math.abs(la)).toBeLessThanOrEqual(90);
    expect(Math.abs(lo)).toBeLessThanOrEqual(180);
  }
});

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
