import type { HighlightRole } from "../track-dsa/types";

export const ROLE_COLOR: Record<HighlightRole, string> = {
  compare: "var(--color-compare)",
  swap: "var(--color-swap)",
  sorted: "var(--color-sorted)",
  active: "var(--color-active)",
  pivot: "var(--color-pivot)",
  visited: "var(--color-visited)",
  frontier: "var(--color-frontier)",
  path: "var(--color-path)",
  current: "var(--color-active)",
  inserted: "var(--color-sorted)",
  removed: "var(--color-pivot)",
  "cell-fill": "var(--color-swap)",
  "cell-read": "var(--color-frontier)",
};

export const DEFAULT_BAR = "var(--color-edge)";
