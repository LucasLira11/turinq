"use client";

import { useEffect, useState } from "react";
import Wordmark from "@/components/brand/Wordmark";
import { useFilm } from "@/components/three/film/film-store";

// O "turinq" se desdobra quando a esfera termina de montar. Se o 3D não carregar,
// desdobra mesmo assim depois de 5 s.
export default function HeroWordmark() {
  const introDone = useFilm((s) => s.introDone);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return <Wordmark animate play={introDone || timedOut} tagline className="w-56 text-[13px] text-brand" />;
}
