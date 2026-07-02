"use client";

import { useEffect, useRef } from "react";

// min_resolution prunes every low rendition from the manifest itself, so
// even native-HLS players (Safari) can only play the 1708x1212 top tier.
const STREAM =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8?min_resolution=1080p";

/** Absolutely-centered, cover-fitted background video fed by hls.js. */
export default function HlsVideo({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    (async () => {
      const { default: Hls } = await import("hls.js");
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls({
          // Default estimate is ~500 kbps, which starts playback on the
          // 360p rendition of this stream. Full-screen background video
          // upscaled from 360p is visibly soft, so bias high.
          abrEwmaDefaultEstimate: 8_000_000,
        });
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const h = hls;
          if (!h) return;
          // Lock to the sharpest rendition; a moment of buffering is far
          // less visible than an upscaled low-bitrate loop.
          let top = 0;
          h.levels.forEach((level, i) => {
            const best = h.levels[top];
            if (
              level.height > best.height ||
              (level.height === best.height && level.bitrate > best.bitrate)
            ) {
              top = i;
            }
          });
          h.currentLevel = top;
        });
        hls.loadSource(STREAM);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS (Safari) picks renditions itself; no override API.
        video.src = STREAM;
      }
    })();

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={`absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover ${className}`}
    />
  );
}
