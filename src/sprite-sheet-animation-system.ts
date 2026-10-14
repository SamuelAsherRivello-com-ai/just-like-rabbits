/**
 * Generic, presentation-only playback for ordered image frames and sprite sheets.
 * This is adapted from the dungeon-crawl renderer so a catalog can be shared by
 * any 2D canvas actor without influencing simulation state.
 */
export type SpriteFrame = Readonly<{ path: string; widthPx: number; heightPx: number; sheetFrame?: number }>;
export type SpriteSource = Readonly<{ kind: "frames"; frames: readonly SpriteFrame[] }> | Readonly<{ kind: "sheet"; path: string; cellWidthPx: number; cellHeightPx: number; columns: number; rows: number; frameCount?: number }>;
export type SpriteAnimationDefinition = Readonly<{ name: string; source: SpriteSource; frameDurationMs: number; loopCount: number }>;
export type SpriteAnimationSummary = Readonly<{ name: string; frameCount: number; frameDurationMs: number; loopCount: number; frames: readonly SpriteFrame[] }>;
export type SpriteAnimationState = Readonly<{ animation: string; speed: number; frameIndex: number; frame: SpriteFrame; playing: boolean; completed: boolean; loopsCompleted: number }>;
export type SpriteSheetAnimationEntity = Readonly<{ listAnimations(): readonly SpriteAnimationSummary[]; selectAnimation(name: string, restart?: boolean): void; start(): void; stop(): void; update(deltaMs: number): void; getState(): SpriteAnimationState; dispose(): void }>;

function positiveInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value <= 0) throw new RangeError(`${label} must be a positive integer`);
  return value;
}

function expandSource(source: SpriteSource): readonly SpriteFrame[] {
  if (source.kind === "frames") {
    if (source.frames.length === 0) throw new Error("frame source must contain at least one frame");
    return Object.freeze(source.frames.map((frame, index) => Object.freeze({
      path: frame.path,
      widthPx: positiveInteger(frame.widthPx, `frame ${index} widthPx`),
      heightPx: positiveInteger(frame.heightPx, `frame ${index} heightPx`),
      ...(frame.sheetFrame === undefined ? {} : { sheetFrame: frame.sheetFrame }),
    })));
  }
  if (!source.path) throw new Error("sprite sheet is missing a path");
  const columns = positiveInteger(source.columns, "sprite sheet columns");
  const rows = positiveInteger(source.rows, "sprite sheet rows");
  const frameCount = source.frameCount ?? columns * rows;
  if (!Number.isInteger(frameCount) || frameCount <= 0 || frameCount > columns * rows) throw new RangeError("sprite sheet frameCount must fit within its grid");
  const widthPx = positiveInteger(source.cellWidthPx, "sprite sheet cellWidthPx");
  const heightPx = positiveInteger(source.cellHeightPx, "sprite sheet cellHeightPx");
  return Object.freeze(Array.from({ length: frameCount }, (_, sheetFrame) => Object.freeze({ path: source.path, widthPx, heightPx, sheetFrame })));
}

export function createSpriteSheetAnimationEntity(definitions: readonly SpriteAnimationDefinition[], initialAnimation = definitions[0]?.name): SpriteSheetAnimationEntity {
  if (definitions.length === 0) throw new Error("at least one animation is required");
  const animations = new Map<string, SpriteAnimationSummary>();
  for (const definition of definitions) {
    if (!definition.name || !Number.isFinite(definition.frameDurationMs) || definition.frameDurationMs <= 0) throw new Error("animation definitions need a name and positive frame duration");
    if (!Number.isInteger(definition.loopCount) || definition.loopCount < -1) throw new RangeError("loopCount must be -1 or a non-negative integer");
    if (animations.has(definition.name)) throw new Error(`duplicate animation: ${definition.name}`);
    const frames = expandSource(definition.source);
    animations.set(definition.name, Object.freeze({ ...definition, frameCount: frames.length, frames }));
  }
  if (!initialAnimation || !animations.has(initialAnimation)) throw new Error(`unknown initial animation: ${initialAnimation ?? ""}`);
  let current = animations.get(initialAnimation)!;
  let frameIndex = 0;
  let elapsedMs = 0;
  let loopsCompleted = 0;
  let playing = false;
  let completed = false;
  let disposed = false;
  const assertActive = () => { if (disposed) throw new Error("animation entity is disposed"); };
  const selectAnimation = (name: string, restart = true) => {
    assertActive(); const next = animations.get(name);
    if (!next) throw new Error(`unknown animation: ${name}`);
    if (next === current && !restart) return;
    current = next; frameIndex = 0; elapsedMs = 0; loopsCompleted = 0; completed = false;
  };
  const start = () => { assertActive(); if (!completed) playing = true; };
  const stop = () => { assertActive(); playing = false; };
  const update = (deltaMs: number) => {
    assertActive();
    if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new RangeError("deltaMs must be non-negative");
    if (!playing) return;
    elapsedMs += deltaMs;
    while (elapsedMs >= current.frameDurationMs && playing) {
      elapsedMs -= current.frameDurationMs;
      if (frameIndex < current.frameCount - 1) { frameIndex++; continue; }
      loopsCompleted++;
      if (current.loopCount !== -1 && loopsCompleted > current.loopCount) { playing = false; completed = true; continue; }
      frameIndex = 0;
    }
  };
  const getState = (): SpriteAnimationState => {
    assertActive();
    return Object.freeze({ animation: current.name, speed: 1, frameIndex, frame: current.frames[frameIndex]!, playing, completed, loopsCompleted });
  };
  const dispose = () => { disposed = true; playing = false; };
  return Object.freeze({ listAnimations: () => Object.freeze([...animations.values()]), selectAnimation, start, stop, update, getState, dispose });
}
