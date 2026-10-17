"use client";

import type { SceneId } from "@/content/routes";
import Dust from "./objects/Dust";
import { QUALITY_SETTINGS } from "./quality";
import FilmScene from "./scenes/FilmScene";

type Props = { scene: SceneId; quality: "high" | "low" };

// Cada rota escolhe a sua cena; o canvas continua o mesmo entre as páginas.
export default function SceneSwitch({ scene, quality }: Props) {
  if (scene === "film") return <FilmScene quality={quality} />;
  return <Dust count={QUALITY_SETTINGS[quality].dust} />;
}
