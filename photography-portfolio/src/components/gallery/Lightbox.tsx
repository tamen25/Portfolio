"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  CaretLeft,
  CaretRight,
  InstagramLogo,
} from "@phosphor-icons/react";
import { formatExif, type Photo } from "@/lib/photos";

type Props = {
  photos: Photo[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export function Lightbox({ photos, index, onIndexChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const wheelAcc = useRef(0);
  const lastNav = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const photo = photos[index];

  const prev = () => onIndexChange((index - 1 + photos.length) % photos.length);
  const next = () => onIndexChange((index + 1) % photos.length);

  // Wheel/trackpad browses photos; accumulate small deltas so one gesture
  // moves one frame, with a cooldown against inertial scrolling.
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastNav.current < 350) return;
    const delta =
      Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    wheelAcc.current += delta;
    if (Math.abs(wheelAcc.current) > 60) {
      if (wheelAcc.current > 0) next();
      else prev();
      wheelAcc.current = 0;
      lastNav.current = now;
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

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
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 flex flex-col bg-[#030507]/[0.98] outline-none backdrop-blur-md"
    >
      <div className="flex items-center justify-between p-4">
        {photo.permalink ? (
          <a
            href={photo.permalink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View this photo on Instagram"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-overcast transition-colors hover:bg-ridge hover:text-snowlight active:scale-[0.98]"
          >
            <InstagramLogo size={20} />
            <span className="hidden sm:inline">View on Instagram</span>
          </a>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-2 text-snowlight transition-colors hover:bg-ridge active:scale-[0.98]"
        >
          <X size={24} />
        </button>
      </div>
      <div className="relative flex-1 px-4 sm:px-20">
        {/* unoptimized: serve the full-quality derivative byte-for-byte */}
        <Image
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          unoptimized
          className="object-contain"
        />
      </div>
      <button
        type="button"
        onClick={prev}
        aria-label="Previous photo"
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-night/60 p-3 text-snowlight ring-1 ring-snowlight/10 backdrop-blur-sm transition-colors hover:bg-ridge active:scale-[0.98] sm:left-5"
      >
        <CaretLeft size={28} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next photo"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-night/60 p-3 text-snowlight ring-1 ring-snowlight/10 backdrop-blur-sm transition-colors hover:bg-ridge active:scale-[0.98] sm:right-5"
      >
        <CaretRight size={28} />
      </button>
      <div className="flex justify-center p-4">
        <p className="font-exif text-xs text-overcast">
          {index + 1} / {photos.length}
          {photo.exif && ` · ${formatExif(photo.exif)}`}
          <span className="hidden sm:inline"> · scroll to browse</span>
        </p>
      </div>
    </div>
  );
}
