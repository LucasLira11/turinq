import Monogram from "@/components/brand/Monogram";
import type { SceneId } from "@/content/routes";

// Fallback sem WebGL: o fundo do ato já vem do Backdrop; aqui entra uma vinheta e o monograma.
export default function Poster({ scene }: { scene: SceneId }) {
  return (
    <div
      aria-hidden
      data-poster={scene}
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-end overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 70% 45%, transparent 0%, rgba(11,14,22,0.08) 70%)" }}
    >
      <Monogram className="mr-[6vw] h-[46vmin] w-[46vmin] text-brand opacity-20 tone-dark:text-brand-light" />
    </div>
  );
}
