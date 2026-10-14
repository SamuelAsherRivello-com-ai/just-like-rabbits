export const FARM_TILE_SIZE = 32;
export const PLANT_SOURCE_TILE_SIZE = 16;
export const FARM_PLANTS_SHEET_PATH = `${import.meta.env.BASE_URL}assets/farm-plants.png`;
export const FARM_PLANTS_SHEET_COLUMNS = 48;
export const FARM_PLANTS_SHEET_ROWS = 27;

export interface PlantSourceCell { column: number; row: number }

/** Ground details selected from the confirmed Archive Of Tilesets To Copy From farm sheet. */
export const FARM_GROUND_CELLS: Readonly<{ grass: PlantSourceCell; dirt: PlantSourceCell; path: PlantSourceCell; bush: PlantSourceCell; water: PlantSourceCell }> = Object.freeze({
  grass: Object.freeze({ column: 9, row: 25 }),
  dirt: Object.freeze({ column: 18, row: 22 }),
  path: Object.freeze({ column: 17, row: 22 }),
  bush: Object.freeze({ column: 11, row: 25 }),
  water: Object.freeze({ column: 10, row: 25 }),
});

/** Selected from the supplied Plants.png crop progression: sprout then carrot root. */
export const CARROT_PLANT_CELLS: Readonly<{ seedling: PlantSourceCell; mature: PlantSourceCell }> = Object.freeze({
  seedling: Object.freeze({ column: 9, row: 24 }),
  mature: Object.freeze({ column: 11, row: 24 }),
});

export function plantSourceRegion(cell: PlantSourceCell): Readonly<{ sx: number; sy: number; size: number }> {
  if (!Number.isInteger(cell.column) || !Number.isInteger(cell.row) || cell.column < 0 || cell.column >= FARM_PLANTS_SHEET_COLUMNS || cell.row < 0 || cell.row >= FARM_PLANTS_SHEET_ROWS) throw new RangeError("plant source cell is outside Plants.png");
  return Object.freeze({ sx: cell.column * PLANT_SOURCE_TILE_SIZE, sy: cell.row * PLANT_SOURCE_TILE_SIZE, size: PLANT_SOURCE_TILE_SIZE });
}
