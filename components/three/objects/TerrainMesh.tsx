"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FilmFrame } from "@/components/three/film/frame";
import { TOKENS } from "@/lib/color";
import { heightAt } from "./terrain";

export const TERRAIN_HEIGHT = 0.32;
// Altura do relevo no ponto (x, z); o pequeno respiro evita brigar com o topo do globo em y = 0.
export const terrainY = (x: number, z: number) => heightAt(x, z) * TERRAIN_HEIGHT + 0.012;

const vertexShader = /* glsl */ `
  attribute float aHeight;
  varying float vHeight;
  varying vec2 vXZ;
  void main() {
    vHeight = aHeight;
    vXZ = position.xz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Curvas de nível: linha fina a cada 1/18 da altura e linha mestra a cada 5. `uScan` é uma faixa
// de brilho que a página de geotecnologia move com o mouse.
const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uLine;
  uniform float uOpacity;
  uniform float uScan;
  varying float vHeight;
  varying vec2 vXZ;
  void main() {
    float k = vHeight * 18.0;
    float w = fwidth(k);
    float minor = 1.0 - smoothstep(0.0, w * 1.4, abs(fract(k - 0.5) - 0.5));
    float major = 1.0 - smoothstep(0.0, w * 1.8, abs(fract(k / 5.0 - 0.5) - 0.5) * 5.0);
    float scan = 1.0 - smoothstep(0.0, 0.07, abs(vXZ.x - uScan));
    vec3 base = uBase * (0.6 + vHeight * 0.9);
    vec3 color = mix(base, uLine, clamp(minor * 0.55 + major * 0.45 + scan * 0.5, 0.0, 1.0));
    float edge = smoothstep(1.0, 0.62, length(vXZ));
    gl_FragColor = vec4(color, uOpacity * edge);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type Props = { frame?: RefObject<FilmFrame>; segments: number; opacity?: number; scan?: RefObject<number> };

// Relevo 3D do território com curvas de nível acesas.
export default function Terrain({ frame, segments, opacity = 1, scan }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(2, 2, segments, segments);
    g.rotateX(-Math.PI / 2);
    const pos = g.getAttribute("position");
    const heights = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      heights[i] = heightAt(x, z);
      pos.setY(i, terrainY(x, z));
    }
    g.setAttribute("aHeight", new THREE.BufferAttribute(heights, 1));
    g.computeVertexNormals();
    return g;
  }, [segments]);

  const uniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color(TOKENS.nightSurface) },
      uLine: { value: new THREE.Color(TOKENS.gis) },
      uOpacity: { value: 0 },
      uScan: { value: -10 },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const f = frame?.current;
    const o = f ? f.terrainOpacity * (1 - f.panelMorph) : opacity;
    const m = material.current;
    if (m) {
      m.uniforms.uOpacity.value = o;
      if (scan) m.uniforms.uScan.value = scan.current;
    }
    if (mesh.current) mesh.current.visible = o > 0.001;
  });

  return (
    <mesh ref={mesh} geometry={geometry} visible={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
