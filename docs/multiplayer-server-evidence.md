# Shared Multiplayer Server Evidence

Inspected 2026-10-13: `SamuelAsherRivello/rmc-colyseus-multiplayer-server` on its `main` branch.

- Root instructions: `AGENTS.md`; root verification commands: `npm ci`, `npm run typecheck`, `npm test`, and `npm run dev`.
- Game rooms and tests live under `multiplayer-server/src/` and `multiplayer-server/test/`.
- The reusable browser client and its API documentation live under `multiplayer-server/packages/client/`.
- The supported-game registry is under `multiplayer-server/documentation/games.md`; release and deployment workflows are in `.github/workflows/`.
- Releases produce a typed client tarball, and consumers pin its exact release URL.
- The current canonical service is Render-hosted, not a Vercel Hobby function. It is an in-memory authoritative process: deploys, process loss, or platform maintenance can end rooms and do not restore their state.
- Adding `just-like-rabbits` therefore requires a server-first room, registry, test, client-package, release, public endpoint, and sustained-session verification change before a production client can claim shared-room support.
