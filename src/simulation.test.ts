import { describe, expect, it } from "vitest";
import { GROW_SECONDS, TIME_SCALES, advance, counts, initialState, nightTintAlpha, plant, rabbitFrame, setTimeScale } from "./simulation";

describe("habitat simulation", () => {
  it("plants only eligible empty terrain", () => {
    const state = initialState();
    expect(plant(state, { x: 2, y: 2 })).toBe(true);
    expect(plant(state, { x: 2, y: 2 })).toBe(false);
    expect(plant(state, { x: 0, y: 0 })).toBe(false);
    expect(plant(state, { x: 8, y: 4 })).toBe(false);
    expect(plant(state, { x: 3, y: 3 })).toBe(false);
  });
  it("turns each plot into a carrot object after exactly one simulation minute", () => {
    const state = initialState(); plant(state, { x: 2, y: 2 });
    advance(state, GROW_SECONDS - 0.1); expect(counts(state).mature).toBe(0);
    advance(state, 0.1); expect(counts(state).mature).toBe(1);
  });
  it("scales elapsed time consistently", () => {
    const state = initialState(); plant(state, { x: 2, y: 2 }); setTimeScale(state, 2);
    advance(state, 30); expect(counts(state).mature).toBe(1);
  });
  it("uses every advertised scale for the same simulation clock", () => {
    for (const scale of TIME_SCALES) {
      const state = initialState(); setTimeScale(state, scale); advance(state, 1);
      expect(state.elapsed).toBe(scale);
    }
  });
  it("changes every advertised scale without resetting a growing habitat", () => {
    for (const scale of TIME_SCALES) {
      const state = initialState();
      plant(state, { x: 2, y: 2 });
      advance(state, 2);
      setTimeScale(state, scale);
      advance(state, 1);
      expect(state.elapsed).toBe(2 + scale);
      expect(counts(state).planted).toBe(1);
      expect(nightTintAlpha(state.elapsed)).toBeGreaterThan(0);
    }
  });
  it("keeps concurrent plots on independent growth clocks", () => {
    const state = initialState(); state.rabbits = []; plant(state, { x: 2, y: 2 }); advance(state, 30); plant(state, { x: 3, y: 2 });
    advance(state, 30); expect(counts(state).mature).toBe(1);
    advance(state, 30); expect(counts(state).mature).toBe(2);
  });
  it("keeps night tint readable and chooses state-driven sprite frames", () => {
    expect(nightTintAlpha(0)).toBeGreaterThan(0); expect(nightTintAlpha(0)).toBeLessThan(0.33);
    expect(rabbitFrame("idle")).toBe(0); expect(rabbitFrame("wander")).toBe(1); expect(rabbitFrame("eatCarrot")).toBe(2);
  });
  it("moves a rabbit to food and abandons an invalid target", () => {
    const state = initialState(); state.carrots = [{ x: 5, y: 5 }];
    const rabbit = state.rabbits[0]!; rabbit.x = 4; rabbit.y = 5; rabbit.state = "seekCarrot"; rabbit.target = { x: 5, y: 5 }; rabbit.stateUntil = 0;
    advance(state, 2); expect(state.carrots).toHaveLength(0); expect(["eatCarrot", "idle"]).toContain(rabbit.state);
    rabbit.state = "seekCarrot"; rabbit.target = { x: 7, y: 7 }; rabbit.stateUntil = state.elapsed; advance(state, 0.2);
    expect(rabbit.state).toBe("wander"); expect(rabbit.target).toBeUndefined();
  });
  it("returns hiding and resting rabbits to an independently chosen activity", () => {
    const state = initialState(); const rabbit = state.rabbits[0]!;
    rabbit.state = "hide"; rabbit.stateUntil = 0; advance(state, 0.1); expect(rabbit.state).not.toBe("hide");
    rabbit.state = "rest"; rabbit.stateUntil = state.elapsed; advance(state, 0.1); expect(rabbit.state).not.toBe("rest");
  });
});
