# Proposal

## Why

Record the completed, playable foundation of Just Like Rabbits separately from the remaining server-hardening and release-verification work. This leaves a truthful archival record of the delivered browser game without overstating unfinished guarantees.

## What Changes

- Deliver the strict TypeScript Canvas 2D rabbit habitat with a grid map, planting, independent carrot growth, day/night tint, and deterministic rabbit behavior.
- Deliver replaceable original SVG environment and rabbit sprite assets, responsive pointer/touch controls, HUD controls, local setup documentation, and test evidence.
- Integrate the game with the existing shared `just-like-rabbits` Colyseus room using the packed typed client, including host snapshot relay, guest plant/time-scale actions, retry, and local-input pause.
- Publish a protected Vercel production build configured for the shared multiplayer endpoint.

## Capabilities

### New Capabilities

None. This archival record documents already-delivered behavior; it does not introduce a new behavioral contract.

### Modified Capabilities

None.

## Impact

- Adds the Vite/TypeScript game, Canvas renderer, source assets, tests, README, and multiplayer integration evidence.
- Adds the protected Vercel project and production endpoint configuration.
- Does not claim server-authoritative simulation, unprotected public access, server release promotion, or extended-session guarantees.
