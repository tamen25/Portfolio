"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { formatExif, type Photo } from "@/lib/photos";

type Props = {
  photos: Photo[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export function Lightbox({ photos, index, onIndexChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const photo = photos[index];

  const prev = () => onIndexChange((index - 1 + photos.length) % photos.length);
  const next = () => onIndexChange((index + 1) % photos.length);

  useEffect(() => {
    ref.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Tab") {
      const focusables = ref.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 flex flex-col bg-night/95 outline-none backdrop-blur-sm"
    >
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 text-snowlight transition-colors hover:bg-ridge active:scale-[0.98]"
        >
          <X size={24} />
        </button>
      </div>
      <div className="relative flex-1 px-4">
        <Image
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="rounded-full p-2 text-snowlight transition-colors hover:bg-ridge active:scale-[0.98]"
        >
          <CaretLeft size={24} />
        </button>
        {photo.exif && (
          <p className="font-exif text-xs text-overcast">{formatExif(photo.exif)}</p>
        )}
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="rounded-full p-2 text-snowlight transition-colors hover:bg-ridge active:scale-[0.98]"
        >
          <CaretRight size={24} />
        </button>
      </div>
    </div>
  );
}
