"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh } from "three";
import type { Vec3 } from "@/lib/mesh-layout";

const BRAND = "#2dd4bf";
const BRAND_HOT = "#5eead4";
const LABEL = "#cdd9e5";

export function Node({
  position,
  label,
  seed,
  hovered,
  onHover,
}: {
  position: Vec3;
  label: string;
  seed: number;
  hovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    // Subtle out-of-phase pulse; never strobes.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2 + seed) * 0.06;
    const scale = (hovered ? 1.5 : 1) * pulse;
    mesh.current.scale.setScalar(scale);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={hovered ? BRAND_HOT : BRAND}
          emissive={hovered ? BRAND_HOT : BRAND}
          emissiveIntensity={hovered ? 1.4 : 0.6}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.34}
        color={LABEL}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.01}
        outlineColor="#0d1117"
      >
        {label}
      </Text>
    </group>
  );
}
