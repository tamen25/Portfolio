import Image from "next/image";
import { SITE } from "@/lib/site";
import { INSTAGRAM_PHOTOS } from "@/lib/photos";
import { Reveal } from "./Reveal";

export function Instagram() {
  if (!SITE.instagram) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-32">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Recent work
        </h2>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-overcast transition-colors hover:text-snowlight"
        >
          Follow on Instagram
        </a>
      </Reveal>
      <div className="mt-10 columns-2 gap-4 md:columns-3">
        {INSTAGRAM_PHOTOS.map((p) => (
          <a
            key={p.id}
            href={SITE.instagram!}
            target="_blank"
            rel="noreferrer"
            className="group mb-4 block overflow-hidden"
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
