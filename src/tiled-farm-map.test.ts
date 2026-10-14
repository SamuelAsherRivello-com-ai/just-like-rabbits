import { describe, expect, it } from "vitest";
import { advance, initialState, plant } from "./simulation";
import { FARM_GROUND_GID, FARM_PLANT_GID, createFarmTiledMap, farmTileAt, validateFarmTiledMap } from "./tiled-farm-map";

describe("Tiled farm map", () => {
  it("builds ordered 18 by 12 ground and plant layers", () => {
    const map = createFarmTiledMap();
    expect(map).toMatchObject({ type: "map", orientation: "orthogonal", renderorder: "right-down", width: 18, height: 12, tilewidth: 32, tileheight: 32 });
    expect(map.layers.map(({ name, id, data }) => ({ name, id, cells: data.length }))).toEqual([{ name: "Ground", id: 1, cells: 216 }, { name: "Plants", id: 2, cells: 216 }]);
    expect(farmTileAt(map, "Ground", 1, 1)).toBe(FARM_GROUND_GID.grass);
    expect(farmTileAt(map, "Plants", 1, 1)).toBe(FARM_PLANT_GID.empty);
  });

  it("validates the fixed layer contract", () => {
    const map = createFarmTiledMap();
    expect(validateFarmTiledMap(map)).toEqual({ valid: true, errors: [] });
    expect(validateFarmTiledMap({ ...map, tilewidth: 16 }).valid).toBe(false);
    expect(validateFarmTiledMap({ ...map, layers: [map.layers[0]!] }).errors).toContain("Plants layer is missing or has the wrong shape");
  });

  it("turns a planted cell into dirt and exposes its lifecycle in Plants", () => {
    const seedling = { x: 1, y: 1, stage: 0 as const, plantedAt: 0 };
    const mature = { x: 2, y: 1, stage: 3 as const, plantedAt: 0 };
    const map = createFarmTiledMap([seedling, mature]);
    expect(farmTileAt(map, "Ground", 1, 1)).toBe(FARM_GROUND_GID.dirt);
    expect(farmTileAt(map, "Plants", 1, 1)).toBe(FARM_PLANT_GID.stage0);
    expect(farmTileAt(map, "Plants", 2, 1)).toBe(FARM_PLANT_GID.stage3);
    expect(farmTileAt(createFarmTiledMap([seedling]), "Plants", 2, 1)).toBe(FARM_PLANT_GID.empty);
  });

  it("renders a simulation-grown carrot as a separate object above persistent dirt", () => {
    const state = initialState();
    expect(plant(state, { x: 1, y: 1 })).toBe(true);
    advance(state, 60);
    const grown = createFarmTiledMap(state.plots, state.cultivated);
    expect(farmTileAt(grown, "Ground", 1, 1)).toBe(FARM_GROUND_GID.dirt);
    expect(farmTileAt(grown, "Plants", 1, 1)).toBe(FARM_PLANT_GID.empty);
    expect(state.carrots).toEqual([{ x: 1, y: 1 }]);
  });
});
