import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import type { TreeState, TreeNode, Edge } from "./tree";

function heapLayout(a: number[]): { nodes: TreeNode[]; edges: Edge[] } {
  const nodes: TreeNode[] = a.map((v, i) => ({ id: i, value: v, x: i, y: Math.floor(Math.log2(i + 1)) }));
  const edges: Edge[] = [];
  for (let i = 0; i < a.length; i++) {
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < a.length) edges.push([i, l]);
    if (r < a.length) edges.push([i, r]);
  }
  return { nodes, edges };
}

export function heapSiftDemo(values: number[]): Trace<TreeState> {
  const a = values.slice();
  const tb = new TraceBuilder<TreeState>();
  const n = a.length;
  const emit = (ids: number[], narration: string) => {
    const { nodes, edges } = heapLayout(a);
    tb.push(
      { nodes, edges, highlightIds: ids },
      { narration, highlights: ids.map((id) => ({ indices: [id], role: "swap" as const })) }
    );
  };
  emit([], "Build max-heap");
  for (let i = (n >> 1) - 1; i >= 0; i--) {
    let root = i;
    while (true) {
      let largest = root;
      const l = 2 * root + 1, r = 2 * root + 2;
      if (l < n && a[l] > a[largest]) largest = l;
      if (r < n && a[r] > a[largest]) largest = r;
      if (largest === root) break;
      [a[root], a[largest]] = [a[largest], a[root]];
      emit([root, largest], `Sift-down: swap ${a[largest]} and ${a[root]}`);
      root = largest;
    }
  }
  const { nodes, edges } = heapLayout(a);
  return tb.build({ nodes, edges, highlightIds: [] });
}
