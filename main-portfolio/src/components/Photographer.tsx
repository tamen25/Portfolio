import Image from "next/image";
import manifest from "@/lib/photo-manifest.json";
import { PHOTOS_URL, SITE } from "@/lib/site";
import Reveal from "./Reveal";

type Frame = {
  id: string;
  src: string;
  width: number;
  height: number;
  caption: string;
  hero?: boolean;
  /** Instagram post URL on synced frames; falls back to the photo site. */
  permalink?: string | null;
};

const gallery = (manifest as Frame[]).filter((p) => !p.hero);

export default function Photographer() {
  return (
    <section id="photographer" className="scroll-mt-14 border-y border-line/60 bg-warm/20 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="label-mono mb-4">03 — photographer</p>
          <h2 className="font-display text-4xl sm:text-5xl">
            Frames <span className="italic text-photo">from the field</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg2">{SITE.bio.photo}</p>
        </Reveal>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {gallery.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <a
                href={p.permalink || PHOTOS_URL}
                className="group relative block overflow-hidden rounded-lg border border-line/60"
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between gap-3 p-4">
                    <span className="font-mono text-xs text-fg">{p.caption}</span>
                    <span className="shrink-0 font-mono text-xs text-photo">view ↗</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <a
            href={PHOTOS_URL}
            className="group flex flex-col gap-4 rounded-xl border border-line bg-surface p-8 transition-colors hover:border-photo/60 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-display text-2xl sm:text-3xl">The full gallery lives here</h3>
              <p className="mt-2 font-mono text-xs text-fg3">
                iceland · spiti · leh · sikkim · deep sky · moon
              </p>
            </div>
            <span className="font-mono text-sm text-photo transition-transform duration-300 group-hover:translate-x-1">
              photography.tamendutta.com ↗
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
