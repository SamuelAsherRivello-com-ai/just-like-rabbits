# Proposal

## Why

The rabbits now use supplied sprite sheets, but the playable habitat still shows the repository's legacy environment SVG and fallback-drawn rabbit shapes when an image is unavailable. The owner confirmed that the two supplied art folders are the complete visual source of truth, so the game must stop presenting any prior game art.

## What Changes

- Replace the legacy environment SVG atlas and all canvas-drawn rabbit fallback art with assets sourced only from `32PixelBunny/PNG` and `free-plants-for-farm/PNG`.
- Import the supplied farm pack's terrain tiles for grass and cultivated dirt, alongside the existing supplied carrot overlays, on the shared 32 px destination grid.
- Keep the `Ground`, `Plants`, and `Rabbits` order, but render every in-world visual from the supplied packs; text-and-HTML UI remains intentionally authored in the project.
- **BREAKING**: Remove the legacy environment atlas from the runtime asset contract and reject rendering paths that silently fall back to prior artwork.
- Update asset provenance and the README so the two supplied folders are the sole in-world art sources.

## Capabilities

### New Capabilities

- `supplied-game-art`: Defines the exclusive source, loading, and layered rendering contract for all in-world rabbit-habitat art.

### Modified Capabilities

- None.

## Impact

- Affected code: farm asset selection, farm renderer, canvas composition, rabbit image loading and its unavailable-asset behavior.
- Affected assets: legacy `environment-tiles.svg` and `rabbit-sprites.svg` are removed from runtime use; imported PNGs come only from the confirmed supplied folders.
- No deterministic simulation rules, multiplayer messages, or external runtime dependencies change.
