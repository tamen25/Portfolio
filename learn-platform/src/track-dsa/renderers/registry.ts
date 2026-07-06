import type { Frame, RendererId } from "../types";
import { BarsRenderer } from "./BarsRenderer";
import { GridRenderer } from "./GridRenderer";
import { TreeRenderer } from "./TreeRenderer";
import { GraphRenderer } from "./GraphRenderer";

export const RENDERERS: Partial<Record<RendererId, (props: { frame: Frame }) => React.JSX.Element>> = {
  bars: BarsRenderer as (props: { frame: Frame }) => React.JSX.Element,
  grid: GridRenderer as (props: { frame: Frame }) => React.JSX.Element,
  tree: TreeRenderer as (props: { frame: Frame }) => React.JSX.Element,
  graph: GraphRenderer as (props: { frame: Frame }) => React.JSX.Element,
};
