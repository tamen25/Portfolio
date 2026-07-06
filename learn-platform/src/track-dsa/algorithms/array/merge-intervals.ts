import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

// input flat pairs [s0,e0,s1,e1,...]; result merged flat pairs.
export function mergeIntervals(input: number[]): Trace<number[]> {
  const pairs: [number, number][] = [];
  for (let i = 0; i < input.length; i += 2) pairs.push([input[i], input[i + 1]]);
  pairs.sort((x, y) => x[0] - y[0]);
  const tb = new TraceBuilder<number[]>();
  const merged: [number, number][] = [];
  for (const [s, e] of pairs) {
    const last = merged[merged.length - 1];
    if (last && s <= last[1]) {
      last[1] = Math.max(last[1], e);
      tb.push(snapshot(merged.flat()), {
        narration: `Extend to [${last[0]}, ${last[1]}]`,
        highlights: [{ indices: [merged.length - 1], role: "swap" }],
        pseudoLine: 2,
      });
    } else {
      merged.push([s, e]);
      tb.push(snapshot(merged.flat()), {
        narration: `New interval [${s}, ${e}]`,
        highlights: [{ indices: [merged.length - 1], role: "active" }],
        pseudoLine: 1,
      });
    }
  }
  return tb.build(merged.flat());
}
