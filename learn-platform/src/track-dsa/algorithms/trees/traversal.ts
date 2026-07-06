import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { buildBST, layout, inorder, preorder, postorder, type TreeState } from "./tree";

export function traversal(values: number[], order: "in" | "pre" | "post"): Trace<TreeState> {
  const root = buildBST(values);
  const { nodes, edges } = layout(root);
  const out: number[] = [];
  if (order === "in") inorder(root, out);
  else if (order === "pre") preorder(root, out);
  else postorder(root, out);

  const tb = new TraceBuilder<TreeState>();
  const visitedIds: number[] = [];
  for (const value of out) {
    const node = nodes.find((n) => n.value === value && !visitedIds.includes(n.id));
    if (node) visitedIds.push(node.id);
    tb.push(
      { nodes, edges, highlightIds: visitedIds.slice() },
      {
        narration: `Visit ${value}`,
        highlights: [{ indices: node ? [node.id] : [], role: "current" }],
      }
    );
  }
  return tb.build({ nodes, edges, highlightIds: visitedIds, order: out });
}
