export const MAP_WIDTH = 18;
export const MAP_HEIGHT = 12;
export const GROW_SECONDS = 20;
export const TIME_SCALES = [0.5, 1, 2, 4, 10] as const;

export type TimeScale = (typeof TIME_SCALES)[number];
export type Terrain = "grass" | "soil" | "path" | "bush" | "water";
export type PlotStage = "seedling" | "mature";
export type RabbitState = "idle" | "wander" | "seekCarrot" | "moveToCarrot" | "eatCarrot" | "hide" | "rest";
export interface Point { x: number; y: number }
export interface Plot extends Point { stage: PlotStage; plantedAt: number }
export interface Rabbit extends Point { id: string; state: RabbitState; target?: Point; stateUntil: number }
export interface HabitatState { elapsed: number; timeScale: TimeScale; seed: number; plots: Plot[]; rabbits: Rabbit[] }

export function terrainAt({ x, y }: Point): Terrain {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return "water";
  if (x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1) return "water";
  if ((x === 8 || x === 9) && y > 1 && y < MAP_HEIGHT - 2) return "path";
  if ((x === 3 && y === 3) || (x === 14 && y === 8) || (x === 4 && y === 9)) return "bush";
  return (x + y) % 7 === 0 ? "soil" : "grass";
}

export function initialState(): HabitatState {
  return {
    elapsed: 0, timeScale: 1, seed: 123456,
    plots: [],
    rabbits: [
      { id: "hazel", x: 5, y: 5, state: "idle", stateUntil: 1.2 },
      { id: "poppy", x: 13, y: 6, state: "wander", stateUntil: 0.8 },
    ],
  };
}

export function plant(state: HabitatState, point: Point): boolean {
  const terrain = terrainAt(point);
  if ((terrain !== "grass" && terrain !== "soil") || state.plots.some((plot) => plot.x === point.x && plot.y === point.y)) return false;
  state.plots.push({ ...point, stage: "seedling", plantedAt: state.elapsed });
  return true;
}

export function setTimeScale(state: HabitatState, value: TimeScale): void { state.timeScale = value; }

function nextRandom(state: HabitatState): number {
  state.seed = (state.seed * 1664525 + 1013904223) >>> 0;
  return state.seed / 0x1_0000_0000;
}

function samePoint(a: Point, b: Point): boolean { return a.x === b.x && a.y === b.y; }
function maturePlots(state: HabitatState): Plot[] { return state.plots.filter((plot) => plot.stage === "mature"); }
function stepToward(rabbit: Rabbit, target: Point): void {
  if (rabbit.x !== target.x) rabbit.x += Math.sign(target.x - rabbit.x);
  else if (rabbit.y !== target.y) rabbit.y += Math.sign(target.y - rabbit.y);
}

function decide(state: HabitatState, rabbit: Rabbit): void {
  const food = maturePlots(state);
  if (food.length > 0 && nextRandom(state) < 0.68) {
    const target = food[Math.floor(nextRandom(state) * food.length)];
    if (target) { rabbit.target = { x: target.x, y: target.y }; rabbit.state = "seekCarrot"; rabbit.stateUntil = state.elapsed + 0.1; return; }
  }
  const roll = nextRandom(state);
  if (roll < 0.18) { rabbit.state = "rest"; rabbit.stateUntil = state.elapsed + 2; return; }
  if (roll < 0.33) { rabbit.state = "hide"; rabbit.stateUntil = state.elapsed + 2; return; }
  rabbit.state = "wander";
  rabbit.target = { x: 2 + Math.floor(nextRandom(state) * (MAP_WIDTH - 4)), y: 2 + Math.floor(nextRandom(state) * (MAP_HEIGHT - 4)) };
  rabbit.stateUntil = state.elapsed + 0.25;
}

function updateRabbit(state: HabitatState, rabbit: Rabbit): void {
  if (rabbit.state === "eatCarrot" && state.elapsed >= rabbit.stateUntil) { rabbit.state = "idle"; rabbit.stateUntil = state.elapsed + 1; delete rabbit.target; return; }
  if ((rabbit.state === "idle" || rabbit.state === "rest" || rabbit.state === "hide") && state.elapsed >= rabbit.stateUntil) { decide(state, rabbit); return; }
  if (rabbit.state === "seekCarrot") {
    if (!rabbit.target || !maturePlots(state).some((plot) => samePoint(plot, rabbit.target!))) { delete rabbit.target; rabbit.state = "wander"; rabbit.stateUntil = state.elapsed + 0.8; return; }
    rabbit.state = "moveToCarrot"; rabbit.stateUntil = state.elapsed; return;
  }
  if (rabbit.state === "moveToCarrot" && rabbit.target && state.elapsed >= rabbit.stateUntil) {
    if (!maturePlots(state).some((plot) => samePoint(plot, rabbit.target!))) { delete rabbit.target; rabbit.state = "idle"; rabbit.stateUntil = state.elapsed + 0.5; return; }
    if (samePoint(rabbit, rabbit.target)) {
      state.plots = state.plots.filter((plot) => !samePoint(plot, rabbit.target!));
      rabbit.state = "eatCarrot"; rabbit.stateUntil = state.elapsed + 1.2; return;
    }
    stepToward(rabbit, rabbit.target); rabbit.stateUntil = state.elapsed + 0.28; return;
  }
  if (rabbit.state === "wander" && rabbit.target && state.elapsed >= rabbit.stateUntil) {
    if (samePoint(rabbit, rabbit.target)) { rabbit.state = "idle"; rabbit.stateUntil = state.elapsed + 0.8; return; }
    stepToward(rabbit, rabbit.target); rabbit.stateUntil = state.elapsed + 0.36;
  }
}

export function advance(state: HabitatState, wallSeconds: number): void {
  const end = state.elapsed + Math.max(0, wallSeconds) * state.timeScale;
  while (state.elapsed + 0.1 <= end + 0.00001) {
    state.elapsed = Math.round((state.elapsed + 0.1) * 10) / 10;
    for (const plot of state.plots) if (plot.stage === "seedling" && state.elapsed - plot.plantedAt >= GROW_SECONDS) plot.stage = "mature";
    for (const rabbit of state.rabbits) updateRabbit(state, rabbit);
  }
}

export function counts(state: HabitatState): { planted: number; mature: number } {
  return { planted: state.plots.length, mature: maturePlots(state).length };
}

/** Alpha for a readable, cyclic night tint. 0.12 is deliberately never opaque. */
export function nightTintAlpha(elapsed: number): number { return 0.12 + 0.2 * ((Math.sin(elapsed / 16) + 1) / 2); }

export function rabbitFrame(state: RabbitState): 0 | 1 | 2 {
  if (state === "eatCarrot") return 2;
  return state === "moveToCarrot" || state === "wander" ? 1 : 0;
}
