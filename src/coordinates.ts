import { MAP_HEIGHT, MAP_WIDTH } from "./simulation";

export interface CanvasBounds { left: number; top: number; width: number; height: number }

/** Converts CSS viewport coordinates to a logical habitat grid coordinate. */
export function clientPointToTile(clientX: number, clientY: number, bounds: CanvasBounds): { x: number; y: number } {
  return {
    x: Math.floor((clientX - bounds.left) * MAP_WIDTH / bounds.width),
    y: Math.floor((clientY - bounds.top) * MAP_HEIGHT / bounds.height),
  };
}
