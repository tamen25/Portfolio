export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-start justify-center gap-4 px-6">
      <h1 className="font-display text-6xl font-medium tracking-tight">
        Alpenglow
      </h1>
      <p className="text-overcast">Token proof page. Replaced by the hero.</p>
      <p className="font-exif text-xs text-overcast">24mm · f/8 · 1/250s · ISO 100</p>
      <div className="h-px w-64 bg-alpenglow/60" />
    </main>
  );
}
