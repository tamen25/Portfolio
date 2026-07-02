import Image from "next/image";
import { photoById } from "@/lib/photos";
import { Reveal } from "./Reveal";

/**
 * Moon phase drawn with a shadow disc slid across the lit disc; `shift` is
 * 0 (new) to 1 (full), `dir` flips which limb stays lit.
 */
function Moon({
  shift,
  dir = 1,
  large = false,
}: {
  shift: number;
  dir?: 1 | -1;
  large?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={large ? "h-8 w-8" : "h-5 w-5"}
      aria-hidden
    >
      <circle cx="16" cy="16" r="10" fill="#e8e6e1" fillOpacity="0.85" />
      <circle cx={16 - 20 * shift * dir} cy="16" r="10" fill="#07090c" />
      <circle
        cx="16"
        cy="16"
        r="10"
        fill="none"
        stroke="#e8e6e1"
        strokeOpacity="0.35"
      />
    </svg>
  );
}

export function Experiences() {
  const tall = photoById("spiti-langza-buddha");
  const wide = photoById("iceland-day-7-aurora");
  const small = photoById("moon-moonhdr");

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-36">
      <Reveal className="flex flex-col items-center text-center">
        <div className="flex items-center gap-4" aria-hidden>
          <Moon shift={0.25} />
          <Moon shift={0.6} />
          <Moon shift={1} large />
          <Moon shift={0.6} dir={-1} />
          <Moon shift={0.25} dir={-1} />
        </div>
        <h2 className="mt-6 font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Made in the field
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-14 md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-5">
          <p className="max-w-[58ch] leading-relaxed text-overcast">
            A photograph of a place should feel like standing in it. That
            takes time on the ground: scouting in flat light, coming back
            when the weather turns, sleeping in the car because the forecast
            says the cloud will break at five.
          </p>
          <p className="mt-5 max-w-[58ch] leading-relaxed text-overcast">
            Most frames here took two or three visits; a few took years. The
            moon phases above are not decoration. The night work runs on
            them, and the calendar is planned around the dark half of the
            month.
          </p>
        </Reveal>

        <Reveal className="relative pb-16 md:col-span-6 md:col-start-7" delay={0.1}>
          <div className="w-3/5 rotate-[-2deg] rounded-xl bg-snowlight/5 p-2 ring-1 ring-snowlight/10">
            <Image
              src={tall.src}
              alt={tall.alt}
              width={tall.width}
              height={tall.height}
              sizes="(min-width: 768px) 28vw, 60vw"
              quality={90}
              className="aspect-[4/5] w-full rounded-lg object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 rotate-[2deg] rounded-xl bg-snowlight/5 p-2 shadow-[0_24px_60px_-16px_rgba(3,4,10,0.9)] ring-1 ring-snowlight/10">
            <Image
              src={wide.src}
              alt={wide.alt}
              width={wide.width}
              height={wide.height}
              sizes="(min-width: 768px) 24vw, 50vw"
              quality={90}
              className="aspect-[3/2] w-full rounded-lg object-cover"
            />
          </div>
          <div className="absolute top-6 right-[8%] w-1/4 rotate-[4deg] rounded-lg bg-snowlight/5 p-1.5 ring-1 ring-snowlight/10">
            <Image
              src={small.src}
              alt={small.alt}
              width={small.width}
              height={small.height}
              sizes="(min-width: 768px) 12vw, 25vw"
              className="aspect-square w-full rounded-md object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
