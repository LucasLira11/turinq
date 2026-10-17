"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { onIdle } from "@/lib/idle";

// O 3D fica num chunk separado e só carrega no navegador, depois do HTML.
const Stage = dynamic(() => import("./Stage"), { ssr: false });

// Espera o navegador ficar ocioso depois do primeiro paint: o texto (e o LCP) não disputa CPU
// com o three.js.
export default function StageLoader() {
  const [ready, setReady] = useState(false);
  useEffect(() => onIdle(() => setReady(true)), []);
  return ready ? <Stage /> : null;
}
