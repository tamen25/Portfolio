"use client";

import { useState } from "react";
import Image from "next/image";
import {
  COLLECTIONS,
  photosByCollection,
  formatExif,
  type Photo,
} from "@/lib/photos";
import { Reveal } from "@/components/Reveal";

export type ActivePhoto = { photos: Photo[]; index: number };

export function PortfolioGallery() {
  const [active, setActive] = useState<ActivePhoto | null>(null);

  return (
    <div>
      {COLLECTIONS.map((c) => {
        const photos = photosByCollection(c.id);
        return (
          <section key={c.id} id={c.id} className="scroll-mt-24 pt-20">
            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                {c.name}
              </h2>
              <p className="mt-2 text-overcast">{c.blurb}</p>
            </Reveal>
            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive({ photos, index: i })}
                  className="group mb-4 block w-full text-left focus-visible:outline-2 focus-visible:outline-alpenglow"
                >
                  <span className="block overflow-hidden">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                  {p.exif && (
                    <span className="mt-2 block font-exif text-xs text-overcast opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {formatExif(p.exif)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        );
      })}
      {/* Lightbox mounts here in Task 10, driven by `active`. */}
      {active ? null : null}
    </div>
  );
}
