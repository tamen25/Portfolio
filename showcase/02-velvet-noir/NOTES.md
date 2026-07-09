# 02 VELVET NOIR — build notes

## Concept
Couture perfume house for the hours after dusk. Flagship asset-pipeline site:
Higgsfield-generated editorial imagery + a generated cinemagraph hero film
(smoke curls, flame flickers, slow push-in). GSAP scroll choreography.
Signature: La Pyramide — interactive olfactory pyramid, information-true.

## Assets (Higgsfield)
- soul_2 images: hero still (video seed), liquid macro, veiled muse, materials flat-lay, trio (×2 attempts)
- nano_banana_pro edit: label-text removal from trio
- kling3_0_turbo video: 5s cinemagraph from hero still (7.5 credits)
- Total spend: ~9 credits. All images WebP ≤140KB, video 3.3MB.

## Pinterest sweep ("dark luxury perfume editorial campaign")
Kept: smoke-behind-bottle silhouettes, materials on dark stone, candle warmth against black,
silk/velvet texture. The generated set matched and exceeded the refs.

## Type / palette
Bodoni Moda (display, italic accents) + Inter Tight (body/caps labels).
Noir #070507 · velvet #100910 · candle #E2A45B · bone #EFE7DB · gold hairlines.

## Iteration log
- PASS 1: full-page screenshot artifact discovered (captureBeyondViewport doesn't fire
  ScrollTrigger — QA below-fold with viewport screenshots + scrollIntoView). Verified real
  scroll reveals work. Hero, eau rows, pyramide all render as designed.
- PASS 2: trio image had gibberish label text (AI tell) → regenerated with no-label prompt,
  still faint text → nano_banana_pro edit pass removed labels cleanly while preserving light.
  Eau links wired to pyramid tabs.
- PASS 3 (mobile 390px): hidden <br> swallowed its space ("candleand") → space before br;
  pyramid apex clipped its TÊTE label → wider strata polygons ≤560px; letter-spacing eased.
- Verified: 0 console errors, video autoplay+loop with poster fallback, reduced-motion
  pauses film and disables reveals.
