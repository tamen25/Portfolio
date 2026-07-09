# 23 OSCILLA — build notes

## Concept
The website IS the instrument. 8-key synth (A–K = C4–E5), two detuned oscillators per
voice (+7 cents), 4 waveforms, synthetic convolution reverb (noise-burst impulse,
dry/wet SPACE slider). The entire background is the sound drawn live from one
AnalyserNode: yellow time-domain waveform with phosphor afterglow (translucent wash
instead of clear), teal harmonic bars from FFT below the keybed. Keys: pointer + real
keyboard, polyphonic chords, visual down-state.

## Type / palette
Unbounded (display) + Sora. Oscilloscope void #070A0D · signal yellow #F2E94E ·
ghost teal #3AF2C5.

## Iteration log
- PASS 1: chord A+G+K verified live — waveform shows the triad's composite,
  FFT bars show real partials, keys light. (Headless browser allowed the AudioContext.)
- PASS 2: afterglow tuned (.16 wash) so trails read as phosphor, not smear; idle
  waveform stays visible at low amplitude so the page never looks dead.
- PASS 3: mobile 4×2 keybed grid; touch = pointerdown per key with capture;
  reduced-motion note: visuals ARE the sound, so they remain (user-initiated).
- STATUS: BUILT + QA'd locally. Deploy blocked (Netlify credits).
