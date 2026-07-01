"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshScene } from "./MeshScene";

// Only triggers on genuine WebGL failure (context lost / unsupported). Not a
// "degraded mode" — on success the full mesh always renders. On failure we fall
// back to nothing (the hero's existing line-grid remains visible underneath).
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroMesh() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 -z-10">
      <WebGLBoundary>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          frameloop={visible ? "always" : "never"}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <MeshScene />
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
