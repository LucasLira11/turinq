"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { film } from "@/components/three/film/film-store";
import Dust from "@/components/three/objects/Dust";
import TerrainMesh from "@/components/three/objects/TerrainMesh";
import { QUALITY_SETTINGS } from "@/components/three/quality";

// Página de geotecnologia: relevo com curvas de nível; uma faixa de brilho segue o mouse,
// como um scanner passando sobre o mapa.
export default function TerrainScene({ quality }: { quality: "high" | "low" }) {
  const scan = useRef(-10);
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    camera.position.set(0, 1.15, 1.9);
    camera.lookAt(0, 0.05, 0);
    const { pointer } = film.get();
    const target = pointer.x === 0 && pointer.y === 0 ? Math.sin(clock.elapsedTime * 0.4) * 0.8 : pointer.x;
    scan.current += (target - scan.current) * 0.08;
    if (group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.25;
  });

  return (
    <>
      <Dust count={QUALITY_SETTINGS[quality].dust} />
      <group ref={group}>
        <TerrainMesh segments={QUALITY_SETTINGS[quality].terrainSegments} opacity={0.6} scan={scan} />
      </group>
    </>
  );
}
