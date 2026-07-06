import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function slidingWindowMaxSum(input: number[], k: number): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  if (k <= 0 || k > a.length) return tb.build([0]);
  let sum = 0;
  for (let i = 0; i < k; i++) sum += a[i];
  let best = sum;
  tb.push(snapshot(a), {
    narration: `Initial window sum ${sum}`,
    highlights: [{ indices: Array.from({ length: k }, (_, i) => i), role: "active" }],
    pseudoLine: 1, meta: { sum, best },
  });
  for (let i = k; i < a.length; i++) {
    sum += a[i] - a[i - k];
    best = Math.max(best, sum);
    tb.push(snapshot(a), {
      narration: `Slide → window sum ${sum}, best ${best}`,
      highlights: [{ indices: Array.from({ length: k }, (_, j) => i - k + 1 + j), role: "active" }],
      pseudoLine: 2, meta: { sum, best },
    });
  }
  return tb.build([best]);
}
