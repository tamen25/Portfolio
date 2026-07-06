export type HighlightRole =
  | "compare" | "swap" | "sorted" | "active" | "pivot"
  | "visited" | "frontier" | "path"
  | "current" | "inserted" | "removed"
  | "cell-fill" | "cell-read";

export type Highlight = { indices: number[]; role: HighlightRole };
export type Lang = "pseudo" | "py" | "js" | "cpp" | "java";
export type RendererId = "bars" | "grid" | "tree" | "graph";
export type Category =
  | "sorting" | "array-patterns" | "pathfinding"
  | "trees" | "graphs" | "dynamic-programming";

export type Frame<TState = unknown> = {
  state: TState;
  highlights: Highlight[];
  narration: string;
  pseudoLine?: number;
  codeLine?: Partial<Record<Lang, number>>;
  meta?: Record<string, number>;
};

export type Trace<TState = unknown> = {
  frames: Frame<TState>[];
  result: TState;
};

export type AlgorithmEntry<TInput = unknown, TState = unknown> = {
  slug: string;
  name: string;
  category: Category;
  complexity: { time: string; space: string };
  summary: string;
  run: (input: TInput) => Trace<TState>;
  renderer: RendererId;
  defaultInput: () => TInput;
  pseudocode: string[];
  code: Partial<Record<Lang, string>>;
  comparableWith?: string[];
};
