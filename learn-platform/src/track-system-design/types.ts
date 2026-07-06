import type { Frame, Trace } from "../track-dsa/types";

// component families — each drives a distinct box color / label affix
export type ComponentKind =
  | "client"
  | "cdn"
  | "gateway"
  | "service"
  | "cache"
  | "db"
  | "queue"
  | "storage";

export type ArchComponent = {
  id: string;
  label: string;
  kind: ComponentKind;
  x: number; // grid column, 0..1
  y: number; // grid row, 0..1
};

export type ArchEdge = { from: string; to: string; label?: string };

// what the renderer draws for a given frame: everything revealed so far
export type ArchState = {
  components: ArchComponent[];
  edges: ArchEdge[];
  focusId: string | null; // the component introduced this step, glows
};

// a written section shown in the side panel (requirements, API, tradeoffs…)
export type DesignNote = { heading: string; body: string[] };

export type DesignEntry = {
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  scale: string; // headline capacity figure, e.g. "100M links · 10:1 read"
  build: () => Trace<ArchState>; // the step-by-step assembly
  steps: string[]; // one line per build step, mirrors DSA pseudocode panel
  notes: DesignNote[]; // static reference sections
};

export type { Frame };
