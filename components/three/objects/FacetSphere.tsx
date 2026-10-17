"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { film } from "@/components/three/film/film-store";
import type { FilmFrame } from "@/components/three/film/frame";
import { TOKENS } from "@/lib/color";
import { buildFacets, facetShade, scatterOffset } from "./facets";

const SHADES = { brand: TOKENS.brand, light: "#8C93AD", black: "#14161F" } as const;
const GAP = 0.07;
export const EXPLODE_DISTANCE = 1;
const REPEL_RADIUS = 0.22;
const REPEL_DISTANCE = 0.15;

type Props = { frame: RefObject<FilmFrame>; seed?: number };

// A esfera do logo: 80 triângulos soltos que se montam, se abrem (vista explodida) e fogem do cursor.
// A mesma posição alimenta a malha sólida e as arestas acesas (versão noturna).
export default function FacetSphere({ frame, seed = 3 }: Props) {
  const facets = useMemo(() => buildFacets(1, GAP), []);
  const scatter = useMemo(() => facets.map((_, i) => scatterOffset(i, seed)), [facets, seed]);
  const repel = useRef(new Float32Array(facets.length));
  const solid = useRef<THREE.MeshLambertMaterial>(null);
  const wire = useRef<THREE.LineBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const { mesh, lines } = useMemo(() => {
    const positions = new Float32Array(facets.length * 9);
    const colors = new Float32Array(facets.length * 9);
    const color = new THREE.Color();
    facets.forEach((f, i) => {
      color.set(SHADES[facetShade(i)]);
      [f.a, f.b, f.c].forEach((v, k) => {
        positions.set(v, i * 9 + k * 3);
        colors.set([color.r, color.g, color.b], i * 9 + k * 3);
      });
    });
    const mesh = new THREE.BufferGeometry();
    mesh.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    mesh.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    mesh.computeVertexNormals();
    const lines = new THREE.BufferGeometry();
    lines.setAttribute("position", new THREE.BufferAttribute(new Float32Array(facets.length * 18), 3));
    return { mesh, lines };
  }, [facets]);

  useEffect(
    () => () => {
      mesh.dispose();
      lines.dispose();
    },
    [mesh, lines],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const f = frame.current;
    if (!f || !group.current) return;
    const { pointer } = film.get();
    const meshPos = mesh.getAttribute("position") as THREE.BufferAttribute;
    const linePos = lines.getAttribute("position") as THREE.BufferAttribute;
    const out = 1 - f.assemble;

    facets.forEach((facet, i) => {
      // Cursor: facetas perto do ponteiro na tela se afastam ao longo da normal.
      tmp.set(...facet.centroid).applyMatrix4(group.current!.matrixWorld).project(camera);
      const near = Math.max(0, 1 - Math.hypot(tmp.x - pointer.x, tmp.y - pointer.y) / REPEL_RADIUS);
      repel.current[i] += (near * REPEL_DISTANCE - repel.current[i]) * 0.12;

      const push = f.explode * EXPLODE_DISTANCE + repel.current[i];
      const dx = (scatter[i][0] - facet.centroid[0]) * out + facet.normal[0] * push;
      const dy = (scatter[i][1] - facet.centroid[1]) * out + facet.normal[1] * push;
      const dz = (scatter[i][2] - facet.centroid[2]) * out + facet.normal[2] * push;
      const v = [facet.a, facet.b, facet.c];
      for (let k = 0; k < 3; k++) meshPos.setXYZ(i * 3 + k, v[k][0] + dx, v[k][1] + dy, v[k][2] + dz);
      for (let k = 0; k < 3; k++) {
        const p = v[k];
        const q = v[(k + 1) % 3];
        linePos.setXYZ(i * 6 + k * 2, p[0] + dx, p[1] + dy, p[2] + dz);
        linePos.setXYZ(i * 6 + k * 2 + 1, q[0] + dx, q[1] + dy, q[2] + dz);
      }
    });
    meshPos.needsUpdate = true;
    linePos.needsUpdate = true;
    mesh.computeBoundingSphere();

    if (solid.current) {
      solid.current.opacity = f.sphereOpacity;
      solid.current.visible = f.sphereOpacity > 0.001;
    }
    if (wire.current) {
      wire.current.opacity = f.wireOpacity;
      wire.current.visible = f.wireOpacity > 0.001;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={mesh} frustumCulled={false}>
        <meshLambertMaterial ref={solid} vertexColors flatShading transparent side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={lines} frustumCulled={false}>
        <lineBasicMaterial ref={wire} color={TOKENS.brandLight} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}
