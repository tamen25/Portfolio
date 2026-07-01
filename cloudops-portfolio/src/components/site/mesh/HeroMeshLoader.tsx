"use client";

// Client boundary for the WebGL hero. `dynamic(..., { ssr: false })` is only
// valid inside a Client Component in Next 15+/16, so PlatformHero (a Server
// Component) renders this thin loader instead of calling dynamic() itself. This
// keeps the Three.js bundle off the server and out of every other route.
import dynamic from "next/dynamic";

const HeroMesh = dynamic(
  () => import("./HeroMesh").then((m) => m.HeroMesh),
  { ssr: false },
);

export function HeroMeshLoader() {
  return <HeroMesh />;
}
