// Deterministic 3D layout for the hero service mesh. Layered by BFS depth from
// api-gateway (X axis = call-flow direction), siblings spread on Y with a small
// deterministic Z offset so the graph reads as a 3D fan-out. Pure + testable;
// no WebGL, no randomness, no time dependency.
import { SERVICES, EDGES, type ServiceName } from "@/lib/mock/data";

export type Vec3 = [number, number, number];
export const ROOT: ServiceName = "api-gateway";

const X_GAP = 3.2; // spacing between depth columns
const Y_GAP = 2.2; // spacing between siblings in a column
const Z_SPREAD = 1.4; // deterministic depth jitter so it isn't planar

function computeDepths(): Map<ServiceName, number> {
  const adj = new Map<ServiceName, ServiceName[]>();
  for (const [s, t] of EDGES) {
    if (!adj.has(s)) adj.set(s, []);
    adj.get(s)!.push(t);
  }
  const depth = new Map<ServiceName, number>();
  const queue: Array<[ServiceName, number]> = [[ROOT, 0]];
  depth.set(ROOT, 0);
  while (queue.length) {
    const [n, d] = queue.shift()!;
    for (const next of adj.get(n) ?? []) {
      if (!depth.has(next)) {
        depth.set(next, d + 1);
        queue.push([next, d + 1]);
      }
    }
  }
  // Any service unreachable from root goes one column past the deepest.
  let max = 0;
  for (const d of depth.values()) max = Math.max(max, d);
  for (const svc of SERVICES) if (!depth.has(svc)) depth.set(svc, max + 1);
  return depth;
}

export function meshLayout(): Map<ServiceName, Vec3> {
  const depth = computeDepths();

  // Group services by depth to center each column vertically.
  const columns = new Map<number, ServiceName[]>();
  for (const svc of SERVICES) {
    const d = depth.get(svc)!;
    if (!columns.has(d)) columns.set(d, []);
    columns.get(d)!.push(svc);
  }

  const positions = new Map<ServiceName, Vec3>();
  const maxDepth = Math.max(...depth.values());
  const xCenter = (maxDepth * X_GAP) / 2;

  for (const [d, svcs] of columns) {
    const yCenter = ((svcs.length - 1) * Y_GAP) / 2;
    svcs.forEach((svc, i) => {
      const x = d * X_GAP - xCenter;
      const y = i * Y_GAP - yCenter;
      // Deterministic Z from a stable hash of depth+index so columns aren't flat.
      const z = ((d * 7 + i * 13) % 5) / 4 * Z_SPREAD - Z_SPREAD / 2;
      positions.set(svc, [x, y, z]);
    });
  }
  return positions;
}
