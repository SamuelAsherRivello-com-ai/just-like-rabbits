# Shared Multiplayer Server Evidence

Released 2026-10-14: `SamuelAsherRivello-com-ai/rmc-colyseus-multiplayer-server` on its `main` branch.

- Root instructions: `AGENTS.md`; root verification commands: `npm ci`, `npm run typecheck`, `npm test`, and `npm run dev`.
- Game rooms and tests live under `multiplayer-server/src/` and `multiplayer-server/test/`.
- The reusable browser client and its API documentation live under `multiplayer-server/packages/client/`.
- The supported-game registry is under `multiplayer-server/documentation/games.md`; release and deployment workflows are in `.github/workflows/`.
- Releases produce a typed client tarball, and consumers pin its exact release URL.
- `just-like-rabbits` is server-authoritative at revision `73f32a0beeac4b32c7d236973b17e9f0f298cf42`, published as [client/server release v0.9.14](https://github.com/SamuelAsherRivello-com-ai/rmc-colyseus-multiplayer-server/releases/tag/v0.9.14).
- The released stable endpoint is `https://rmc-colyseus-multiplayer-server.vercel.app`; its two-seat room accepts validated planting and time-scale intent, advances 100 ms fixed steps, and broadcasts the authoritative snapshot.
- The release workflow completed successfully on 2026-10-14 after staged full-game checks, a 240-second relay session, a 240-second Space Invaders host-migration session, a 600-second Asteroids continuity/renewal session, and stable production checks.
- Public Pages validation used the live demo in independent desktop and 390 x 844 portrait sessions. Each rendered supplied farm/rabbit art and reported `Connected · 2/2 players`; the deliberate third-seat attempt returned the visible full-room message, and after the desktop test closed, portrait `Retry room` reclaimed the released seat. The final portrait run planted a carrot (`Plots: 1`), exercised 0.5x/1x/2x/4x/10x, and had zero errors or warnings.
- The service remains in-memory: deploys, expiry, route changes, or function/session limits can end a room. The client exposes retry and does not promise persistence.
