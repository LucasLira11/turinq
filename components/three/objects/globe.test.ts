import { expect, test } from "vitest";
import { latLonToVec3 } from "./globe";

test("latLonToVec3", () => {
  expect(latLonToVec3(0, 0, 1).map((v) => +v.toFixed(6))).toEqual([0, 0, 1]);
  expect(latLonToVec3(90, 0, 2)[1]).toBeCloseTo(2);
  expect(Math.hypot(...latLonToVec3(-22, -43, 1))).toBeCloseTo(1);
});
