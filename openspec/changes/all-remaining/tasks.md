# Tasks

## 1. Server-authoritative habitat

- [x] 1.1 Inspect the shared Colyseus server and replace host-snapshot relay behavior with a seeded fixed-step, two-seat `just-like-rabbits` room; verify room-rule tests cover initial state and 100 ms progression.
- [x] 1.2 Validate ordered planting and time-scale actions in the room, enforce two-seat capacity, and expose full/loss outcomes; verify integration tests cover duplicate plot contention, invalid actions, and third-client rejection.
- [x] 1.3 Version and pack the typed shared-client contract for authoritative snapshots and lifecycle states; verify a clean strict TypeScript consumer compiles against the packed artifact.
- [x] 1.4 Document the server revision, room limits, retry semantics, and non-persistence limits; verify documented local and release commands run as written.

## 2. Authoritative browser client

- [x] 2.1 Adapt the Canvas client to render authoritative snapshots and send only validated intent; verify two browser sessions observe the same plant, growth, rabbit-eating, and scale-change state.
- [x] 2.2 Implement visible connecting, connected, full-room, disconnected, expired-room, retry, and local-input-pause feedback; verify focused UI tests and browser checks keep the map and HUD visible.
- [x] 2.3 Expand deterministic simulation and animation tests for `0.5x`, `1x`, `2x`, `4x`, and `10x`; verify growth, rabbit cadence, animation timing, and day/night tint continue from current elapsed time.
- [x] 2.4 Capture browser evidence for idle, movement, and carrot-eating rabbit states with supplied art; verify no legacy-art request or console error occurs.

## 3. Public GitHub Pages frontend

- [x] 3.1 Add a repository GitHub Pages build-and-deploy workflow that builds the Vite frontend with Pages-safe asset paths and a non-secret released backend endpoint; verify the production build succeeds without committed credentials.
- [x] 3.2 Configure and publish the repository Pages site; verify its public URL loads the game, supplied assets, and HTML controls without path failures.
- [x] 3.3 Update README deployment instructions and live-demo link only after Pages validation succeeds; verify the link targets the published Pages URL and names the required backend authorization limits.

## 4. Release verification

- [x] 4.1 Release the compatible shared server and typed client through their existing workflow; record exact revisions, endpoint, and release version in the project evidence.
- [x] 4.2 Run the source checker, strict typecheck, unit and integration suites, and production build; verify checks reject invalid disposable and orphan-source fixtures where the existing checker supports them.
- [x] 4.3 Validate the released Pages game in independent desktop and portrait sessions with two connected players; verify planting, every time scale, late join, capacity, disconnect, expiry, retry, assets, and clean consoles.
- [x] 4.4 Run a bounded 240-second shared-session probe and record results; do not promote the README demo if any release probe fails.
