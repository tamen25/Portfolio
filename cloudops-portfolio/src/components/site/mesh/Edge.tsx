"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Mesh } from "three";
import type { Vec3 } from "@/lib/mesh-layout";

const BASE = "#30363d";
const ACTIVE = "#4d9fff";
const PACKET = "#7db8ff";

export function Edge({ from, to, active, seed }: { from: Vec3; to: Vec3; active: boolean; seed: number }) {
  const packet = useRef<Mesh>(null);
  const a = new Vector3(...from);
  const b = new Vector3(...to);

  useFrame((state) => {
    if (!packet.current) return;
    // t in [0,1) loops; seed offsets each edge so packets don't move in lockstep.
    const t = (state.clock.elapsedTime * 0.35 + seed * 0.17) % 1;
    packet.current.position.lerpVectors(a, b, t);
  });

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...from, ...to]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={active ? ACTIVE : BASE} transparent opacity={active ? 0.9 : 0.4} />
      </line>
      <mesh ref={packet}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color={PACKET} toneMapped={false} />
      </mesh>
    </group>
  );
}
