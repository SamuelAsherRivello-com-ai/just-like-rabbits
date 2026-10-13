# Proposal

## Why

Create a calming, readable cooperative rabbit-habitat simulation that lets players plant food while autonomous rabbits live naturally in a shared tile-based world. The new project needs an explicit 2D-only rendering, authoritative multiplayer, and deterministic simulation contract from the outset so its behavior can be tested and extended safely.

## What Changes

- Add a strict TypeScript browser game titled **Just Like Rabbits** with a straight-down, grid-aligned 2D habitat, documented replaceable environment and rabbit-sprite assets, and responsive desktop/mobile presentation.
- Add deterministic autonomous rabbit simulation with the `idle`, `wander`, `seekCarrot`, `moveToCarrot`, `eatCarrot`, `hide`, and `rest` states; tile-by-tile movement; safe failed-target recovery; sprite-sheet animation; and a consistently scaled day/night cycle.
- Add shared multiplayer habitat sessions: two players can join one bounded room, see the same authoritative map, carrot lifecycle, rabbits, simulation clock, and time-scale choice, and receive clear connection/recovery feedback.
- Add map-only planting interaction with immediate seedling feedback, exactly 20 simulated seconds to maturity at 1x, concurrent growth, and clear invalid-tile feedback.
- Add an accessible HUD with title, controls, counts, and time-scale selector, plus setup, controls, lifecycle, state-machine, asset-provenance, and hosting-limit documentation.

## Capabilities

### New Capabilities

- `rabbit-habitat-simulation`: Deterministic 2D habitat map, planting/growth lifecycle, autonomous rabbit behavior, time scaling, and player-visible simulation feedback.
- `shared-rabbit-habitat`: Authoritative bounded multiplayer rooms, state synchronization, connection lifecycle, shared controls, and recovery behavior.
- `rabbit-habitat-interface`: Responsive 2D game presentation, map-targeted pointer/touch controls, HUD readability, and asset provenance/documentation.

### Modified Capabilities

None.

## Impact

- Adds the initial Vite/React/Babylon Lite 2D client, deterministic rules package, tileset and rabbit-sprite assets, tests, TypeScript tooling, and README.
- Extends the shared Colyseus multiplayer server and its client package with a game-specific room, validation, lifecycle coverage, release/deployment evidence, and production endpoint configuration.
- Requires WebGPU-capable browser validation, two-client synchronization checks, and documentation of Vercel Hobby room-duration/state-loss constraints.
