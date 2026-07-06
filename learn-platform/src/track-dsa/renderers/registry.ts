import type { Frame, RendererId } from "../types";
import { BarsRenderer } from "./BarsRenderer";
import { GridRenderer } from "./GridRenderer";

export const RENDERERS: Partial<Record<RendererId, (props: { frame: Frame }) => React.JSX.Element>> = {
  bars: BarsRenderer as (props: { frame: Frame }) => React.JSX.Element,
  grid: GridRenderer as (props: { frame: Frame }) => React.JSX.Element,
};
