import type { Trace } from "../../types";
import { TraceBuilder } from "../helpers";
import { type Grid, type GridState, neighbors, reconstruct } from "./grid";

export function dijkstraPath(grid: Grid): Trace<GridState> {
  const tb = new TraceBuilder<GridState>();
  const dist = new Map<string, number>();
  const prev = new Map<string, [number, number]>();
  const key = (r: number, c: number) => `${r},${c}`;
  const pq: [number, number, number][] = [[0, grid.start[0], grid.start[1]]]; // [dist, r, c]
  dist.set(key(grid.start[0], grid.start[1]), 0);
  const visited: [number, number][] = [];
  const snap = (path: [number, number][] = []): GridState => ({
    grid,
    visited: visited.slice(),
    frontier: pq.map(([, r, c]) => [r, c] as [number, number]),
    path,
  });

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, r, c] = pq.shift()!;
    if (d > (dist.get(key(r, c)) ?? Infinity)) continue;
    visited.push([r, c]);
    tb.push(snap(), { narration: `Settle (${r}, ${c}) at dist ${d}`, highlights: [], meta: { dist: d } });
    if (r === grid.end[0] && c === grid.end[1]) {
      const path = reconstruct(prev, grid.end);
      tb.push(snap(path), { narration: `Reached end at dist ${d}`, highlights: [] });
      return tb.build(snap(path));
    }
    for (const [nr, nc] of neighbors(grid, r, c)) {
      const nd = d + grid.cells[nr][nc].weight;
      if (nd < (dist.get(key(nr, nc)) ?? Infinity)) {
        dist.set(key(nr, nc), nd);
        prev.set(key(nr, nc), [r, c]);
        pq.push([nd, nr, nc]);
      }
    }
  }
  tb.push(snap([]), { narration: "No path", highlights: [] });
  return tb.build(snap([]));
}
