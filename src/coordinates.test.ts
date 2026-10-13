import { describe, expect, it } from "vitest";
import { clientPointToTile } from "./coordinates";

describe("clientPointToTile", () => {
  it("maps landscape and portrait CSS canvases to the same logical tile", () => {
    expect(clientPointToTile(306, 255, { left: 178, top: 127, width: 924, height: 616 })).toEqual({ x: 2, y: 2 });
    expect(clientPointToTile(67, 269, { left: 18, top: 220, width: 354, height: 236 })).toEqual({ x: 2, y: 2 });
  });
});
