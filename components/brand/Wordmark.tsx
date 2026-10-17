import { WORDMARK } from "./wordmark-data";

const last = WORDMARK.letters[WORDMARK.letters.length - 1];
const TOTAL_WIDTH = last.x + last.width;

type Props = {
  animate?: boolean;
  // Com `animate`, o wordmark fica escondido até `play` virar true e então se desdobra.
  play?: boolean;
  tagline?: boolean;
  className?: string;
};

// "turinq" com as formas exatas do logo oficial. Cada letra é um <svg> próprio para poder dobrar
// em 3D (rotateX) como papel se desdobrando — animação em CSS (globals.css), que respeita o
// prefers-reduced-motion sozinha.
export default function Wordmark({ animate = false, play = true, tagline = false, className = "" }: Props) {
  const waiting = animate && !play;
  const playing = animate && play;

  return (
    <div className={className} style={waiting ? { visibility: "hidden" } : undefined}>
      <div
        role="img"
        aria-label="turinq"
        className="relative w-full [perspective:800px]"
        style={{ aspectRatio: `${TOTAL_WIDTH} / ${WORDMARK.height}` }}
      >
        {WORDMARK.letters.map((l, i) => (
          <svg
            key={l.char}
            aria-hidden
            viewBox={`0 0 ${l.width} ${WORDMARK.height}`}
            className={`absolute top-0 h-full ${playing ? "origami-letter" : ""}`}
            style={{
              left: `${(l.x / TOTAL_WIDTH) * 100}%`,
              width: `${(l.width / TOTAL_WIDTH) * 100}%`,
              animationDelay: `${i * 80}ms`,
            }}
          >
            <path d={l.d} fill="currentColor" fillRule={WORDMARK.fillRule} />
          </svg>
        ))}
      </div>
      {tagline && (
        <p
          className={`mt-[0.9em] text-[0.62em] font-bold tracking-[0.32em] whitespace-nowrap uppercase ${playing ? "origami-tagline" : ""}`}
        >
          Tecnologia e Desenvolvimento
        </p>
      )}
    </div>
  );
}
