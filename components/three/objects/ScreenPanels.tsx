"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FilmFrame } from "@/components/three/film/frame";
import { TOKENS } from "@/lib/color";
import { clamp01 } from "@/lib/math";
import { panelPose, SCREEN_ORDER } from "./panels";
import { drawScreen } from "./screens";

const PANEL_W = 1.4;
const PANEL_H = PANEL_W * (320 / 512);

type Props = { frame?: RefObject<FilmFrame>; morph?: number };

// As camadas GIS viram painéis de vidro com telas de sites e sistemas, em arco diante da câmera.
export default function ScreenPanels({ frame, morph = 1 }: Props) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const faces = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const borders = useRef<(THREE.LineBasicMaterial | null)[]>([]);

  const textures = useMemo(
    () =>
      SCREEN_ORDER.map((kind) => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 320;
        drawScreen(canvas.getContext("2d")!, kind, 512, 320);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        return texture;
      }),
    [],
  );
  const plane = useMemo(() => new THREE.PlaneGeometry(PANEL_W, PANEL_H), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(plane), [plane]);

  useFrame(() => {
    const f = frame?.current;
    const m = f ? f.panelMorph : morph;
    const fold = f ? f.foldBack : 0;
    const o = f ? clamp01(m * 4) * (1 - fold) : 1;
    SCREEN_ORDER.forEach((_, i) => {
      const g = groups.current[i];
      if (!g) return;
      const pose = panelPose(i, SCREEN_ORDER.length, m, fold);
      g.position.set(...pose.position);
      g.rotation.set(...pose.rotation);
      g.scale.setScalar(Math.max(pose.scale, 0.0001));
      g.visible = o > 0.001;
      if (faces.current[i]) faces.current[i]!.opacity = 0.95 * o;
      if (borders.current[i]) borders.current[i]!.opacity = 0.8 * o;
    });
  });

  return (
    <>
      {SCREEN_ORDER.map((kind, i) => (
        <group key={kind} ref={(g) => void (groups.current[i] = g)} visible={false}>
          <mesh geometry={plane}>
            <meshBasicMaterial
              ref={(m) => void (faces.current[i] = m)}
              map={textures[i]}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <lineSegments geometry={edges}>
            <lineBasicMaterial ref={(m) => void (borders.current[i] = m)} color={TOKENS.brandLight} transparent />
          </lineSegments>
        </group>
      ))}
    </>
  );
}
