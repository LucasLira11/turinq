"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { film } from "@/components/three/film/film-store";
import type { FilmFrame } from "@/components/three/film/frame";
import DotGlobe from "@/components/three/objects/DotGlobe";
import Dust from "@/components/three/objects/Dust";
import { latLonToVec3, randomLatLon } from "@/components/three/objects/globe";
import { heroPlacement } from "@/components/three/placement";
import { QUALITY_SETTINGS } from "@/components/three/quality";
import { TOKENS } from "@/lib/color";
import { lostPin } from "./lost-pin";

const GLOBE: FilmFrame = {
  assemble: 1,
  explode: 0,
  sphereOpacity: 0,
  wireOpacity: 0,
  globeOpacity: 1,
  terrainOpacity: 0,
  layerSpread: 0,
  panelMorph: 0,
  foldBack: 0,
};

// 404: globo noturno com um pin pulsando numa coordenada sorteada — "coordenada não encontrada".
export default function GlobeScene({ quality }: { quality: "high" | "low" }) {
  const frame = useRef<FilmFrame>(GLOBE);
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  // O Stage só roda no navegador, então sortear aqui não gera diferença de hidratação.
  const pin = useMemo(() => randomLatLon(Math.random), []);
  const facing = useMemo(() => {
    const dir = new THREE.Vector3(...latLonToVec3(pin[0], pin[1], 1));
    return new THREE.Quaternion().setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1));
  }, [pin]);
  const pinPosition = useMemo(() => latLonToVec3(pin[0], pin[1], 1.01), [pin]);
  const pinNormal = useMemo(() => new THREE.Vector3(...pinPosition).normalize(), [pinPosition]);
  const ringRotation = useMemo(
    () => new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pinNormal)),
    [pinNormal],
  );

  useEffect(() => {
    lostPin.set({ pin });
    return () => lostPin.set({ pin: null });
  }, [pin]);

  const wobble = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);

  useFrame(({ camera, size, clock }) => {
    camera.position.set(0, 0, 4.2);
    camera.lookAt(0, 0, 0);
    const place = heroPlacement(size.width / size.height);
    const { pointer } = film.get();
    if (group.current) {
      group.current.position.set(place.x, place.y, 0);
      group.current.scale.setScalar(place.scale);
      euler.set(-pointer.y * 0.2 + 0.25, Math.sin(clock.elapsedTime * 0.2) * 0.25 + pointer.x * 0.3, 0);
      group.current.quaternion.copy(wobble.setFromEuler(euler).multiply(facing));
    }
    if (ring.current) {
      const t = (clock.elapsedTime % 1.6) / 1.6;
      ring.current.scale.setScalar(0.4 + t * 1.6);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 1 - t;
    }
  });

  return (
    <>
      <Dust count={QUALITY_SETTINGS[quality].dust} />
      <group ref={group}>
        <DotGlobe frame={frame} stride={QUALITY_SETTINGS[quality].landStride} />
        <mesh position={pinPosition}>
          <sphereGeometry args={[0.025, 16, 12]} />
          <meshBasicMaterial color={TOKENS.gis} />
        </mesh>
        <mesh ref={ring} position={pinPosition} rotation={ringRotation}>
          <ringGeometry args={[0.04, 0.05, 40]} />
          <meshBasicMaterial color={TOKENS.gis} transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
}
