export type GraphNode = { id: number; x: number; y: number; label: string };
export type GraphEdge = { from: number; to: number; directed: boolean };
export type GraphState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visitedIds: number[];
  activeId: number | null;
  order?: number[];
};

export function circleLayout(n: number, labels?: string[]): GraphNode[] {
  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    nodes.push({ id: i, x: Math.cos(a), y: Math.sin(a), label: labels?.[i] ?? String(i) });
  }
  return nodes;
}

export function edgesFromAdj(adj: number[][], directed: boolean): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (let u = 0; u < adj.length; u++)
    for (const v of adj[u]) {
      const key = directed ? `${u}->${v}` : [u, v].sort((a, b) => a - b).join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from: u, to: v, directed });
    }
  return edges;
}
