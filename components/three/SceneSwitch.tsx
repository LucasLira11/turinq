"use client";

import type { SceneId } from "@/content/routes";
import Dust from "./objects/Dust";
import { QUALITY_SETTINGS } from "./quality";

type Props = { scene: SceneId; quality: "high" | "low" };

// Cada rota escolhe a sua cena; o canvas continua o mesmo entre as páginas.
export default function SceneSwitch({ quality }: Props) {
  const settings = QUALITY_SETTINGS[quality];
  return <Dust count={settings.dust} />;
}
