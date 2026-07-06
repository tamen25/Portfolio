import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import type { TreeState, TreeNode, Edge } from "./tree";

export function trieInsert(words: string[]): Trace<TreeState> {
  const tb = new TraceBuilder<TreeState>();
  const nodes: TreeNode[] = [{ id: 0, value: -1, x: 0, y: 0 }]; // root; value -1 sentinel
  const edges: Edge[] = [];
  const childMap = new Map<string, number>(); // `${parentId}:${char}` -> nodeId
  let idc = 1, xc = 1;

  for (const word of words) {
    let parent = 0;
    for (const ch of word) {
      const key = `${parent}:${ch}`;
      let id = childMap.get(key);
      if (id === undefined) {
        id = idc++;
        childMap.set(key, id);
        nodes.push({ id, value: ch.charCodeAt(0), x: xc++, y: (nodes.find((n) => n.id === parent)?.y ?? 0) + 1 });
        edges.push([parent, id]);
        tb.push(
          { nodes: nodes.slice(), edges: edges.slice(), highlightIds: [id] },
          { narration: `Add '${ch}' of "${word}"`, highlights: [{ indices: [id], role: "inserted" }] }
        );
      } else {
        tb.push(
          { nodes: nodes.slice(), edges: edges.slice(), highlightIds: [id] },
          { narration: `'${ch}' already present`, highlights: [{ indices: [id], role: "current" }] }
        );
      }
      parent = id;
    }
  }
  return tb.build({ nodes, edges, highlightIds: [] });
}
