import "./style.css";
import { MultiplayerClient } from "@rmc/multiplayer-client";
import { clientPointToTile } from "./coordinates";
import { MAP_HEIGHT, MAP_WIDTH, TIME_SCALES, advance, counts, initialState, nightTintAlpha, plant, rabbitFrame, setTimeScale, terrainAt, type HabitatState, type TimeScale } from "./simulation";

const TILE = 32;
type HabitatAction = { type: "plant" | "speed"; payload: unknown; sequence: number; sender: string };
type HabitatTransfer = { state: HabitatState; sequence: number; random: unknown; clock: unknown };
type HabitatActions = { action: { type: "plant" | "speed"; payload: unknown }; hostSnapshot: { state: HabitatState; random: unknown; clock: unknown } };
let state: HabitatState = initialState();
const multiplayer = new MultiplayerClient<{ hostId: string | null; transfer: HabitatTransfer | null }, HabitatActions, HabitatTransfer, HabitatAction>(import.meta.env.VITE_MULTIPLAYER_ENDPOINT ?? "http://127.0.0.1:2567", "just-like-rabbits");
let lastActionSequence = 0;
let lastPublishedAt = 0;
const environmentSheet = new Image(); environmentSheet.src = "/assets/environment-tiles.svg";
const rabbitSheet = new Image(); rabbitSheet.src = "/assets/rabbit-sprites.svg";
let paused = false;
let invalidUntil = 0;
let lastFrame = performance.now();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <section class="shell" aria-label="Just Like Rabbits habitat">
    <header class="hud"><div><h1>Just Like Rabbits</h1><p>Click grass or soil to plant carrots.</p></div>
    <div class="stats" aria-live="polite"><span id="planted"></span><span id="mature"></span></div>
    <div class="controls" aria-label="Simulation controls"><label>Time <select id="scale">${TIME_SCALES.map((scale) => `<option value="${scale}">${scale}x</option>`).join("")}</select></label><button id="pause" type="button">Pause local input</button><button id="retry" type="button">Retry room</button></div></header>
    <div class="canvas-wrap"><canvas id="habitat" width="${MAP_WIDTH * TILE}" height="${MAP_HEIGHT * TILE}" aria-label="Rabbit habitat map"></canvas><div id="toast" role="status"></div></div>
    <footer><span id="connection">Connecting to shared habitat…</span><span>Two autonomous rabbits</span></footer>
  </section>`;

const canvas = document.querySelector<HTMLCanvasElement>("#habitat")!;
const context = canvas.getContext("2d")!;
const planted = document.querySelector<HTMLSpanElement>("#planted")!;
const mature = document.querySelector<HTMLSpanElement>("#mature")!;
const toast = document.querySelector<HTMLDivElement>("#toast")!;
const scale = document.querySelector<HTMLSelectElement>("#scale")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause")!;
const retryButton = document.querySelector<HTMLButtonElement>("#retry")!;
const connection = document.querySelector<HTMLSpanElement>("#connection")!;

function isHabitatState(value: unknown): value is HabitatState {
  return Boolean(value) && typeof value === "object" && Array.isArray((value as HabitatState).plots) && Array.isArray((value as HabitatState).rabbits) && typeof (value as HabitatState).elapsed === "number";
}
function applySharedAction(action: HabitatAction): void {
  if (action.sequence <= lastActionSequence) return;
  lastActionSequence = action.sequence;
  if (action.type === "speed" && TIME_SCALES.includes(action.payload as TimeScale)) setTimeScale(state, action.payload as TimeScale);
  if (action.type === "plant" && action.payload && typeof action.payload === "object") {
    const point = action.payload as { x?: unknown; z?: unknown };
    if (Number.isInteger(point.x) && Number.isInteger(point.z)) plant(state, { x: point.x as number, y: point.z as number });
  }
}
multiplayer.subscribe((shared, event) => {
  const isHost = shared.hostId !== null && shared.hostId === shared.sessionId;
  connection.textContent = shared.status === "connected" ? (isHost ? `Connected · hosting ${shared.players.length}/${shared.capacity}` : `Connected · guest ${shared.players.length}/${shared.capacity}`) : shared.status === "full" ? "Shared habitat is full" : shared.status === "reconnecting" ? "Reconnecting to shared habitat…" : shared.status === "error" ? `Shared habitat error: ${shared.error}` : "Connecting to shared habitat…";
  const transfer = shared.transfer;
  if (!isHost && transfer && isHabitatState(transfer.state)) state = structuredClone(transfer.state);
  if (event === "habitatAction" && shared.lastAction && isHost) applySharedAction(shared.lastAction);
});
void multiplayer.connect();

function fillTile(x: number, y: number, color: string): void { context.fillStyle = color; context.fillRect(x * TILE, y * TILE, TILE, TILE); }
function drawPlant(x: number, y: number, maturePlot: boolean): void {
  const cx = x * TILE + TILE / 2; const base = y * TILE + TILE - 5;
  context.fillStyle = "#2b7b45"; context.fillRect(cx - 3, base - 13, 6, 13); context.fillRect(cx - 9, base - 9, 6, 4); context.fillRect(cx + 3, base - 11, 6, 4);
  if (maturePlot) { context.fillStyle = "#f6872f"; context.fillRect(cx - 3, base - 4, 6, 9); context.fillStyle = "#ffcc75"; context.fillRect(cx - 2, base - 3, 2, 6); }
}
function drawRabbit(x: number, y: number, stateName: string, index: number): void {
  const ox = x * TILE; const oy = y * TILE + (stateName === "moveToCarrot" || stateName === "wander" ? Math.sin(state.elapsed * 14 + index) * 3 : 0);
  const frame = rabbitFrame(stateName as import("./simulation").RabbitState);
  if (rabbitSheet.complete && rabbitSheet.naturalWidth > 0) { context.drawImage(rabbitSheet, frame * TILE, 0, TILE, TILE, ox, oy, TILE, TILE); return; }
  context.fillStyle = index === 0 ? "#f5ead9" : "#cfa47d"; context.beginPath(); context.ellipse(ox + 16, oy + 18, 11, 8, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = index === 0 ? "#fff8ed" : "#e7c19a"; context.fillRect(ox + 10, oy + 2, 4, 13); context.fillRect(ox + 18, oy + 2, 4, 13);
  context.fillStyle = "#4e3840"; context.fillRect(ox + 20, oy + 16, 2, 2); if (stateName === "eatCarrot") { context.fillStyle = "#f6872f"; context.fillRect(ox + 24, oy + 21, 4, 5); }
}
function render(): void {
  for (let y = 0; y < MAP_HEIGHT; y += 1) for (let x = 0; x < MAP_WIDTH; x += 1) {
    const terrain = terrainAt({ x, y });
    const index = terrain === "grass" ? 0 : terrain === "soil" ? 1 : terrain === "path" ? 2 : terrain === "bush" ? 3 : 4;
    fillTile(x, y, terrain === "grass" ? ((x + y) % 2 ? "#80bf63" : "#8dc96d") : terrain === "soil" ? "#ad794e" : terrain === "path" ? "#d9b877" : terrain === "bush" ? "#397d45" : "#5da8c1");
    if (environmentSheet.complete && environmentSheet.naturalWidth > 0) context.drawImage(environmentSheet, index * TILE, 0, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
    if (terrain === "bush") { context.fillStyle = "#5da151"; context.fillRect(x * TILE + 7, y * TILE + 7, 18, 18); }
  }
  for (const plot of state.plots) { fillTile(plot.x, plot.y, "#94633e"); drawPlant(plot.x, plot.y, plot.stage === "mature"); }
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
  if (paused) return; const point = pointFromEvent(event);
  if (multiplayer.state.status === "connected") multiplayer.send("action", { type: "plant", payload: { x: point.x, z: point.y } });
  else if (!plant(state, point)) { invalidUntil = performance.now() + 350; toast.textContent = "That tile cannot be planted."; window.setTimeout(() => { toast.textContent = ""; }, 900); }
});
scale.addEventListener("change", () => {
  const value = Number(scale.value) as TimeScale;
  if (multiplayer.state.status === "connected") multiplayer.send("action", { type: "speed", payload: value }); else setTimeScale(state, value);
});
pauseButton.addEventListener("click", () => { paused = !paused; pauseButton.textContent = paused ? "Resume local input" : "Pause local input"; });
retryButton.addEventListener("click", () => { void multiplayer.connect(); });
function frame(now: number): void {
  const isHost = multiplayer.state.status === "connected" && multiplayer.state.hostId === multiplayer.state.sessionId;
  if (multiplayer.state.status !== "connected" || isHost) advance(state, Math.min((now - lastFrame) / 1000, 0.4));
  if (isHost && now - lastPublishedAt >= 100) { multiplayer.send("hostSnapshot", { state, random: { seed: state.seed }, clock: { time: state.elapsed, speed: state.timeScale } }); lastPublishedAt = now; }
  lastFrame = now; render(); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
