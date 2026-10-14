import { CARROT_PLANT_CELLS, FARM_GROUND_CELLS, FARM_TILE_SIZE, plantSourceRegion } from "./farm-assets";
import { FARM_GROUND_GID, FARM_PLANT_GID, type FarmTiledMap } from "./tiled-farm-map";

export const FARM_RENDER_ORDER = Object.freeze(["Ground", "Plants", "Rabbits"] as const);
const groundBaseColors = ["#709f55", "#7b463a", "#8e5c42", "#5f8c46", "#67945d"];

export function groundSourceCellForGid(gid: number) {
  if (gid === FARM_GROUND_GID.grass) return FARM_GROUND_CELLS.grass;
  if (gid === FARM_GROUND_GID.dirt) return FARM_GROUND_CELLS.dirt;
  if (gid === FARM_GROUND_GID.path) return FARM_GROUND_CELLS.path;
  if (gid === FARM_GROUND_GID.bush) return FARM_GROUND_CELLS.bush;
  if (gid === FARM_GROUND_GID.water) return FARM_GROUND_CELLS.water;
  return undefined;
}

export function plantSourceCellForGid(gid: number) {
  if (gid === FARM_PLANT_GID.stage0) return CARROT_PLANT_CELLS.stage0;
  if (gid === FARM_PLANT_GID.stage1) return CARROT_PLANT_CELLS.stage1;
  if (gid === FARM_PLANT_GID.stage2) return CARROT_PLANT_CELLS.stage2;
  if (gid === FARM_PLANT_GID.stage3 || gid === FARM_PLANT_GID.carrotObject) return CARROT_PLANT_CELLS.stage3;
  return undefined;
}

export function drawFarmLayers(context: CanvasRenderingContext2D, map: FarmTiledMap, plantsSheet: HTMLImageElement, carrots: readonly { x: number; y: number }[] = []): void {
  const ground = map.layers[0]!;
  const plants = map.layers[1]!;
  for (let index = 0; index < ground.data.length; index += 1) {
    const gid = ground.data[index]!;
    const x = (index % map.width) * FARM_TILE_SIZE;
    const y = Math.floor(index / map.width) * FARM_TILE_SIZE;
    context.fillStyle = groundBaseColors[gid - 1] ?? "#000000";
    context.fillRect(x, y, FARM_TILE_SIZE, FARM_TILE_SIZE);
  }
  if (!plantsSheet.complete || plantsSheet.naturalWidth <= 0) return;
  for (let index = 0; index < ground.data.length; index += 1) {
    const cell = groundSourceCellForGid(ground.data[index]!);
    if (!cell) continue;
    const source = plantSourceRegion(cell);
    const x = (index % map.width) * FARM_TILE_SIZE;
    const y = Math.floor(index / map.width) * FARM_TILE_SIZE;
    context.drawImage(plantsSheet, source.sx, source.sy, source.size, source.size, x, y, FARM_TILE_SIZE, FARM_TILE_SIZE);
  }
  for (let index = 0; index < plants.data.length; index += 1) {
    const cell = plantSourceCellForGid(plants.data[index]!);
    if (!cell) continue;
    const source = plantSourceRegion(cell);
    const x = (index % map.width) * FARM_TILE_SIZE;
    const y = Math.floor(index / map.width) * FARM_TILE_SIZE;
    context.drawImage(plantsSheet, source.sx, source.sy, source.size, source.size, x, y, FARM_TILE_SIZE, FARM_TILE_SIZE);
  }
  for (const carrot of carrots) { const source = plantSourceRegion(CARROT_PLANT_CELLS.stage3); context.drawImage(plantsSheet, source.sx, source.sy, source.size, source.size, carrot.x * FARM_TILE_SIZE, carrot.y * FARM_TILE_SIZE, FARM_TILE_SIZE, FARM_TILE_SIZE); }
}
