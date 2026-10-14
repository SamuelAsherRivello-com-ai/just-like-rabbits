# Proposal

## Why

The habitat currently paints procedural terrain and plants directly in the canvas, so its garden cannot be authored or inspected as a layered Tiled map. The supplied farm plant pack and bunny animations need a common 32 px presentation grid that makes growing carrots read clearly above cultivated dirt.

## What Changes

- Add a Tiled-compatible, orthogonal 32 × 32 px farm-map contract with explicit `Ground` and `Plants` tile layers.
- Render grass and dirt from the ground layer before any plant overlay, preserving dirt for a planted carrot throughout its lifecycle.
- Import the supplied farm plant sheet and render distinct seedling and mature-carrot overlay frames at 32 px logical tile size with nearest-neighbor scaling.
- Adapt the dungeon project's typed Tiled map tooling to validate and render this small Canvas 2D map without importing its Babylon or dungeon gameplay systems.
- Keep the animated bunny catalog above both Tiled layers; rabbits continue to use mature carrots as their deterministic food source.

## Capabilities

### New Capabilities

- `tiled-farm-rendering`: Defines the Tiled-compatible farm-map layers, 32 px rendering contract, and visual carrot lifecycle.

### Modified Capabilities

- None.

## Impact

- Affected code: a new Tiled farm-map module, `src/main.ts` canvas composition, tests, and asset documentation.
- Affected assets: the supplied `Plants.png` is added as a source sheet; existing environment tiles remain the grass/dirt source because the supplied plant pack contains overlays rather than terrain tiles.
- No multiplayer protocol, simulation timing, or new runtime dependency is required.
