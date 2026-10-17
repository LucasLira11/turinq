import { Quaternion, Vector3 } from "three";
import { expect, test } from "vitest";
import { latLonToVec3 } from "@/components/three/objects/globe";
import { cameraAt, globeTransformAt } from "./camera";

test("câmera contínua", () => {
  for (let p = 0; p < 1; p += 0.001) {
    const a = cameraAt(p).position;
    const b = cameraAt(p + 0.001).position;
    expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeLessThan(0.15);
  }
});

test("globo contínuo e alvo no topo durante o território", () => {
  for (let p = 0; p < 1; p += 0.001) {
    expect(Math.abs(Math.log(globeTransformAt(p + 0.001).radius / globeTransformAt(p).radius))).toBeLessThan(0.1);
  }
  const g = globeTransformAt(0.55);
  const top = new Vector3(...latLonToVec3(-22, -43, 1)).applyQuaternion(new Quaternion(...g.quaternion));
  expect(top.y).toBeCloseTo(1, 2);
  expect(g.center[1]).toBeCloseTo(-g.radius);
});

test("globo volta à origem com raio 1 no fechamento", () => {
  const g = globeTransformAt(0.9);
  expect(g.radius).toBeCloseTo(1);
  expect(g.center.map((v) => +v.toFixed(6))).toEqual([0, 0, 0]);
});
