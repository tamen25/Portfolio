import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function bubbleSort(input: number[]): Trace<number[]> {
  const a = input.slice();
  const tb = new TraceBuilder<number[]>();
  let comparisons = 0, swaps = 0;
  tb.push(snapshot(a), { narration: "Start", pseudoLine: 0, meta: { comparisons, swaps } });
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      tb.push(snapshot(a), {
        narration: `Compare ${a[j]} and ${a[j + 1]}`,
        highlights: [{ indices: [j, j + 1], role: "compare" }],
        pseudoLine: 2, codeLine: { py: 2 }, meta: { comparisons, swaps },
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        tb.push(snapshot(a), {
          narration: `Swap → ${a[j]}, ${a[j + 1]}`,
          highlights: [{ indices: [j, j + 1], role: "swap" }],
          pseudoLine: 3, codeLine: { py: 3 }, meta: { comparisons, swaps },
        });
      }
    }
    tb.push(snapshot(a), {
      narration: `Position ${a.length - i - 1} settled`,
      highlights: [{ indices: [a.length - i - 1], role: "sorted" }],
      pseudoLine: 4, meta: { comparisons, swaps },
    });
  }
  return tb.build(a);
}
