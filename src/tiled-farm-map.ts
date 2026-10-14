import { MAP_HEIGHT, MAP_WIDTH, terrainAt, type Plot, type Point } from "./simulation";
import { FARM_TILE_SIZE } from "./farm-assets";

export const FARM_GROUND_GID = Object.freeze({ grass: 1, dirt: 2, path: 3, bush: 4, water: 5 });
export const FARM_PLANT_GID = Object.freeze({ empty: 0, stage0: 1, stage1: 2, stage2: 3, stage3: 4, carrotObject: 5 });
export interface FarmTileLayer { id: number; name: "Ground" | "Plants"; type: "tilelayer"; visible: boolean; opacity: number; width: number; height: number; data: number[] }
export interface FarmTiledMap { type: "map"; version: "1.10"; tiledversion: "1.10.2"; orientation: "orthogonal"; renderorder: "right-down"; width: number; height: number; tilewidth: number; tileheight: number; infinite: false; layers: FarmTileLayer[] }

function farmIndex(x: number, y: number): number { return y * MAP_WIDTH + x; }
function plotAt(plots: readonly Plot[], x: number, y: number): Plot | undefined { return plots.find((plot) => plot.x === x && plot.y === y); }

export function groundGidAt(x: number, y: number, plots: readonly Plot[] = [], cultivated: readonly Point[] = []): number {
  if (plotAt(plots, x, y) || cultivated.some(tile => tile.x === x && tile.y === y)) return FARM_GROUND_GID.dirt;
  const terrain = terrainAt({ x, y });
  return terrain === "grass" ? FARM_GROUND_GID.grass : terrain === "soil" ? FARM_GROUND_GID.dirt : terrain === "path" ? FARM_GROUND_GID.path : terrain === "bush" ? FARM_GROUND_GID.bush : FARM_GROUND_GID.water;
}

export function plantGidAt(x: number, y: number, plots: readonly Plot[] = []): number {
  const plot = plotAt(plots, x, y);
  return !plot ? FARM_PLANT_GID.empty : plot.stage + 1;
}

export function createFarmTiledMap(plots: readonly Plot[] = [], cultivated: readonly Point[] = []): FarmTiledMap {
  const cells = Array.from({ length: MAP_HEIGHT * MAP_WIDTH }, (_, index) => ({ x: index % MAP_WIDTH, y: Math.floor(index / MAP_WIDTH) }));
  return {
    type: "map", version: "1.10", tiledversion: "1.10.2", orientation: "orthogonal", renderorder: "right-down",
    width: MAP_WIDTH, height: MAP_HEIGHT, tilewidth: FARM_TILE_SIZE, tileheight: FARM_TILE_SIZE, infinite: false,
    layers: [
      { id: 1, name: "Ground", type: "tilelayer", visible: true, opacity: 1, width: MAP_WIDTH, height: MAP_HEIGHT, data: cells.map(({ x, y }) => groundGidAt(x, y, plots, cultivated)) },
      { id: 2, name: "Plants", type: "tilelayer", visible: true, opacity: 1, width: MAP_WIDTH, height: MAP_HEIGHT, data: cells.map(({ x, y }) => plantGidAt(x, y, plots)) },
    ],
  };
}

export function farmTileAt(map: FarmTiledMap, layerName: FarmTileLayer["name"], x: number, y: number): number {
  const layer = map.layers.find((candidate) => candidate.name === layerName);
  return layer?.data[farmIndex(x, y)] ?? FARM_PLANT_GID.empty;
}

export function validateFarmTiledMap(input: unknown): Readonly<{ valid: boolean; errors: readonly string[] }> {
  const map = (typeof input === "object" && input !== null ? input : {}) as Partial<FarmTiledMap>;
  const errors: string[] = [];
  if (map.type !== "map" || map.orientation !== "orthogonal" || map.renderorder !== "right-down") errors.push("map must be an orthogonal Tiled map");
  if (map.width !== MAP_WIDTH || map.height !== MAP_HEIGHT) errors.push(`map must be ${MAP_WIDTH} by ${MAP_HEIGHT} tiles`);
  if (map.tilewidth !== FARM_TILE_SIZE || map.tileheight !== FARM_TILE_SIZE) errors.push(`map tiles must be ${FARM_TILE_SIZE} by ${FARM_TILE_SIZE} pixels`);
  const layers = Array.isArray(map.layers) ? map.layers : [];
  const expectedCells = MAP_WIDTH * MAP_HEIGHT;
  for (const [index, name] of (["Ground", "Plants"] as const).entries()) {
    const layer = layers[index];
    if (!layer || layer.name !== name || layer.type !== "tilelayer" || layer.visible !== true || layer.width !== MAP_WIDTH || layer.height !== MAP_HEIGHT || !Array.isArray(layer.data) || layer.data.length !== expectedCells) errors.push(`${name} layer is missing or has the wrong shape`);
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
