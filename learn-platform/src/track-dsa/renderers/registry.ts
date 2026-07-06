import type { Frame, RendererId } from "../types";
import { BarsRenderer } from "./BarsRenderer";

export const RENDERERS: Partial<Record<RendererId, (props: { frame: Frame }) => React.JSX.Element>> = {
  bars: BarsRenderer as (props: { frame: Frame }) => React.JSX.Element,
};
