import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[100dvh] flex-col items-start justify-center gap-4 px-6">
        <h1 className="font-display text-6xl font-medium tracking-tight">
          Alpenglow
        </h1>
        <p className="text-overcast">Token proof page. Replaced by the hero.</p>
      </main>
      <Footer />
    </>
  );
}
