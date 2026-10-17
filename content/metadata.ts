import type { Metadata } from "next";
import { routeFor } from "./routes";

// Metadata de cada página: título e descrição também no Open Graph (prévia de links no WhatsApp e
// no LinkedIn) e URL canônica. O domínio vem do metadataBase do layout.
export function metadataFor(path: string): Metadata {
  const route = routeFor(path);
  if (!route) return {};
  return {
    // Na home o título já é a marca; nas outras o layout acrescenta " · Turinq".
    title: path === "/" ? { absolute: route.title } : route.title,
    description: route.description,
    openGraph: { title: route.title, description: route.description, url: path },
    alternates: { canonical: path },
  };
}
