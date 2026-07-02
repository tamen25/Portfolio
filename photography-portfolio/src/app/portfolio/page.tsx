import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { HorizonRule } from "@/components/HorizonRule";
import { CollectionNav } from "@/components/gallery/CollectionNav";
import { PortfolioGallery } from "@/components/gallery/PortfolioGallery";

export const metadata: Metadata = {
  title: "Portfolio | Tamen Dutta",
  description: "Landscape photography collections by Tamen Dutta.",
};

export default function PortfolioPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pt-32">
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-6xl">
          Portfolio
        </h1>
        <p className="mt-4 max-w-md text-overcast">
          Six collections, from Iceland to the Himalaya to the night sky,
          photographed over the last several years.
        </p>
        <HorizonRule className="mt-10" />
        <CollectionNav />
        <PortfolioGallery />
      </main>
      <Footer />
    </>
  );
}
