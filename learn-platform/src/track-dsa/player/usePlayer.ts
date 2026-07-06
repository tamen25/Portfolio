"use client";
import { useCallback, useEffect, useReducer } from "react";
import type { Trace, Frame } from "../types";
import { initialPlayerState, playerReducer } from "./playerReducer";

export function usePlayer(trace: Trace) {
  const total = trace.frames.length;
  const [state, dispatch] = useReducer(
    (s: ReturnType<typeof initialPlayerState>, a: Parameters<typeof playerReducer>[1]) =>
      playerReducer(s, a, total),
    undefined,
    initialPlayerState
  );

  useEffect(() => {
    dispatch({ type: "reset" });
  }, [trace]);

  useEffect(() => {
    if (!state.playing) return;
    const ms = 600 / state.speed;
    const id = setTimeout(() => dispatch({ type: "next" }), ms);
    return () => clearTimeout(id);
  }, [state.playing, state.index, state.speed]);

  const frame: Frame = trace.frames[state.index] ?? trace.frames[0];
  return {
    index: state.index,
    frame,
    playing: state.playing,
    speed: state.speed,
    total,
    next: useCallback(() => dispatch({ type: "next" }), []),
    prev: useCallback(() => dispatch({ type: "prev" }), []),
    scrub: useCallback((i: number) => dispatch({ type: "scrub", index: i }), []),
    play: useCallback(() => dispatch({ type: "play" }), []),
    pause: useCallback(() => dispatch({ type: "pause" }), []),
    reset: useCallback(() => dispatch({ type: "reset" }), []),
    setSpeed: useCallback((sp: number) => dispatch({ type: "setSpeed", speed: sp }), []),
  };
}
