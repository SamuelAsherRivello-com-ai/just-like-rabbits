import type { RabbitState } from "./simulation";
import { createSpriteSheetAnimationEntity, type SpriteAnimationDefinition, type SpriteSheetAnimationEntity } from "./sprite-sheet-animation-system";

export const RABBIT_ANIMATION_NAMES = ["Idle", "Run", "CarrotSkill", "LieDown", "Sleep", "Sitting", "Attack", "Hurt", "Dead"] as const;
export type RabbitAnimationName = typeof RABBIT_ANIMATION_NAMES[number];

const sheet = (name: RabbitAnimationName, file: string, frameCount: number, frameDurationMs: number, loopCount = -1): SpriteAnimationDefinition => ({
  name,
  source: { kind: "sheet", path: `/assets/rabbit/${file}`, cellWidthPx: 32, cellHeightPx: 32, columns: frameCount, rows: 1 },
  frameDurationMs,
  loopCount,
});

export function rabbitAnimationDefinitions(): readonly SpriteAnimationDefinition[] {
  return [
    sheet("Idle", "BunnyIdle-Sheet.png", 8, 160),
    sheet("Run", "BunnyRun-Sheet.png", 5, 90),
    sheet("CarrotSkill", "BunnyCarrotSkill-Sheet.png", 15, 80),
    sheet("LieDown", "BunnyLieDown-Sheet.png", 2, 180),
    sheet("Sleep", "BunnySleep-Sheet.png", 2, 450),
    sheet("Sitting", "BunnySitting-Sheet.png", 3, 180),
    sheet("Attack", "BunnyAttack-Sheet.png", 7, 90, 0),
    sheet("Hurt", "BunnyHurt-Sheet.png", 3, 120, 0),
    sheet("Dead", "BunnyDead-Sheet.png", 9, 130, 0),
  ];
}

export function rabbitAnimationForState(state: RabbitState): RabbitAnimationName {
  if (state === "eatCarrot") return "CarrotSkill";
  if (state === "wander" || state === "seekCarrot" || state === "moveToCarrot") return "Run";
  if (state === "hide") return "LieDown";
  if (state === "rest") return "Sleep";
  return "Idle";
}

export function createRabbitAnimationEntity(): SpriteSheetAnimationEntity {
  const entity = createSpriteSheetAnimationEntity(rabbitAnimationDefinitions(), "Idle");
  entity.start();
  return entity;
}
