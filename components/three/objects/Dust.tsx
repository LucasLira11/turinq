"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { film } from "@/components/three/film/film-store";
import { TOKENS } from "@/lib/color";
import { mulberry32 } from "@/lib/math";

const LIGHT = new THREE.Color(TOKENS.brand);
const DARK = new THREE.Color(TOKENS.brandLight);

// Poeira flutuando na frente e atrás da cena, como na imagem do logo.
export default function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 14;
      arr[i * 3 + 1] = (rand() - 0.5) * 9;
      arr[i * 3 + 2] = (rand() - 0.5) * 8 - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    const points = ref.current;
    if (!points || !material.current) return;
    const { pointer } = film.get();
    points.rotation.y += dt * 0.01;
    points.position.x += (pointer.x * 0.25 - points.position.x) * 0.04;
    points.position.y += (pointer.y * 0.15 - points.position.y) * 0.04;
    const target = document.documentElement.dataset.tone === "dark" ? DARK : LIGHT;
    material.current.color.lerp(target, 0.08);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={material} size={0.025} sizeAttenuation transparent opacity={0.55} depthWrite={false} color={LIGHT} />
    </points>
  );
}
