# Tasks

## 1. Shared multiplayer service

- [x] 1.1 Inspect the shared Colyseus server's default branch, instructions, game registry, client package, release/deployment workflow, and current Vercel configuration; verify the discovered paths and hosting constraints are recorded in the server change evidence.
- [ ] 1.2 Add the authoritative two-player `just-like-rabbits` room with fixed-step seeded simulation, validated plant/time-scale actions, snapshot state, and explicit room lifecycle errors; verify server rule and action-validation tests pass.
- [x] 1.3 Add the shared typed client lifecycle contract for joining, full/disconnected/expired feedback, retry, and local input pause; verify a clean typed consumer compiles against the packed released artifact.
- [ ] 1.4 Register and release the server/client revision through its existing workflow, run two-client, late-join, capacity, departure, loss/expiry, and 240-second sustained-session probes, and record endpoint/version/revision evidence.

## 2. Strict client foundation

- [ ] 2.1 Create the Vite/React/Babylon Lite WebGPU 2D Pixel Perfect project structure, pinned strict TypeScript configurations, package lockfile, and no-WebGPU initialization error; verify `npm install`, `npm run typecheck`, and `npm run check:typescript-source` succeed.
- [x] 2.2 Add renderer-independent serializable map, plot, rabbit, simulation-clock, seeded-RNG, and action types shared by tests and client adapters; verify strict unit tests can import the rules without browser or renderer globals.
- [ ] 2.3 Configure environment variables with a documented production endpoint and local override example without browser secrets; verify a production build rejects no required configuration and a local override is consumed by the connection adapter.

## 3. Deterministic habitat rules

- [x] 3.1 Implement grid terrain eligibility, planting validation, independent plot records, and 20-second scaled growth transitions; verify tests cover eligible, ineligible, occupied, simultaneous, and exact-boundary growth cases.
- [ ] 3.2 Implement fixed-step simulation scaling and readable day/night phase calculation for all five scale choices; verify tests prove carrots, rabbit cadence, animation time, and tint phase advance consistently at 0.5x, 1x, 2x, 4x, and 10x.
- [x] 3.3 Implement the two-rabbit state machine, seeded independent choices, tile-by-tile reachability, eating/removal, hiding, resting, and failed-target cool-down recovery; verify transition and unreachable-target tests pass.
- [x] 3.4 Document rabbit state transitions and carrot lifecycle alongside their rule tests; verify the README descriptions match the tested timing and state names.

## 4. Pure 2D world presentation

- [x] 4.1 Add separate replaceable environment-tile and rabbit-sprite atlases with provenance/license records and atlas metadata; verify rendering tests/load checks identify both source assets and no 3D scene assets are used.
- [x] 4.2 Implement the straight-down grid renderer with grass, soil, paths, bushes, plants, planted plots, mature carrots, day/night tint, and nearest-neighbor pixel scaling; verify a screenshot shows aligned 2D tiles with readable night presentation.
- [ ] 4.3 Implement rabbit idle, hop/walk, and eating sprite-sheet animation driven from authoritative state; verify animation-selection tests and a screenshot of each visible state.
- [x] 4.4 Implement responsive landscape/portrait viewport transforms and pointer/touch grid targeting with invalid-target pulse feedback; verify unit tests for coordinate conversion and browser checks for desktop mouse and emulated mobile touch.

## 5. Shared game UX

- [x] 5.1 Connect the renderer and input adapter to the released shared client, rendering authoritative snapshots and reconciling pending plant feedback without local state authority; verify two local browser clients observe the same accepted plant, growth, rabbit, and eaten-carrot changes.
- [x] 5.2 Add the always-readable HUD with title, planting instruction, live planted/mature counts, current scale, and five scale controls; verify UI tests and browser screenshots at desktop and portrait widths.
- [ ] 5.3 Add visible connecting, connected, full, disconnected, expired-room, retry, and local-pause states; verify browser tests cover join, capacity, intentional disconnect, retry, and that local pause sends no actions or shared pause.
- [x] 5.4 Document local setup, run commands, controls, multiplayer capacity/recovery and Vercel duration limits, asset sources/replacement, browser requirements, and screenshots; verify README commands run in a clean checkout.

## 6. Integration verification and delivery readiness

- [ ] 6.1 Run and repair source coverage, strict typecheck, rule/transition tests, UI tests, and production build; verify the TypeScript coverage checker rejects disposable type-error and orphan-source fixtures before removing them.
- [ ] 6.2 Run the required project architecture analysis, create its packet, apply only bounded standardization findings, rerun analysis, and record scores/evidence with any deferred rearchitecture candidates.
- [ ] 6.3 Use two independent headless or minimized WebGPU-capable browser sessions to play the full shared loop at desktop and mobile layouts; verify assets, planting, growth, all time scales, eating, connection lifecycle, console cleanliness, and release-compatible endpoint behavior.
