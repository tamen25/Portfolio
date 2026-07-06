import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function astarPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const h = (r: number, c: number) => Math.abs(r - grid.end[0]) + Math.abs(c - grid.end[1]);
  const key = (r: number, c: number) => `${r},${c}`;
  const g = new Map<string, number>([[key(grid.start[0], grid.start[1]), 0]]);
  const prev = new Map<string, [number, number]>();
  const open: [number, number, number][] = [[h(grid.start[0], grid.start[1]), grid.start[0], grid.start[1]]]; // [f, r, c]
  const visited: [number, number][] = [];
  const snap = (path: [number, number][] = []): GridState => ({
    grid,
    visited: visited.slice(),
    frontier: open.map(([, r, c]) => [r, c] as [number, number]),
    path,
  });

  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, r, c] = open.shift()!;
    visited.push([r, c]);
    tb.push(snap(), { narration: `Expand (${r}, ${c})`, highlights: [], meta: { open: open.length } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap(path), { narration: `Reached end`, highlights: [] });
      return tb.build(snap(path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      const tentative = (g.get(key(r, c)) ?? Infinity) + grid.cells[nr][nc].weight;
      if (tentative < (g.get(key(nr, nc)) ?? Infinity)) {
        g.set(key(nr, nc), tentative);
        prev.set(key(nr, nc), [r, c]);
        open.push([tentative + h(nr, nc), nr, nc]);
      }
    }
  }
  tb.push(snap([]), { narration: "No path", highlights: [] });
  return tb.build(snap([]));
}
