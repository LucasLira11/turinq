"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { sceneForPath } from "@/content/routes";
import { film } from "./film/film-store";
import Poster from "./Poster";
import { detectQualityEnv, pickQuality, QUALITY_SETTINGS, type Quality } from "./quality";
import SceneSwitch from "./SceneSwitch";
import StageErrorBoundary from "./StageErrorBoundary";

// Canvas único, fixo atrás do conteúdo e mantido entre as rotas.
export default function Stage() {
  const pathname = usePathname();
  const scene = sceneForPath(pathname);
  const [quality, setQuality] = useState<Quality>(() => pickQuality(detectQualityEnv(window.location.search)));
  const [hidden, setHidden] = useState(() => document.hidden);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    const onPointer = (e: PointerEvent) =>
      film.set({ pointer: { x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) } });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  if (quality === "static") return <Poster scene={scene} />;

  const settings = QUALITY_SETTINGS[quality];

  return (
    <StageErrorBoundary fallback={<Poster scene={scene} />}>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <Canvas
          dpr={settings.dpr}
          frameloop={hidden ? "never" : "always"}
          gl={{ alpha: true, antialias: quality === "high", powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 4.2], fov: 40, near: 0.01, far: 200 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setQuality("static");
            });
          }}
        >
          <SceneSwitch scene={scene} quality={quality} />
        </Canvas>
      </div>
    </StageErrorBoundary>
  );
}
