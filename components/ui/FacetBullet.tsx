export default function FacetBullet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M0 10 L5 1 L10 10 Z" fill="currentColor" />
    </svg>
  );
}
