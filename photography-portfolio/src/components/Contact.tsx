import Image from "next/image";
import { SITE } from "@/lib/site";
import { photoById } from "@/lib/photos";
import { Reveal } from "./Reveal";

export function Contact() {
  const photo = photoById("iceland-day-6-stongsunset");

  return (
    <section id="contact" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 pt-36">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ridge ring-1 ring-snowlight/5 md:grid md:grid-cols-2">
          <div className="relative z-10 p-8 md:p-14">
            <h2 className="max-w-md font-serif text-4xl font-medium tracking-tight text-balance md:text-5xl">
              Bring the best light home
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-overcast">
              Most photographs here are available as archival prints, proofed
              on paper before anything ships. For print orders or commissions,
              write to me. I answer everything myself.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-9 inline-flex h-12 items-center rounded-full bg-alpenglow px-7 text-sm font-medium text-night transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start a print order
            </a>
          </div>
          <div className="relative min-h-64 md:min-h-full">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={90}
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-ridge to-transparent md:bg-gradient-to-r"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
