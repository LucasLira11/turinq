"use client";

import dynamic from "next/dynamic";

// O 3D fica num chunk separado e só carrega no navegador, depois do HTML.
const Stage = dynamic(() => import("./Stage"), { ssr: false });

export default function StageLoader() {
  return <Stage />;
}
