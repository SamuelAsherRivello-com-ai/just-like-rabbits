# Tasks

## 1. Farm map and asset contract

- [x] 1.1 Copy the supplied plant sheet into the public asset set and define its 16 px source-grid, seedling, and mature-carrot cells; verify the documented paths and cell coordinates exist.
- [x] 1.2 Add a typed, Tiled-compatible 18 by 12 orthogonal farm-map module that emits and validates ordered `Ground` and `Plants` layers; verify unit tests cover geometry, layer ordering, and invalid maps.
- [x] 1.3 Build dynamic plant-layer data from the deterministic plot state while forcing planted cells to dirt; verify unit tests cover empty, seedling, mature, and removed carrot cells.
- [x] 1.4 Document the combined 32 px destination grid, environment terrain source, and farm plant source in the asset guide and README; verify every documented runtime asset path exists.

## 2. Layered canvas composition

- [x] 2.1 Replace direct procedural terrain and plant drawing with the ordered Tiled farm-layer renderer; verify canvas draw helpers use nearest-neighbor scaling and 32 px destination cells.
- [x] 2.2 Render selected 16 px plant cells as seedling and mature carrot overlays above dirt; verify focused renderer/catalog tests assert both source regions and draw order.
- [x] 2.3 Keep animated rabbit playback above all farm layers and preserve presentation-only state mapping; verify rabbit catalog and simulation tests still pass without changing multiplayer transfer types.

## 3. Integration verification

- [x] 3.1 Run `npm run check:typescript-source`, `npm run typecheck`, `npm test`, and `npm run build`; verify all complete successfully.
- [x] 3.2 Start the documented local app and use browser automation to plant a carrot, advance time to show its mature overlay, and confirm the rabbit canvas stays visible above the map; verify clean browser console output.
