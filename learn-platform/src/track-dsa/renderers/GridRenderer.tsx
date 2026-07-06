"use client";
import type { Frame } from "../types";
import type { GridState } from "../algorithms/pathfinding/grid";
import { Stage } from "./Stage";

export function GridRenderer({ frame }: { frame: Frame<GridState> }) {
  const { grid, visited, frontier, path } = frame.state;
  const vSet = new Set(visited.map(([r, c]) => `${r},${c}`));
  const fSet = new Set(frontier.map(([r, c]) => `${r},${c}`));
  const pSet = new Set(path.map(([r, c]) => `${r},${c}`));

  const isStart = (r: number, c: number) => r === grid.start[0] && c === grid.start[1];
  const isEnd = (r: number, c: number) => r === grid.end[0] && c === grid.end[1];
  const color = (r: number, c: number, wall: boolean) => {
    if (wall) return "var(--color-edge)";
    if (isStart(r, c)) return "var(--color-sorted)";
    if (isEnd(r, c)) return "var(--color-pivot)";
    if (pSet.has(`${r},${c}`)) return "var(--color-path)";
    if (fSet.has(`${r},${c}`)) return "var(--color-frontier)";
    if (vSet.has(`${r},${c}`)) return "var(--color-visited)";
    return "var(--color-stage)";
  };

  return (
    <Stage label="grid">
      <div
        className="grid aspect-square h-full max-h-[540px] w-auto gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))` }}
      >
        {grid.cells.flat().map((cell) => {
          const endpoint = isStart(cell.r, cell.c) || isEnd(cell.r, cell.c);
          const onPath = pSet.has(`${cell.r},${cell.c}`);
          return (
            <div
              key={`${cell.r},${cell.c}`}
              className="rounded-[3px] transition-colors duration-150"
              style={{
                backgroundColor: color(cell.r, cell.c, cell.wall),
                boxShadow: endpoint || onPath ? `0 0 8px ${color(cell.r, cell.c, cell.wall)}` : "none",
                border: cell.wall ? "none" : "1px solid rgba(255,255,255,0.03)",
              }}
            />
          );
        })}
      </div>
    </Stage>
  );
}
