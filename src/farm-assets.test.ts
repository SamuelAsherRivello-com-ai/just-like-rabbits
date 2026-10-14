import { describe, expect, it } from "vitest";
import { CARROT_PLANT_CELLS, FARM_GROUND_CELLS, FARM_PLANTS_SHEET_COLUMNS, FARM_PLANTS_SHEET_PATH, FARM_PLANTS_SHEET_ROWS, FARM_TILE_SIZE, PLANT_SOURCE_TILE_SIZE, plantSourceRegion } from "./farm-assets";

describe("farm asset contract", () => {
  it("keeps carrots on a valid 16px source grid rendered at 32px", () => {
    expect(FARM_PLANTS_SHEET_PATH).toBe("/assets/farm-plants.png");
    expect({ FARM_PLANTS_SHEET_COLUMNS, FARM_PLANTS_SHEET_ROWS, PLANT_SOURCE_TILE_SIZE, FARM_TILE_SIZE }).toEqual({ FARM_PLANTS_SHEET_COLUMNS: 48, FARM_PLANTS_SHEET_ROWS: 27, PLANT_SOURCE_TILE_SIZE: 16, FARM_TILE_SIZE: 32 });
    expect(Object.values(CARROT_PLANT_CELLS).map(plantSourceRegion)).toEqual([{ sx: 144, sy: 384, size: 16 }, { sx: 160, sy: 384, size: 16 }, { sx: 176, sy: 384, size: 16 }, { sx: 192, sy: 384, size: 16 }]);
  });

  it("uses the supplied farm sheet for grass and cultivated dirt", () => {
    expect(plantSourceRegion(FARM_GROUND_CELLS.grass)).toEqual({ sx: 144, sy: 400, size: 16 });
    expect(plantSourceRegion(FARM_GROUND_CELLS.dirt)).toEqual({ sx: 288, sy: 352, size: 16 });
  });
});
