import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { circleLayout, edgesFromAdj, type GraphState } from "./graph";

function base(adj: number[][]) {
  const nodes = circleLayout(adj.length);
  const edges = edgesFromAdj(adj, false);
  return { nodes, edges };
}

export function graphBFS(adj: number[][], start: number): Trace<GraphState> {
  const { nodes, edges } = base(adj);
  const tb = new TraceBuilder<GraphState>();
  const q = [start];
  const seen = new Set([start]);
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    tb.push(
      { nodes, edges, visitedIds: order.slice(), activeId: u },
      { narration: `Visit ${u}`, highlights: [{ indices: [u], role: "current" }] }
    );
    for (const v of adj[u]) if (!seen.has(v)) {
      seen.add(v);
      q.push(v);
    }
  }
  return tb.build({ nodes, edges, visitedIds: order, activeId: null, order });
}

export function graphDFS(adj: number[][], start: number): Trace<GraphState> {
  const { nodes, edges } = base(adj);
  const tb = new TraceBuilder<GraphState>();
  const seen = new Set<number>();
  const order: number[] = [];
  (function dfs(u: number) {
    seen.add(u);
    order.push(u);
    tb.push(
      { nodes, edges, visitedIds: order.slice(), activeId: u },
      { narration: `Visit ${u}`, highlights: [{ indices: [u], role: "current" }] }
    );
    for (const v of adj[u]) if (!seen.has(v)) dfs(v);
  })(start);
  return tb.build({ nodes, edges, visitedIds: order, activeId: null, order });
}
