import type { MetadataRoute } from "next";
import { ROUTES } from "@/content/routes";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return ROUTES.map((r) => ({
    url: new URL(r.path, base).toString(),
    changeFrequency: "monthly",
    priority: r.path === "/" ? 1 : 0.8,
  }));
}
