"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const COUNT = 3600;
const DEV = new THREE.Color("#38bdf8");
const WARM = new THREE.Color("#d8c3a5");

function Field() {
  const points = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    function gaussian() {
      let u = 0,
        v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    for (let i = 0; i < COUNT; i++) {
      const left = i < COUNT / 2;
      let x: number, y: number, z: number;
      if (left) {
        // aligned dot-grid in 3 depth layers — code side, echoes the CSS grid
        const li = i % (COUNT / 2);
        const layer = Math.floor(li / 600);
        const cell = li % 600;
        const col = cell % 25;
        const row = Math.floor(cell / 25);
        x = -6.5 + col * 0.26 + (Math.random() - 0.5) * 0.02;
        y = -3.2 + row * 0.27 + (Math.random() - 0.5) * 0.02;
        z = -0.8 + layer * 0.8;
      } else {
        // gaussian nebula — photo side
        const r = Math.abs(gaussian()) * 2.4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        x = 3.5 + r * Math.sin(phi) * Math.cos(theta) * 1.6;
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      }
      positions.set([x, y, z], i * 3);
      const c = left ? DEV : WARM;
      const f = left ? 0.2 + Math.random() * 0.45 : 0.35 + Math.random() * 0.65;
      colors.set([c.r * f, c.g * f, c.b * f], i * 3);
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, seeds };
  }, []);

  const base = useMemo(() => positions.slice(), [positions]);

  useFrame(({ clock }) => {
    const pts = points.current;
    if (!pts) return;
    const t = clock.elapsedTime;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      const s = seeds[i];
      // lattice barely breathes; nebula drifts freely
      const amp = i < COUNT / 2 ? 0.012 : 0.055;
      arr[j] = base[j] + Math.sin(t * 0.25 + s) * amp;
      arr[j + 1] = base[j + 1] + Math.cos(t * 0.2 + s * 1.3) * amp;
    }
    attr.needsUpdate = true;
    // cursor parallax bias
    pts.rotation.y += (mouse.current.x * 0.12 - pts.rotation.y) * 0.04;
    pts.rotation.x += (-mouse.current.y * 0.08 - pts.rotation.x) * 0.04;
    // scroll dispersal
    const fade = Math.max(0, 1 - window.scrollY / window.innerHeight);
    (pts.material as THREE.PointsMaterial).opacity = 0.8 * fade;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (gl) setOk(true);
  }, []);
  if (!ok) return null;
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      gl={{ antialias: false, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      className="animate-[fadein_1.5s_ease_forwards]"
    >
      <Field />
    </Canvas>
  );
}
