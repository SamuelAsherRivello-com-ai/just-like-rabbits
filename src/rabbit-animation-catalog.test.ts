import { describe, expect, it } from "vitest";
import { RABBIT_ANIMATION_NAMES, createRabbitAnimationEntity, rabbitAnimationDefinitions, rabbitAnimationForState } from "./rabbit-animation-catalog";

describe("rabbit animation catalog", () => {
  it("registers every supplied 32px sprite sheet with its parsed frame count", () => {
    expect(RABBIT_ANIMATION_NAMES).toEqual(["Idle", "Run", "CarrotSkill", "LieDown", "Sleep", "Sitting", "Attack", "Hurt", "Dead"]);
    expect(rabbitAnimationDefinitions().map(({ name, source }) => ({ name, frameCount: source.kind === "sheet" ? source.columns : 0 }))).toEqual([
      { name: "Idle", frameCount: 8 }, { name: "Run", frameCount: 5 }, { name: "CarrotSkill", frameCount: 15 }, { name: "LieDown", frameCount: 2 }, { name: "Sleep", frameCount: 2 }, { name: "Sitting", frameCount: 3 }, { name: "Attack", frameCount: 7 }, { name: "Hurt", frameCount: 3 }, { name: "Dead", frameCount: 9 },
    ]);
  });

  it("keeps habitat rules independent while mapping visual states", () => {
    expect(rabbitAnimationForState("idle")).toBe("Idle");
    expect(rabbitAnimationForState("wander")).toBe("Run");
    expect(rabbitAnimationForState("eatCarrot")).toBe("CarrotSkill");
    expect(rabbitAnimationForState("hide")).toBe("LieDown");
    expect(rabbitAnimationForState("rest")).toBe("Sleep");
  });

  it("plays an ordered sprite-sheet frame sequence", () => {
    const animation = createRabbitAnimationEntity();
    animation.update(160);
    expect(animation.getState()).toMatchObject({ animation: "Idle", frameIndex: 1, playing: true });
    expect(animation.getState().frame).toMatchObject({ path: "/assets/rabbit/BunnyIdle-Sheet.png", sheetFrame: 1, widthPx: 32, heightPx: 32 });
  });
});
