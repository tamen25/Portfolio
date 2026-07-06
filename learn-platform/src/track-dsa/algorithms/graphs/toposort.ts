import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { circleLayout, edgesFromAdj, type GraphState } from "./graph";

export function topoSort(adj: number[][]): Trace<GraphState> {
  const nodes = circleLayout(adj.length);
  const edges = edgesFromAdj(adj, true);
  const tb = new TraceBuilder<GraphState>();
  const indeg = new Array(adj.length).fill(0);
  for (const outs of adj) for (const v of outs) indeg[v]++;
  const q: number[] = [];
  for (let i = 0; i < adj.length; i++) if (indeg[i] === 0) q.push(i);
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    tb.push(
      { nodes, edges, visitedIds: order.slice(), activeId: u },
      { narration: `Emit ${u} (in-degree 0)`, highlights: [{ indices: [u], role: "current" }] }
    );
    for (const v of adj[u]) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return tb.build({ nodes, edges, visitedIds: order, activeId: null, order });
}
