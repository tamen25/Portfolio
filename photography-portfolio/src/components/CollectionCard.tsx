import Image from "next/image";
import Link from "next/link";
import {
  COLLECTIONS,
  collectionCover,
  photosByCollection,
  type CollectionId,
} from "@/lib/photos";
import { Reveal } from "./Reveal";

export function CollectionCard({
  id,
  className = "",
  delay = 0,
}: {
  id: CollectionId;
  className?: string;
  delay?: number;
}) {
  const collection = COLLECTIONS.find((c) => c.id === id)!;
  const cover = collectionCover(id);
  const count = photosByCollection(id).length;

  return (
    <Reveal className={className} delay={delay}>
      <Link
        href={`/portfolio#${id}`}
        className="group block rounded-xl bg-snowlight/5 p-2 ring-1 ring-snowlight/10 transition duration-300 hover:-translate-y-1 hover:ring-alpenglow/40"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex items-baseline justify-between px-2 pt-3 pb-2">
          <h3 className="font-serif text-xl font-medium tracking-tight">
            {collection.name}
          </h3>
          <p className="font-exif text-xs text-overcast">{count} frames</p>
        </div>
        <p className="px-2 pb-2 text-sm text-overcast">{collection.blurb}</p>
      </Link>
    </Reveal>
  );
}
