# Tasks

## 1. Supplied asset inventory and contract

- [x] 1.1 Inspect the confirmed rabbit and farm PNG folders, copy only the required supplied runtime files, and verify recorded source dimensions and provenance match the copied assets.
- [x] 1.2 Extend the farm asset catalog with the inspected supplied grass and cultivated-dirt source cells and verify unit tests assert their regions and shared 32 px destination grid.
- [x] 1.3 Update `public/assets/ASSETS.md` and the README to name only the two confirmed supplied folders as in-world art sources and verify every documented runtime path exists.

## 2. Exclusive layered rendering

- [x] 2.1 Replace the legacy environment atlas with the supplied farm terrain art in the `Ground` layer and verify renderer tests cover grass and planted dirt source regions.
- [x] 2.2 Retain supplied seedling and mature carrots in the `Plants` layer above dirt and verify tests cover the full seedling, mature, and removed lifecycle.
- [x] 2.3 Remove all legacy rabbit-shape and terrain fallback drawing, add a visible required-asset failure state, and verify focused tests cover unavailable supplied images without requesting prior art.

## 3. Integration verification

- [x] 3.1 Run `npm run check:typescript-source`, `npm run typecheck`, `npm test`, and `npm run build`; verify all complete successfully.
- [x] 3.2 Run the local habitat and verify in a browser that supplied grass/dirt, a growing carrot, and animated supplied rabbits render in `Ground`, `Plants`, `Rabbits` order with no legacy-art requests or browser-console errors.
