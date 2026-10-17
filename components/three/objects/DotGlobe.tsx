"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FilmFrame } from "@/components/three/film/frame";
import { TOKENS } from "@/lib/color";
import { latLonToVec3 } from "./globe";

let landRequest: Promise<number[]> | null = null;

// Os pontos dos continentes só são baixados quando uma cena com globo aparece (e uma vez só).
function loadLand(): Promise<number[]> {
  landRequest ??= fetch("/data/land-points.json")
    .then((r) => r.json() as Promise<{ points: number[] }>)
    .then((d) => d.points);
  return landRequest;
}

function gridGeometry(step: number, radius: number): THREE.BufferGeometry {
  const pts: number[] = [];
  const push = (a: [number, number, number], b: [number, number, number]) => pts.push(...a, ...b);
  for (let lat = -90 + step; lat < 90; lat += step) {
    for (let lon = -180; lon < 180; lon += 4) push(latLonToVec3(lat, lon, radius), latLonToVec3(lat, lon + 4, radius));
  }
  for (let lon = -180; lon < 180; lon += step) {
    for (let lat = -90; lat < 90; lat += 4) push(latLonToVec3(lat, lon, radius), latLonToVec3(lat + 4, lon, radius));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

type Props = { frame: RefObject<FilmFrame>; stride: number };

// Globo noturno: continentes em pontos de luz e grade de latitude/longitude a cada 15°.
export default function DotGlobe({ frame, stride }: Props) {
  const [land, setLand] = useState<number[] | null>(null);
  const dots = useRef<THREE.PointsMaterial>(null);
  const grid = useRef<THREE.LineBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    let alive = true;
    loadLand().then((p) => alive && setLand(p));
    return () => {
      alive = false;
    };
  }, []);

  const points = useMemo(() => {
    if (!land) return null;
    const arr: number[] = [];
    for (let i = 0; i < land.length; i += 2 * stride) arr.push(...latLonToVec3(land[i], land[i + 1], 1.002));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, [land, stride]);

  const lines = useMemo(() => gridGeometry(15, 1), []);

  useFrame(() => {
    const o = frame.current?.globeOpacity ?? 0;
    if (group.current) group.current.visible = o > 0.001;
    if (dots.current) dots.current.opacity = o;
    if (grid.current) grid.current.opacity = o * 0.16;
  });

  return (
    <group ref={group} visible={false}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial ref={grid} color={TOKENS.brandLight} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      {points && (
        <points geometry={points}>
          <pointsMaterial
            ref={dots}
            color={TOKENS.brandLight}
            size={0.014}
            sizeAttenuation
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
      {/* Oclusor invisível (só profundidade): esconde os pontos do lado de trás do globo. */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[0.995, 48, 32]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>
    </group>
  );
}
