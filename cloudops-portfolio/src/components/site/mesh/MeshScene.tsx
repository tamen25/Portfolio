"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import { meshLayout } from "@/lib/mesh-layout";
import { SERVICES, EDGES, type ServiceName } from "@/lib/mock/data";
import { Node } from "./Node";
import { Edge } from "./Edge";

export function MeshScene() {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState<ServiceName | null>(null);
  const positions = useMemo(() => meshLayout(), []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 8]} intensity={1.2} color="#5eead4" />
      <group ref={group}>
        {EDGES.map(([s, t], i) => (
          <Edge
            key={`${s}->${t}`}
            from={positions.get(s)!}
            to={positions.get(t)!}
            active={hovered === s || hovered === t}
            seed={i}
          />
        ))}
        {SERVICES.map((svc, i) => (
          <Node
            key={svc}
            position={positions.get(svc)!}
            seed={i * 1.7}
            hovered={hovered === svc}
            onHover={(h) => setHovered(h ? svc : null)}
          />
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
      />
    </>
  );
}
