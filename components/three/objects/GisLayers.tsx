"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { film, type LayerId } from "@/components/three/film/film-store";
import type { FilmFrame } from "@/components/three/film/frame";
import { TOKENS } from "@/lib/color";
import { mulberry32 } from "@/lib/math";
import { LAYER_GAP } from "./panels";
import { heightAt, riverSources, traceRiver } from "./terrain";
import { terrainY } from "./TerrainMesh";

export const LAYER_ORDER: LayerId[] = ["relevo", "hidrografia", "lotes", "pontos"];

const RIVER = "#5FA8D3";

function positions(values: number[]): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(values, 3));
  return g;
}

function reliefWire(): THREE.BufferGeometry {
  const g = new THREE.PlaneGeometry(2, 2, 40, 40);
  g.rotateX(-Math.PI / 2);
  const pos = g.getAttribute("position");
  for (let i = 0; i < pos.count; i++) pos.setY(i, terrainY(pos.getX(i), pos.getZ(i)) + 0.004);
  return new THREE.WireframeGeometry(g);
}

function rivers(): THREE.BufferGeometry {
  const pairs: number[] = [];
  for (const source of riverSources(6)) {
    const path = traceRiver(source, 220);
    for (let i = 1; i < path.length; i++) {
      const [ax, az] = path[i - 1];
      const [bx, bz] = path[i];
      pairs.push(ax, terrainY(ax, az) + 0.006, az, bx, terrainY(bx, bz) + 0.006, bz);
    }
  }
  return positions(pairs);
}

// Lotes: retângulos nas áreas mais planas e baixas, acompanhando o relevo.
function parcels(): THREE.BufferGeometry {
  const rand = mulberry32(21);
  const pairs: number[] = [];
  const CELL = 0.14;
  const GAP = 0.02;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const x0 = -0.7 + i * CELL + GAP / 2;
      const z0 = -0.7 + j * CELL + GAP / 2;
      const x1 = x0 + CELL - GAP;
      const z1 = z0 + CELL - GAP;
      if (heightAt((x0 + x1) / 2, (z0 + z1) / 2) > 0.55 || rand() < 0.3) continue;
      const corners: [number, number][] = [
        [x0, z0],
        [x1, z0],
        [x1, z1],
        [x0, z1],
      ];
      corners.forEach(([ax, az], k) => {
        const [bx, bz] = corners[(k + 1) % 4];
        pairs.push(ax, terrainY(ax, az) + 0.005, az, bx, terrainY(bx, bz) + 0.005, bz);
      });
    }
  }
  return positions(pairs);
}

function pointsOfInterest(): { dots: THREE.BufferGeometry; pins: THREE.BufferGeometry } {
  const rand = mulberry32(42);
  const dots: number[] = [];
  const pins: number[] = [];
  while (dots.length < 24 * 3) {
    const x = (rand() * 2 - 1) * 0.75;
    const z = (rand() * 2 - 1) * 0.75;
    if (Math.hypot(x, z) > 0.8 || heightAt(x, z) > 0.6) continue;
    const y = terrainY(x, z);
    dots.push(x, y + 0.07, z);
    pins.push(x, y, z, x, y + 0.07, z);
  }
  return { dots: positions(dots), pins: positions(pins) };
}

// As 4 camadas GIS do território, que se separam (vista explodida) e podem ser ligadas/desligadas.
export default function GisLayers({ frame }: { frame: RefObject<FilmFrame> }) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const materials = useRef<(THREE.Material & { opacity: number; userData: { base?: number } })[]>([]);
  const dotMaterial = useRef<THREE.PointsMaterial>(null);

  const geo = useMemo(() => ({ relief: reliefWire(), rivers: rivers(), parcels: parcels(), poi: pointsOfInterest() }), []);

  useEffect(
    () => () => {
      [geo.relief, geo.rivers, geo.parcels, geo.poi.dots, geo.poi.pins].forEach((g) => g.dispose());
    },
    [geo],
  );

  useFrame(({ clock }) => {
    const f = frame.current;
    if (!f) return;
    const { layers } = film.get();
    // somem junto com a abertura dos painéis, que nascem delas
    const o = f.terrainOpacity * (1 - f.panelMorph);
    LAYER_ORDER.forEach((id, i) => {
      const g = groups.current[i];
      if (!g) return;
      g.position.y = i * LAYER_GAP * f.layerSpread;
      g.visible = layers[id] && o > 0.001;
    });
    materials.current.forEach((m) => {
      if (m) m.opacity = o * (m.userData.base ?? 1);
    });
    if (dotMaterial.current) dotMaterial.current.size = 0.045 * (1 + 0.35 * Math.sin(clock.elapsedTime * 3));
  });

  const register = (base: number) => (m: (THREE.Material & { opacity: number }) | null) => {
    if (m && !materials.current.includes(m)) {
      m.userData.base = base;
      materials.current.push(m);
    }
  };

  return (
    <>
      <group ref={(g) => void (groups.current[0] = g)}>
        <lineSegments geometry={geo.relief}>
          <lineBasicMaterial ref={register(0.22)} color={TOKENS.brandLight} transparent depthWrite={false} />
        </lineSegments>
      </group>
      <group ref={(g) => void (groups.current[1] = g)}>
        <lineSegments geometry={geo.rivers}>
          <lineBasicMaterial ref={register(0.95)} color={RIVER} transparent depthWrite={false} />
        </lineSegments>
      </group>
      <group ref={(g) => void (groups.current[2] = g)}>
        <lineSegments geometry={geo.parcels}>
          <lineBasicMaterial ref={register(0.6)} color={TOKENS.brandLight} transparent depthWrite={false} />
        </lineSegments>
      </group>
      <group ref={(g) => void (groups.current[3] = g)}>
        <lineSegments geometry={geo.poi.pins}>
          <lineBasicMaterial ref={register(0.7)} color={TOKENS.gis} transparent depthWrite={false} />
        </lineSegments>
        <points geometry={geo.poi.dots}>
          <pointsMaterial
            ref={(m) => {
              dotMaterial.current = m;
              register(1)(m);
            }}
            color={TOKENS.gis}
            size={0.045}
            sizeAttenuation
            transparent
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}
