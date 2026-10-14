# Design

## Context

See `proposal.md` for motivation. The browser currently derives terrain from `simulation.ts` and draws it procedurally in `main.ts`; rabbit playback is already a presentation-only catalog. The supplied bunny frames are native 32 × 32 px strips. The supplied plant sheet is 768 × 432 px, a 48 × 27 grid of 16 px source cells.

## Goals / Non-Goals

**Goals:**

- Make the farm's base terrain and crop overlay expressible as Tiled-compatible layers.
- Use a 32 px destination grid throughout the canvas.
- Reuse simulation plot stages as the only source of carrot lifecycle truth.
- Preserve the separate, animated bunny rendering path above all map layers.

**Non-Goals:**

- Import the dungeon's Babylon renderer, dungeon generation, or gameplay model.
- Make the browser load arbitrary user-provided `.tmj` maps in this change.
- Change planting rules, crop timings, or the shared multiplayer protocol.

## Decisions

### Adapt the typed map contract, not the dungeon renderer

Create a small farm-map module based on the dungeon's `TiledMap` and `TileLayer` contract. It will generate and validate the fixed habitat map with `Ground` and `Plants` layers. This keeps Tiled's tile IDs and layer ordering explicit while retaining the current fast Canvas 2D render loop. Importing the dungeon's Babylon-specific renderer would violate this project's strict 2D constraint and add unrelated lifecycle complexity.

### Use a 32 px logical grid with 16 px plant sources

All destination cells are 32 × 32 px. The new plant renderer crops selected 16 px cells from `Plants.png` and doubles them with image smoothing disabled. This matches bunny dimensions without resampling their native cells. Switching the whole game to 16 px logical cells would require map, input, and sprite contract changes with no visual benefit.

### Split static terrain from dynamic crop overlays

The generated `Ground` layer is based on existing deterministic terrain. The dynamic `Plants` layer is rebuilt from `state.plots` on every render: empty cells use GID 0, seedlings and mature carrots use distinct plant GIDs. A plot is painted on an explicit dirt ground tile even when planting started on grass, yielding the cultivated-bed presentation shown in the reference images while retaining the original eligibility rule.

### Use deterministic source cells for carrots

The farm asset catalog names the plant sheet and its chosen 16 px seedling and carrot source-cell coordinates. Tests assert the coordinates, frame size, layer data, and draw ordering so future asset replacement cannot silently move carrot visuals.

## Risks / Trade-offs

- [The supplied pack has plant overlays but no terrain sheet] → Retain the existing 32 px environment atlas for grass and dirt and document the two-source contract.
- [Source-cell selection could be accidentally changed] → Centralize coordinates in the farm asset catalog and test them.
- [Tiled formats can contain unsupported layers] → The fixed-map validator accepts only the required map geometry and named tile layers for this runtime contract.
- [Presentation work could affect replication] → Keep map layers derived from the local shared state and do not add actions or transfer fields.

## Migration Plan

1. Add the plant source PNG and document its 16 px source-grid contract.
2. Add the Tiled-compatible farm-map serializer, validator, and Canvas draw helpers.
3. Replace direct terrain and procedural plant drawing with the ordered layer renderer.
4. Verify rules, build output, and a browser session that plants and grows a carrot before rabbit consumption.

Rollback consists of restoring the existing procedural terrain/plant draw path and removing the added asset catalog; simulation and network state remain backward compatible.
