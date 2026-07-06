import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { buildBST, layout, type TreeState } from "./tree";

export function bstInsertSequence(values: number[]): Trace<TreeState> {
  const tb = new TraceBuilder<TreeState>();
  for (let i = 1; i <= values.length; i++) {
    const root = buildBST(values.slice(0, i));
    const { nodes, edges } = layout(root);
    const lastId = nodes.find((n) => n.value === values[i - 1])?.id;
    tb.push(
      { nodes, edges, highlightIds: lastId !== undefined ? [lastId] : [] },
      {
        narration: `Insert ${values[i - 1]}`,
        highlights: lastId !== undefined ? [{ indices: [lastId], role: "inserted" }] : [],
      }
    );
  }
  const { nodes, edges } = layout(buildBST(values));
  return tb.build({ nodes, edges, highlightIds: [] });
}
