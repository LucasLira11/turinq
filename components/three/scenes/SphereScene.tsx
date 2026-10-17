"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { film } from "@/components/three/film/film-store";
import { introAt, type FilmFrame } from "@/components/three/film/frame";
import Dust from "@/components/three/objects/Dust";
import FacetSphere from "@/components/three/objects/FacetSphere";
import { heroPlacement } from "@/components/three/placement";
import { QUALITY_SETTINGS } from "@/components/three/quality";
import { DIRECTOR_PRIORITY } from "@/components/three/scenes/priority";
import { prefersReducedMotion } from "@/lib/use-reduced-motion";

const STILL: FilmFrame = {
  assemble: 1,
  explode: 0,
  sphereOpacity: 1,
  wireOpacity: 0,
  globeOpacity: 0,
  terrainOpacity: 0,
  layerSpread: 0,
  panelMorph: 0,
  foldBack: 0,
};

// Esfera do logo ao lado do texto (sobre, contato). Ao chegar na página as facetas se juntam rápido.
export default function SphereScene({ quality, small = false }: { quality: "high" | "low"; small?: boolean }) {
  const frame = useRef<FilmFrame>({ ...STILL, assemble: 0 });
  const started = useRef<number | null>(null);
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);

  useFrame(({ camera, size }, dt) => {
    started.current ??= performance.now();
    const t = prefersReducedMotion() ? 1 : introAt(((performance.now() - started.current) / 1000) * 2);
    frame.current = { ...STILL, assemble: t };

    camera.position.set(0, 0, 4.2);
    camera.lookAt(0, 0, 0);
    const place = heroPlacement(size.width / size.height);
    if (group.current) {
      group.current.position.set(place.x, place.y, 0);
      group.current.scale.setScalar(place.scale * (small ? 0.75 : 1));
    }
    const { pointer } = film.get();
    if (spin.current) {
      spin.current.rotation.y += dt * 0.12;
      spin.current.rotation.x += (pointer.y * 0.25 - spin.current.rotation.x) * 0.05;
      spin.current.rotation.z += (-pointer.x * 0.15 - spin.current.rotation.z) * 0.05;
    }
  }, DIRECTOR_PRIORITY);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[-3, 4, 5]} intensity={2.2} />
      <directionalLight position={[4, -2, 2]} intensity={0.5} color="#C9D4EE" />
      <Dust count={QUALITY_SETTINGS[quality].dust} />
      <group ref={group}>
        <group ref={spin}>
          <FacetSphere frame={frame} />
        </group>
      </group>
    </>
  );
}
