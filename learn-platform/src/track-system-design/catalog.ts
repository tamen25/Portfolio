import type { DesignEntry } from "./types";
import { urlShortener } from "./designs/url-shortener";

export const DESIGNS: DesignEntry[] = [urlShortener];

export function designBySlug(slug: string): DesignEntry | undefined {
  return DESIGNS.find((d) => d.slug === slug);
}
