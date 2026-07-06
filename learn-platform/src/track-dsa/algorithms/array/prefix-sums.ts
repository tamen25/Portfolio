import type { Trace } from "../../types";
import { TraceBuilder, snapshot } from "../helpers";

export function prefixSums(input: number[]): Trace<number[]> {
  const a = input.slice();
  const out = new Array(a.length).fill(0);
  const tb = new TraceBuilder<number[]>();
  let running = 0;
  for (let i = 0; i < a.length; i++) {
    running += a[i];
    out[i] = running;
    tb.push(snapshot(out), {
      narration: `prefix[${i}] = ${running}`,
      highlights: [{ indices: [i], role: "cell-fill" }],
      pseudoLine: 1, meta: { running },
    });
  }
  return tb.build(out);
}
