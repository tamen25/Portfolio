import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function binarySearch(input: number[], target: number): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    tb.push(snapshot(a), {
      narration: `Check mid ${mid} (a[${mid}]=${a[mid]})`,
      highlights: [{ indices: [mid], role: "active" }, { indices: [lo, hi], role: "compare" }],
      pseudoLine: 2,
    });
    if (a[mid] === target) return tb.build([mid]);
    if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return tb.build([-1]);
}
