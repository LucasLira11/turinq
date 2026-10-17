"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { cameraAt, globeTransformAt } from "@/components/three/film/camera";
import { film } from "@/components/three/film/film-store";
import { filmFrameAt, introAt, shouldPlayIntro, type FilmFrame } from "@/components/three/film/frame";
import DotGlobe from "@/components/three/objects/DotGlobe";
import Dust from "@/components/three/objects/Dust";
import FacetSphere, { EXPLODE_DISTANCE } from "@/components/three/objects/FacetSphere";
import { QUALITY_SETTINGS } from "@/components/three/quality";
import { smoothstep } from "@/lib/math";
import { prefersReducedMotion } from "@/lib/use-reduced-motion";

const BASE_DISTANCE = 4.2;
const HALF_FOV_TAN = Math.tan((20 * Math.PI) / 180);

export default function FilmScene({ quality }: { quality: "high" | "low" }) {
  const frame = useRef<FilmFrame>(filmFrameAt(film.get().progress, 1));
  const intro = useRef({ start: 0, t: 1, done: true });
  const stage = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);

  useEffect(() => {
    if (shouldPlayIntro(film.get().progress, prefersReducedMotion())) {
      intro.current = { start: performance.now(), t: 0, done: false };
    } else {
      film.set({ introDone: true });
    }
  }, []);

  useFrame(({ camera, size }, dt) => {
    const { progress, pointer } = film.get();
    const i = intro.current;
    if (!i.done) {
      // Se a página já está rolada (recarregou no meio), a montagem termina na hora.
      i.t = progress > 0.03 ? 1 : introAt((performance.now() - i.start) / 1000);
      if (i.t >= 1) {
        i.done = true;
        film.set({ introDone: true });
      }
    }
    const f = filmFrameAt(progress, i.t);
    frame.current = f;

    const pose = cameraAt(progress);
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);

    // Composição: no desktop a esfera fica à direita do texto, do tamanho que cabe na tela;
    // no celular fica menor e acima do texto.
    const aspect = size.width / size.height;
    const mobile = aspect < 0.8;
    const halfWidth = HALF_FOV_TAN * BASE_DISTANCE * aspect;
    const side = 1 - smoothstep(0.4, 0.47, progress);
    const offsetX = mobile ? 0 : Math.min(1.4, halfWidth * 0.5) * side;
    const offsetY = mobile ? 0.95 * side : 0;
    const fit = mobile ? 0.4 : Math.min(0.95, Math.max(0.5, halfWidth * 0.34));
    // Na vista explodida as facetas se afastam, mas o conjunto cresce pouco: não invade o texto.
    const spread = 1 + f.explode * EXPLODE_DISTANCE;
    const scale = (1 - (1 - fit) * side) * ((1 + 0.35 * f.explode * EXPLODE_DISTANCE) / spread);

    const g = globeTransformAt(progress);
    if (stage.current) {
      stage.current.position.set(g.center[0] + offsetX, g.center[1] + offsetY, g.center[2]);
      stage.current.quaternion.set(...g.quaternion);
      stage.current.scale.setScalar(g.radius * scale);
    }
    if (spin.current) {
      spin.current.rotation.y += dt * 0.12 * (1 - smoothstep(0.38, 0.42, progress));
      spin.current.rotation.x += (pointer.y * 0.25 - spin.current.rotation.x) * 0.05;
      spin.current.rotation.z += (-pointer.x * 0.15 - spin.current.rotation.z) * 0.05;
    }
    // O globo só inclina com o mouse antes do mergulho: no território o ponto (-22, -43) precisa
    // estar exatamente no topo, como o globeTransformAt calcula.
    if (tilt.current) {
      const k = 1 - smoothstep(0.38, 0.44, progress);
      tilt.current.rotation.x += (pointer.y * 0.15 * k - tilt.current.rotation.x) * 0.05;
      tilt.current.rotation.z += (-pointer.x * 0.1 * k - tilt.current.rotation.z) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[-3, 4, 5]} intensity={2.2} />
      <directionalLight position={[4, -2, 2]} intensity={0.5} color="#C9D4EE" />
      <Dust count={QUALITY_SETTINGS[quality].dust} />
      <group ref={stage}>
        <group ref={spin}>
          <FacetSphere frame={frame} />
        </group>
        <group ref={tilt}>
          <DotGlobe frame={frame} stride={QUALITY_SETTINGS[quality].landStride} />
        </group>
      </group>
    </>
  );
}
