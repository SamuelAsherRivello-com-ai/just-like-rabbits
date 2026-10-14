# Proposal

## Why

The public habitat currently rejects a third person because the authoritative room has only two seats. Players should be able to share one garden without seeing a full-room message until twelve human players are present, while autonomous rabbits keep the garden lively.

## What Changes

- Raise the authoritative `just-like-rabbits` human-player capacity from 2 to 12 and surface the correct capacity in the browser HUD.
- Keep rabbit actors separate from human presence and add a deterministic, capacity-adaptive population of 1–3 autonomous bot rabbits: three at 1–4 humans, two at 5–8, and one at 9–12.
- Replace the two-stage, 20-second crop with a four-frame supplied-art carrot lifecycle: planted sprout, early growth, near-mature growth, and a harvestable carrot after one simulation minute at 1x.
- Convert a planted grass or soil cell into persistent cultivated dirt; after maturation, render the carrot as a separate object above that dirt rather than as the ground tile.
- Preserve server authority for planting, time-scale changes, rabbit simulation, capacity enforcement, late joins, disconnects, expiry, and retry.
- **BREAKING** Update the shared typed client contract and release it with the server because consumers currently assume a two-seat room.
- Update the game documentation and public browser evidence to describe twelve human seats and bot rabbits.

## Capabilities

### New Capabilities

- `scaled-rabbit-habitat`: A shared authoritative habitat that admits up to twelve human players while maintaining a deterministic non-human rabbit population.

### Modified Capabilities

- None.

## Impact

- Server: `just-like-rabbits-authoritative-room`, deterministic habitat simulation, shared-client protocol, focused and integration tests, versioned release workflow.
- Game: typed-client tarball, connection HUD/copy, renderer behavior for the extra rabbit actors and four-frame crop/object layering, README, and Pages playtest evidence.
- Operations: a compatible shared-server release and public Pages validation are required before the new capacity is advertised.
