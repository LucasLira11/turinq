import type { ReactNode } from "react";

// Contêiner do plano-sequência. A Task 5 liga o scroll ao 3D.
export default function FilmScroll({ children }: { children: ReactNode }) {
  return (
    <div id="film" className="relative">
      {children}
    </div>
  );
}
