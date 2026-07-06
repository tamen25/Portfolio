import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { circleLayout, type GraphState, type GraphEdge } from "./graph";

export function unionFind(n: number, unions: [number, number][]): Trace<GraphState> {
  const nodes = circleLayout(n);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const tb = new TraceBuilder<GraphState>();
  const edges: GraphEdge[] = [];
  for (const [a, b] of unions) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) {
      parent[ra] = rb;
      edges.push({ from: a, to: b, directed: false });
    }
    tb.push(
      { nodes, edges: edges.slice(), visitedIds: [a, b], activeId: b },
      { narration: `Union(${a}, ${b}) → root ${find(b)}`, highlights: [{ indices: [a, b], role: "swap" }], pseudoLine: 2 }
    );
  }
  const root = Array.from({ length: n }, (_, i) => find(i));
  return tb.build({ nodes, edges, visitedIds: [], activeId: null, order: root });
}
