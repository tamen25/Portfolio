import Image from "next/image";
import Link from "next/link";
import {
  COLLECTIONS,
  COLLECTIONS_FEATURE_PHOTO,
  photosByCollection,
} from "@/lib/photos";
import { CollectionCard } from "./CollectionCard";
import { Reveal } from "./Reveal";

export function Collections() {
  const [iceland, ...others] = COLLECTIONS;
  const feature = COLLECTIONS_FEATURE_PHOTO;
  const icelandCount = photosByCollection("iceland").length;

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-36">
      <div className="relative overflow-hidden rounded-3xl bg-ridge/60 p-6 ring-1 ring-snowlight/5 md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-alpenglow/10 blur-[120px]"
        />
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-5">
            <Link
              href="/portfolio#iceland"
              className="group block rounded-xl bg-snowlight/5 p-2 ring-1 ring-snowlight/10 transition duration-300 hover:ring-alpenglow/40"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
                <Image
                  src={feature.src}
                  alt={feature.alt}
                  fill
                  sizes="(min-width: 768px) 35vw, 100vw"
                  quality={90}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-baseline justify-between px-2 pt-3 pb-2">
                <span className="font-serif text-xl font-medium tracking-tight">
                  {iceland.name}
                </span>
                <span className="font-exif text-xs text-overcast">
                  {icelandCount} frames
                </span>
              </div>
            </Link>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
            <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
              The work
            </h2>
            <p className="mt-6 max-w-[58ch] leading-relaxed text-overcast">
              Six collections. The newest and deepest is Iceland: ten
              days around the ring road in autumn, from a fresh lava field on
              Reykjanes to a last aurora over Kirkjufell. Behind it sit years
              of Himalayan roads and nights spent pointed at the sky.
            </p>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {others.map((c, i) => (
            <CollectionCard key={c.id} id={c.id} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
