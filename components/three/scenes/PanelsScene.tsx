"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { film } from "@/components/three/film/film-store";
import Dust from "@/components/three/objects/Dust";
import ScreenPanels from "@/components/three/objects/ScreenPanels";
import { HALF_FOV_TAN } from "@/components/three/placement";
import { QUALITY_SETTINGS } from "@/components/three/quality";

const DISTANCE = 7.5;

// Páginas sindical e sites e sistemas: o arco de telas do ato 4, balançando devagar com o mouse.
export default function PanelsScene({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ camera, size, clock }) => {
    camera.position.set(0, 0.6, DISTANCE);
    camera.lookAt(0, 0.4, 0);
    const aspect = size.width / size.height;
    const mobile = aspect < 0.8;
    const compact = !mobile && aspect < 1.35;
    const halfWidth = HALF_FOV_TAN * DISTANCE * aspect;
    const { pointer } = film.get();
    if (group.current) {
      // No desktop estreito os painéis sobem para o espaço acima do título (o hero alinha embaixo).
      const x = mobile ? 0 : halfWidth * (compact ? 0.55 : 0.42);
      const y = mobile ? 1.6 : compact ? 1.3 : 0;
      group.current.position.set(x, y, 0);
      group.current.scale.setScalar(mobile ? 0.55 : compact ? 0.45 : Math.min(0.9, Math.max(0.5, halfWidth * 0.2)));
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.08 + pointer.x * 0.12;
      group.current.rotation.x = -pointer.y * 0.06;
    }
  });

  return (
    <>
      <Dust count={QUALITY_SETTINGS[quality].dust} />
      <group ref={group}>
        <ScreenPanels morph={1} />
      </group>
    </>
  );
}
