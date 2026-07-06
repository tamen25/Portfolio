import test from "node:test";
import assert from "node:assert/strict";
import { initialPlayerState, playerReducer } from "../src/track-dsa/player/playerReducer";

const N = 5; // frame count

test("starts at frame 0, paused", () => {
  const s = initialPlayerState();
  assert.equal(s.index, 0);
  assert.equal(s.playing, false);
});

test("step forward advances and clamps at last frame", () => {
  let s = initialPlayerState();
  for (let i = 0; i < 10; i++) s = playerReducer(s, { type: "next" }, N);
  assert.equal(s.index, N - 1);
});

test("step back clamps at 0", () => {
  let s = { index: 2, playing: false, speed: 1 };
  s = playerReducer(s, { type: "prev" }, N);
  s = playerReducer(s, { type: "prev" }, N);
  s = playerReducer(s, { type: "prev" }, N);
  assert.equal(s.index, 0);
});

test("scrub sets index within bounds", () => {
  let s = initialPlayerState();
  s = playerReducer(s, { type: "scrub", index: 3 }, N);
  assert.equal(s.index, 3);
  s = playerReducer(s, { type: "scrub", index: 99 }, N);
  assert.equal(s.index, N - 1);
});

test("play sets playing, pause clears it", () => {
  let s = initialPlayerState();
  s = playerReducer(s, { type: "play" }, N);
  assert.equal(s.playing, true);
  s = playerReducer(s, { type: "pause" }, N);
  assert.equal(s.playing, false);
});

test("reaching last frame while playing auto-pauses", () => {
  let s = { index: N - 2, playing: true, speed: 1 };
  s = playerReducer(s, { type: "next" }, N);
  assert.equal(s.index, N - 1);
  assert.equal(s.playing, false);
});

test("setSpeed updates speed", () => {
  let s = initialPlayerState();
  s = playerReducer(s, { type: "setSpeed", speed: 4 }, N);
  assert.equal(s.speed, 4);
});
