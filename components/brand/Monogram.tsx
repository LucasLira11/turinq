import { MONOGRAM } from "./monogram-data";

export default function Monogram({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MONOGRAM.width} ${MONOGRAM.height}`}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={MONOGRAM.d} fill="currentColor" fillRule={MONOGRAM.fillRule} />
    </svg>
  );
}
