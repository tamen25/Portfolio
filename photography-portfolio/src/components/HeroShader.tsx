"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

class ShaderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroShader() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
    >
      {visible && (
        <ShaderBoundary>
          <MeshGradient
            colors={["#07090c", "#11151b", "#8a929e", "#d98b6a"]}
            speed={0.12}
            style={{ width: "100%", height: "100%" }}
          />
        </ShaderBoundary>
      )}
    </div>
  );
}
