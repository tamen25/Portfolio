import Image from "next/image";
import { pinnedPhoto } from "@/lib/photos";
import { Reveal } from "./Reveal";

const STRIP = [
  { photo: pinnedPhoto("iceland-day-3-skoga", 0), className: "hidden w-40 lg:block" },
  { photo: pinnedPhoto("iceland-day-4-dbeach", 1), className: "hidden w-52 sm:block" },
  { photo: pinnedPhoto("iceland-aurora-kirk", 2), className: "w-full max-w-[26rem]", center: true },
  { photo: pinnedPhoto("spiti-key-1", 3), className: "hidden w-52 sm:block" },
  { photo: pinnedPhoto("sikkim-ravangla-buddha", 4), className: "hidden w-40 lg:block" },
];

export function Testimonials() {
  return (
    <section className="overflow-hidden pt-36">
      <Reveal>
        <h2 className="text-center font-serif text-4xl font-medium tracking-tight md:text-5xl">
          What clients say
        </h2>
      </Reveal>

      <Reveal className="mt-14 flex items-center justify-center gap-4 px-6" delay={0.1}>
        {STRIP.map(({ photo, className, center }) => (
          <div
            key={photo.id}
            className={`shrink-0 overflow-hidden rounded-xl ring-1 ${
              center
                ? "shadow-[0_32px_90px_-24px_rgba(3,4,10,0.95)] ring-snowlight/20"
                : "ring-snowlight/10"
            } ${className}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes={center ? "416px" : "208px"}
              quality={center ? 90 : 75}
              className={
                center
                  ? "aspect-[16/10] w-full object-cover"
                  : "aspect-[4/5] w-full object-cover opacity-60 grayscale"
              }
            />
          </div>
        ))}
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-xl px-6 text-center" delay={0.15}>
        <span
          aria-hidden
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-alpenglow/15 font-serif text-base text-alpenglow ring-1 ring-alpenglow/30"
        >
          NH
        </span>
        <blockquote className="mt-6">
          <p className="font-serif text-lg leading-relaxed text-snowlight/90 italic md:text-xl">
            &ldquo;We hung &lsquo;Aurora over Kirkjufell&rsquo; as a wide print
            in our Bergen office. Tamen proofed three papers before letting us
            commit, and the final piece reads like weather through a window.
            Visitors stop in front of it.&rdquo;
          </p>
          <footer className="mt-5 font-exif text-xs tracking-wide text-overcast">
            Nils Haugen · print client, 2025
          </footer>
        </blockquote>
      </Reveal>
    </section>
  );
}
