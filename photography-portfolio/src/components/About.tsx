import Image from "next/image";
import { photosByCollection } from "@/lib/photos";
import { Reveal } from "./Reveal";

export function About() {
  const photo = photosByCollection("coasts")[1];

  return (
    <section id="about" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 pt-32">
      <div className="grid gap-10 md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-5">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="w-full object-cover"
          />
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
          <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            About
          </h2>
          {/* Placeholder bio; Tamen supplies the real one (spec section 8). */}
          <p className="mt-6 max-w-[65ch] leading-relaxed text-overcast">
            I am Tamen Dutta. I photograph landscapes: long walks, early
            starts, and weather that rarely cooperates. Every image here was
            made in the field, on foot, waiting for the light to do what it
            was going to do anyway.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
