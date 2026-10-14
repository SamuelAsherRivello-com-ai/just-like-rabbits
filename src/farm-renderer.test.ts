import { describe, expect, it } from "vitest";
import { CARROT_PLANT_CELLS, FARM_GROUND_CELLS, plantSourceRegion } from "./farm-assets";
import { FARM_RENDER_ORDER, groundSourceCellForGid, plantSourceCellForGid } from "./farm-renderer";
import { FARM_GROUND_GID, FARM_PLANT_GID } from "./tiled-farm-map";

describe("farm renderer catalog", () => {
  it("keeps terrain, crop overlays, and rabbits in paint order", () => {
    expect(FARM_RENDER_ORDER).toEqual(["Ground", "Plants", "Rabbits"]);
  });

  it("maps grass and planted dirt to supplied farm-sheet cells", () => {
    expect(groundSourceCellForGid(FARM_GROUND_GID.grass)).toEqual(FARM_GROUND_CELLS.grass);
    expect(groundSourceCellForGid(FARM_GROUND_GID.dirt)).toEqual(FARM_GROUND_CELLS.dirt);
    expect(plantSourceRegion(groundSourceCellForGid(FARM_GROUND_GID.grass)!)).toEqual({ sx: 144, sy: 400, size: 16 });
    expect(plantSourceRegion(groundSourceCellForGid(FARM_GROUND_GID.dirt)!)).toEqual({ sx: 288, sy: 352, size: 16 });
  });

  it("maps both carrot lifecycle GIDs to their selected source regions", () => {
    expect(plantSourceCellForGid(FARM_PLANT_GID.seedling)).toEqual(CARROT_PLANT_CELLS.seedling);
    expect(plantSourceCellForGid(FARM_PLANT_GID.mature)).toEqual(CARROT_PLANT_CELLS.mature);
    expect(plantSourceRegion(plantSourceCellForGid(FARM_PLANT_GID.seedling)!)).toEqual({ sx: 144, sy: 384, size: 16 });
    expect(plantSourceRegion(plantSourceCellForGid(FARM_PLANT_GID.mature)!)).toEqual({ sx: 176, sy: 384, size: 16 });
    expect(plantSourceCellForGid(FARM_PLANT_GID.empty)).toBeUndefined();
  });
});
