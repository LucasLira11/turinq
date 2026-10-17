"use client";

import { usePathname } from "next/navigation";
import type { SceneId } from "@/content/routes";
import FilmScene from "./scenes/FilmScene";
import GlobeScene from "./scenes/GlobeScene";
import PanelsScene from "./scenes/PanelsScene";
import SphereScene from "./scenes/SphereScene";
import TerrainScene from "./scenes/TerrainScene";

type Props = { scene: SceneId; quality: "high" | "low" };

// Cada rota escolhe a sua cena; o canvas continua o mesmo entre as páginas.
export default function SceneSwitch({ scene, quality }: Props) {
  const pathname = usePathname();
  switch (scene) {
    case "film":
      return <FilmScene quality={quality} />;
    case "terrain":
      return <TerrainScene quality={quality} />;
    case "panels":
      return <PanelsScene quality={quality} />;
    case "globe":
      return <GlobeScene quality={quality} />;
    default:
      return <SphereScene quality={quality} small={pathname === "/contato"} />;
  }
}
