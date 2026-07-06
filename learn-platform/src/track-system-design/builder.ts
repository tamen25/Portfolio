import type { Trace } from "../track-dsa/types";
import type { ArchComponent, ArchEdge, ArchState } from "./types";

/**
 * Assembles an architecture diagram one reveal at a time. Each `step` adds
 * components and/or edges and emits a frame holding everything revealed so
 * far, so the player animates the design building up. `stepLine` points the
 * side panel at the matching line in the entry's `steps` list.
 */
export class ArchBuilder {
  private comps: ArchComponent[] = [];
  private edges: ArchEdge[] = [];
  private frames: Trace<ArchState>["frames"] = [];

  step(
    opts: {
      add?: ArchComponent[];
      connect?: ArchEdge[];
      focus?: string | null;
      narration: string;
      stepLine: number;
    }
  ): this {
    if (opts.add) this.comps = [...this.comps, ...opts.add];
    if (opts.connect) this.edges = [...this.edges, ...opts.connect];
    this.frames.push({
      state: {
        components: this.comps.slice(),
        edges: this.edges.slice(),
        focusId: opts.focus ?? null,
      },
      highlights: [],
      narration: opts.narration,
      pseudoLine: opts.stepLine,
    });
    return this;
  }

  build(): Trace<ArchState> {
    const last = this.frames[this.frames.length - 1];
    return {
      frames: this.frames,
      result: last
        ? last.state
        : { components: [], edges: [], focusId: null },
    };
  }
}
