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
  tall = false,
  delay = 0,
}: {
  id: CollectionId;
  className?: string;
  tall?: boolean;
  delay?: number;
}) {
  const collection = COLLECTIONS.find((c) => c.id === id)!;
  const cover = collectionCover(id);
  const count = photosByCollection(id).length;

  return (
    <Reveal className={className} delay={delay}>
      <Link href={`/portfolio#${id}`} className="group block">
        <div
          className={`relative w-full overflow-hidden ${
            tall ? "aspect-[4/5]" : "aspect-[3/2]"
          }`}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="font-display text-xl font-medium tracking-tight">
            {collection.name}
          </h3>
          <p className="text-sm text-overcast">{count} photographs</p>
        </div>
        <p className="mt-1 text-sm text-overcast">{collection.blurb}</p>
      </Link>
    </Reveal>
  );
}
