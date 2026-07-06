import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function twoPointersPairSum(input: number[], target: number): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const sum = a[lo] + a[hi];
    tb.push(snapshot(a), {
      narration: `a[${lo}] + a[${hi}] = ${sum} (target ${target})`,
      highlights: [{ indices: [lo, hi], role: "active" }],
      pseudoLine: 1, meta: { sum },
    });
    if (sum === target) return tb.build([lo, hi]);
    if (sum < target) lo++; else hi--;
  }
  return tb.build([]);
}
