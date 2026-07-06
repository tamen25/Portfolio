import type { Frame, Highlight, Lang, Trace } from "../types";

export function snapshot<T>(arr: readonly T[]): T[] {
  return arr.slice();
}

type PushOpts = {
  highlights?: Highlight[];
  narration: string;
  pseudoLine?: number;
  codeLine?: Partial<Record<Lang, number>>;
  meta?: Record<string, number>;
};

export class TraceBuilder<TState> {
  private frames: Frame<TState>[] = [];
  push(state: TState, opts: PushOpts): void {
    this.frames.push({
      state,
      highlights: opts.highlights ?? [],
      narration: opts.narration,
      pseudoLine: opts.pseudoLine,
      codeLine: opts.codeLine,
      meta: opts.meta,
    });
  }
  build(result: TState): Trace<TState> {
    return { frames: this.frames, result };
  }
}

export function isAscending(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false;
  return true;
}

export function assertSortedTrace(trace: Trace<number[]>): void {
  if (trace.frames.length === 0) throw new Error("empty trace");
  const last = trace.frames[trace.frames.length - 1].state;
  if (!isAscending(last)) throw new Error(`final frame not sorted: ${last}`);
  if (!isAscending(trace.result)) throw new Error(`result not sorted: ${trace.result}`);
}
