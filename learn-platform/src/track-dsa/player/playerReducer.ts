export type PlayerState = { index: number; playing: boolean; speed: number };
export type PlayerAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "scrub"; index: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "setSpeed"; speed: number };

export function initialPlayerState(): PlayerState {
  return { index: 0, playing: false, speed: 1 };
}

const clamp = (i: number, count: number) => Math.max(0, Math.min(i, count - 1));

export function playerReducer(
  state: PlayerState,
  action: PlayerAction,
  frameCount: number
): PlayerState {
  switch (action.type) {
    case "next": {
      const index = clamp(state.index + 1, frameCount);
      const playing = index >= frameCount - 1 ? false : state.playing;
      return { ...state, index, playing };
    }
    case "prev":
      return { ...state, index: clamp(state.index - 1, frameCount) };
    case "scrub":
      return { ...state, index: clamp(action.index, frameCount) };
    case "play": {
      // restart from the beginning when play is pressed at the end
      const atEnd = state.index >= frameCount - 1;
      return { ...state, playing: true, index: atEnd ? 0 : state.index };
    }
    case "pause":
      return { ...state, playing: false };
    case "reset":
      return { ...state, index: 0, playing: false };
    case "setSpeed":
      return { ...state, speed: action.speed };
  }
}
