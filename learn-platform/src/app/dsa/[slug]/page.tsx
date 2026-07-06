import { notFound } from "next/navigation";
import { Nav } from "@/design/components/Nav";
import { VisualizerShell } from "@/track-dsa/components/VisualizerShell";
import { CATALOG, bySlug } from "@/track-dsa/catalog";

export function generateStaticParams() {
  return CATALOG.map((e) => ({ slug: e.slug }));
}

export default async function AlgorithmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = bySlug(slug);
  if (!entry) notFound();
  return (
    <main>
      <Nav />
      <VisualizerShell slug={entry.slug} />
    </main>
  );
}
