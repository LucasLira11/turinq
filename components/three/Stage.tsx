"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useThree } from "@react-three/fiber";
import { sceneForPath } from "@/content/routes";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { film } from "./film/film-store";
import Poster from "./Poster";
import { detectQualityEnv, pickQuality, QUALITY_SETTINGS, type Quality } from "./quality";
import SceneSwitch from "./SceneSwitch";
import StageErrorBoundary from "./StageErrorBoundary";

// Com movimento reduzido o canvas só desenha quando o estado do filme muda (scroll, mouse):
// nada fica girando ou flutuando sozinho.
function RenderOnChange() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => film.subscribe(() => invalidate()), [invalidate]);
  return null;
}

// Canvas único, fixo atrás do conteúdo e mantido entre as rotas.
export default function Stage() {
  const pathname = usePathname();
  const scene = sceneForPath(pathname);
  const [quality, setQuality] = useState<Quality>(() => pickQuality(detectQualityEnv(window.location.search)));
  const [hidden, setHidden] = useState(() => document.hidden);
  // Nas páginas internas, depois do hero as seções têm fundo sólido e cobrem o canvas: pausa o 3D.
  const [heroOut, setHeroOut] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    const onPointer = (e: PointerEvent) =>
      film.set({ pointer: { x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) } });
    const onScroll = () => setHeroOut(window.location.pathname !== "/" && window.scrollY > window.innerHeight * 0.9);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Sem 3D não há montagem da esfera: libera o que espera por ela (o wordmark da home).
  useEffect(() => {
    if (quality === "static") film.set({ introDone: true });
  }, [quality]);

  if (quality === "static") return <Poster scene={scene} />;

  const settings = QUALITY_SETTINGS[quality];

  return (
    <StageErrorBoundary fallback={<Poster scene={scene} />}>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <Canvas
          dpr={settings.dpr}
          frameloop={hidden || heroOut ? "never" : reduced ? "demand" : "always"}
          gl={{ alpha: true, antialias: quality === "high", powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 4.2], fov: 40, near: 0.01, far: 200 }}
          onCreated={({ gl }) => {
            // Em produção não espera a GPU confirmar cada shader (chamada síncrona que trava a thread).
            gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
            if (process.env.NODE_ENV === "development") (window as unknown as { __gl: typeof gl }).__gl = gl;
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setQuality("static");
            });
          }}
        >
          {reduced && <RenderOnChange />}
          <SceneSwitch scene={scene} quality={quality} />
        </Canvas>
      </div>
    </StageErrorBoundary>
  );
}
