import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BASE_PHOTOS,
  COLLECTION_PREFERENCE,
  COLLECTIONS_FEATURE_PHOTO,
  INSTAGRAM_PHOTOS,
  ORDER,
  OVERRIDES,
  PANORAMA_PHOTO,
  collectionLabel,
} from "@/lib/photos";
import { ArrangeBoard } from "@/components/arrange/ArrangeBoard";

export const metadata: Metadata = {
  title: "Arrange photos (dev)",
  robots: { index: false, follow: false },
};

/**
 * Dev-only curation board: drag to reorder, move photos between collections,
 * and hide them. Persists via POST /api/arrange to photo-order.json and
 * photo-overrides.json. Returns 404 in production builds.
 */
export default function ArrangePage() {
  if (process.env.NODE_ENV !== "development") notFound();

  // Every collection a photo could live in: all known ones (even empty, so
  // they work as move targets) plus any others present in the manifest.
  const collectionIds = [
    ...new Set([...COLLECTION_PREFERENCE, ...BASE_PHOTOS.map((p) => p.collection)]),
  ];

  const collections = collectionIds.map((id) => ({
    id,
    name: collectionLabel(id),
  }));

  const photos = BASE_PHOTOS.map((p) => ({
    id: p.id,
    collection: p.collection,
    src: p.src,
    alt: p.alt,
    width: p.width,
    height: p.height,
    permalink: p.permalink ?? null,
  }));

  // Current resolved photo id for each home slot, so the board can show what's
  // in place even when a slot is on its fallback (no explicit choice yet).
  const featuredResolved = {
    collectionsFeature: COLLECTIONS_FEATURE_PHOTO.id,
    wideFrame: PANORAMA_PHOTO.id,
    strip1: INSTAGRAM_PHOTOS[0]?.id ?? null,
    strip2: INSTAGRAM_PHOTOS[1]?.id ?? null,
    strip3: INSTAGRAM_PHOTOS[2]?.id ?? null,
    strip4: INSTAGRAM_PHOTOS[3]?.id ?? null,
    strip5: INSTAGRAM_PHOTOS[4]?.id ?? null,
    strip6: INSTAGRAM_PHOTOS[5]?.id ?? null,
  };

  return (
    <ArrangeBoard
      photos={photos}
      collections={collections}
      savedOrder={ORDER}
      savedOverrides={OVERRIDES}
      featuredResolved={featuredResolved}
    />
  );
}
