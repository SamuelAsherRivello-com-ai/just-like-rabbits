# Proposal

## Why

The garden's supplied art and Tiled-compatible layers are complete, but the released game still relies on browser-hosted multiplayer simulation and has no GitHub Pages site. The remaining work must make the shared habitat server-authoritative and deliver a public, verified frontend without reopening completed art or tilemap work.

## What Changes

- Replace the host-snapshot relay with a fixed-step, seeded, two-seat server-authoritative `just-like-rabbits` room that validates and broadcasts planting and time-scale actions.
- Update the typed client and browser adapter so clients render authoritative snapshots and expose joining, full-room, disconnect, expiry, retry, and local-input-pause states.
- Complete deterministic coverage for rabbit animation selection and every supported time scale, then prove the shared game in two browser sessions.
- Add a GitHub Pages frontend deployment, verify its public URL against the deployed multiplayer backend, and make the README link point only to that verified demo.
- Release the compatible server/client revision and record version, endpoint, and browser-validation evidence.

## Capabilities

### New Capabilities

- `authoritative-rabbit-habitat`: A bounded server-owned shared habitat with validated actions, client lifecycle feedback, and deterministic shared behavior.
- `published-game-demo`: A GitHub Pages deployment and README contract for a publicly reachable, verified game frontend.

### Modified Capabilities

- None.

## Impact

- Affected systems: the shared Colyseus server, its packaged typed client, the browser multiplayer adapter, deployment automation, GitHub Pages configuration, README, and release evidence.
- Affected behavior: browser clients no longer run the authoritative habitat simulation; the frontend is published from this repository while the multiplayer service remains the verified backend.
- Completed supplied-art and Tiled-map assets remain unchanged except for final deployment verification.
