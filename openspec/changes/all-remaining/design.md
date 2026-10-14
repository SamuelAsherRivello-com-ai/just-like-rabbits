# Design

## Context

See `proposal.md` for motivation. The completed art and tilemap changes render a local deterministic simulation with supplied PNG assets. The current browser adapter elects a host browser to publish snapshots, while the existing multiplayer plan calls for a two-seat authoritative Colyseus room. The newly published GitHub repository has no Pages workflow or Pages site, and the README currently links to a Vercel frontend.

## Goals / Non-Goals

**Goals:**

- Make the server the sole owner of fixed-step habitat state and action validation.
- Preserve the Canvas 2D renderer as a projection of authoritative snapshots.
- Publish the frontend on GitHub Pages while using the verified Vercel service only as the multiplayer backend.
- Require repeatable automated and real-browser release evidence before updating the README live-demo link.

**Non-Goals:**

- Altering the completed 32 px Tiled-compatible map contract, supplied art sources, or core carrot rules.
- Adding persistence, anonymous recovery after room expiry, cross-instance room recovery, or a new backend provider.
- Publishing a release or changing production services during this planning change.

## Decisions

### Move the existing deterministic model to the room boundary

The shared room will own a seeded model and advance it in fixed 100 ms ticks. The browser will send typed planting and scale-change intents, then draw returned snapshots. Keeping the existing model semantics reduces game-rule drift. Continuing host-browser authority is rejected because it cannot enforce room capacity or action ordering independently of a participant.

### Version the typed protocol before switching the browser

The server and packed typed client will gain snapshot and lifecycle types together. The game will consume that published contract before local ownership is removed. This avoids an untyped adapter that can silently accept stale server messages.

### Deploy only static frontend files to Pages

The repository workflow will build Vite with a Pages-safe base path, publish the build artifact, and expose the static game through GitHub Pages. The workflow will provide the released backend endpoint as build configuration without committing credentials. Vercel remains the backend because Pages cannot host the Colyseus room.

### Gate README promotion on release evidence

The deployment workflow will be followed by independent desktop and portrait browser checks against the Pages URL and released endpoint. The README will use the Pages URL only after asset loading, interaction, shared synchronization, lifecycle messaging, and console checks pass. Keeping the existing Vercel frontend link is rejected because it is not a verified Pages deployment.

## Risks / Trade-offs

- [A Vercel room can expire or route to another instance] → show expiry clearly, offer a fresh-room retry, and do not claim persistence.
- [Pages asset paths can break below a repository subpath] → build and browser-test the deployed site at its final Pages URL.
- [Server and client package revisions can drift] → compile the game against the packed client and record the exact version and revision in release evidence.
- [A public frontend can reach an unavailable backend] → block README promotion until a live two-session probe succeeds.

## Migration Plan

1. Implement and test room-owned simulation, validation, and two-seat capacity in the shared server.
2. Publish the compatible typed client, adapt the game to snapshots, and remove browser authority.
3. Add the Pages build-and-deploy workflow and configure the production backend endpoint through deployment configuration.
4. Run unit, integration, two-client, desktop, portrait, and sustained-session checks against the release candidate.
5. Promote the verified Pages URL in the README and retain the preceding deployment as the rollback reference.
