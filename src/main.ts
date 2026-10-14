import "./style.css";
import { MultiplayerClient, type JustLikeRabbitsActions, type JustLikeRabbitsState } from "@rmc/multiplayer-client";
import { clientPointToTile } from "./coordinates";
import { FARM_TILE_SIZE, FARM_PLANTS_SHEET_PATH } from "./farm-assets";
import { drawFarmLayers } from "./farm-renderer";
import { habitatConnectionLabel } from "./habitat-connection";
import { createRabbitAnimationEntity, rabbitAnimationDefinitions, rabbitAnimationForState } from "./rabbit-animation-catalog";
import { MAP_HEIGHT, MAP_WIDTH, TIME_SCALES, counts, initialState, nightTintAlpha, type HabitatState, type RabbitState, type TimeScale } from "./simulation";
import type { SpriteSheetAnimationEntity } from "./sprite-sheet-animation-system";
import { suppliedArtStatus } from "./supplied-art";
import { createFarmTiledMap } from "./tiled-farm-map";

const TILE = FARM_TILE_SIZE;
let state: HabitatState = initialState();
const multiplayer = new MultiplayerClient<JustLikeRabbitsState, JustLikeRabbitsActions>(import.meta.env.VITE_MULTIPLAYER_ENDPOINT ?? "http://127.0.0.1:2567", "just-like-rabbits");
const artIssues: string[] = [];
function loadSuppliedImage(path: string): HTMLImageElement {
  const image = new Image();
  image.addEventListener("error", () => { if (!artIssues.includes(path)) artIssues.push(path); });
  image.src = path;
  return image;
}
const farmPlantsSheet = loadSuppliedImage(FARM_PLANTS_SHEET_PATH);
const rabbitSheets = new Map(rabbitAnimationDefinitions().flatMap((definition) => definition.source.kind === "sheet" ? [[definition.source.path, loadSuppliedImage(definition.source.path)] as const] : []));
const rabbitAnimations = new Map<string, SpriteSheetAnimationEntity>();
let paused = false;
let invalidUntil = 0;
let lastFrame = performance.now();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <section class="shell" aria-label="Just Like Rabbits habitat">
    <header class="hud"><div><h1>Just Like Rabbits</h1><p>Click grass or soil to plant carrots.</p></div>
    <div class="stats" aria-live="polite"><span id="planted"></span><span id="mature"></span></div>
    <div class="controls" aria-label="Simulation controls"><label>Time <select id="scale">${TIME_SCALES.map((scale) => `<option value="${scale}">${scale}x</option>`).join("")}</select></label><button id="pause" type="button">Pause local input</button><button id="retry" type="button">Retry room</button></div></header>
    <div class="canvas-wrap"><canvas id="habitat" width="${MAP_WIDTH * TILE}" height="${MAP_HEIGHT * TILE}" aria-label="Rabbit habitat map"></canvas><div id="toast" role="status"></div></div>
    <footer><span id="connection">Connecting to shared habitat…</span><span id="art-status">Loading supplied farm artwork…</span></footer>
  </section>`;

const canvas = document.querySelector<HTMLCanvasElement>("#habitat")!;
const context = canvas.getContext("2d")!;
context.imageSmoothingEnabled = false;
const planted = document.querySelector<HTMLSpanElement>("#planted")!;
const mature = document.querySelector<HTMLSpanElement>("#mature")!;
const toast = document.querySelector<HTMLDivElement>("#toast")!;
const scale = document.querySelector<HTMLSelectElement>("#scale")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause")!;
const retryButton = document.querySelector<HTMLButtonElement>("#retry")!;
const connection = document.querySelector<HTMLSpanElement>("#connection")!;
const artStatus = document.querySelector<HTMLSpanElement>("#art-status")!;

function isHabitatState(value: unknown): value is HabitatState {
  return Boolean(value) && typeof value === "object" && Array.isArray((value as HabitatState).plots) && Array.isArray((value as HabitatState).rabbits) && typeof (value as HabitatState).elapsed === "number";
}
multiplayer.subscribe(shared => {
  connection.textContent = habitatConnectionLabel(shared.status, shared.players.length, shared.capacity, shared.error, paused);
  if (shared.gameState && isHabitatState(shared.gameState)) state = structuredClone(shared.gameState);
});
void multiplayer.connect();

function drawRabbit(x: number, y: number, stateName: string, index: number): void {
  const ox = x * TILE; const oy = y * TILE + (stateName === "moveToCarrot" || stateName === "wander" ? Math.sin(state.elapsed * 14 + index) * 3 : 0);
  const rabbit = state.rabbits[index]!;
  let animation = rabbitAnimations.get(rabbit.id);
  if (!animation) { animation = createRabbitAnimationEntity(); rabbitAnimations.set(rabbit.id, animation); }
  const animationName = rabbitAnimationForState(stateName as RabbitState);
  if (animation.getState().animation !== animationName) animation.selectAnimation(animationName);
  const frame = animation.getState().frame;
  const sheet = rabbitSheets.get(frame.path);
  if (sheet?.complete && sheet.naturalWidth > 0 && frame.sheetFrame !== undefined) {
    context.drawImage(sheet, frame.sheetFrame * frame.widthPx, 0, frame.widthPx, frame.heightPx, ox, oy, TILE, TILE);
  }
}
function render(): void {
  const artState = suppliedArtStatus([farmPlantsSheet, ...rabbitSheets.values()].map((sheet) => sheet.complete && sheet.naturalWidth > 0), artIssues);
  if (artState !== "ready") {
    context.clearRect(0, 0, canvas.width, canvas.height);
    artStatus.textContent = artState === "error" ? "Supplied game artwork failed to load." : "Loading supplied farm artwork…";
    return;
  }
  artStatus.textContent = "Supplied farm and rabbit artwork loaded";
  drawFarmLayers(context, createFarmTiledMap(state.plots, state.cultivated ?? []), farmPlantsSheet, state.carrots ?? []);
  for (const [index, rabbit] of state.rabbits.entries()) drawRabbit(rabbit.x, rabbit.y, rabbit.state, index);
  const daylight = nightTintAlpha(state.elapsed);
  context.fillStyle = `rgba(20, 35, 78, ${daylight})`; context.fillRect(0, 0, canvas.width, canvas.height);
  if (performance.now() < invalidUntil) { context.strokeStyle = "rgba(255,255,255,.9)"; context.lineWidth = 3; context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4); }
  const tally = counts(state); planted.textContent = `Plots: ${tally.planted}`; mature.textContent = `Mature: ${tally.mature}`; scale.value = String(state.timeScale);
}
function pointFromEvent(event: PointerEvent): { x: number; y: number } {
  const box = canvas.getBoundingClientRect();
  return clientPointToTile(event.clientX, event.clientY, box);
}
canvas.addEventListener("pointerdown", (event) => {
  if (paused) return;
  const point = pointFromEvent(event);
  if (multiplayer.state.status === "connected") multiplayer.send("action", { type: "plant", payload: { x: point.x, z: point.y } });
  else { invalidUntil = performance.now() + 350; toast.textContent = "Join the shared habitat before planting."; window.setTimeout(() => { toast.textContent = ""; }, 900); }
});
scale.addEventListener("change", () => {
  const value = Number(scale.value) as TimeScale;
  if (multiplayer.state.status === "connected") multiplayer.send("action", { type: "speed", payload: value });
});
pauseButton.addEventListener("click", () => { paused = !paused; pauseButton.textContent = paused ? "Resume local input" : "Pause local input"; connection.textContent = habitatConnectionLabel(multiplayer.state.status, multiplayer.state.players.length, multiplayer.state.capacity, multiplayer.state.error, paused); });
retryButton.addEventListener("click", () => { void multiplayer.connect(); });
function frame(now: number): void {
  const elapsedMs = Math.min(Math.max(0, now - lastFrame), 400);
  for (const animation of rabbitAnimations.values()) animation.update(elapsedMs);
  lastFrame = now; render(); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
