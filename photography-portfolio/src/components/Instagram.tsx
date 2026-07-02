import Image from "next/image";
import { SITE } from "@/lib/site";
import { INSTAGRAM_PHOTOS, type Photo } from "@/lib/photos";
import { Reveal } from "./Reveal";

function Frame({ photo }: { photo: Photo }) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes="(min-width: 768px) 33vw, 50vw"
      quality={90}
      className="w-full rounded-md transition duration-500 group-hover:scale-[1.03]"
    />
  );
}

export function Instagram() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-36">
      <Reveal className="flex flex-col items-center text-center">
        <h2 className="font-script text-6xl text-snowlight md:text-7xl">
          Instagram
        </h2>
        <div aria-hidden className="mt-3 h-px w-28 bg-snowlight/30" />
        <p className="mt-5 text-sm text-overcast">
          {SITE.instagram
            ? "Recent frames from the field. Follow along."
            : "Recent frames from the field."}
        </p>
        {SITE.instagram && (
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-sm text-alpenglow underline-offset-4 transition-colors hover:text-snowlight hover:underline"
          >
            @{SITE.name.toLowerCase().replace(/\s+/g, "")}
          </a>
        )}
      </Reveal>
      <div className="mt-12 columns-2 gap-4 md:columns-3">
        {INSTAGRAM_PHOTOS.map((p) =>
          SITE.instagram ? (
            <a
              key={p.id}
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="group mb-4 block overflow-hidden rounded-md"
            >
              <Frame photo={p} />
            </a>
          ) : (
            <div key={p.id} className="group mb-4 overflow-hidden rounded-md">
              <Frame photo={p} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
