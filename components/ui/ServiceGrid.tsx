import type { Tone } from "@/content/routes";
import type { Service } from "@/content/services";
import FacetBullet from "./FacetBullet";

export default function ServiceGrid({ items, tone }: { items: Service[]; tone: Tone }) {
  const dark = tone === "dark";
  return (
    <ul className="grid gap-px overflow-hidden rounded-3xl border border-current/10 bg-current/10 sm:grid-cols-2">
      {items.map((s) => (
        <li key={s.title} className={`p-8 ${dark ? "bg-night-surface" : "bg-paper"}`}>
          <FacetBullet className={dark ? "text-gis" : "text-brand"} />
          <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
          <p className={`mt-3 leading-relaxed ${dark ? "text-white/75" : "text-ink/75"}`}>{s.description}</p>
        </li>
      ))}
    </ul>
  );
}
