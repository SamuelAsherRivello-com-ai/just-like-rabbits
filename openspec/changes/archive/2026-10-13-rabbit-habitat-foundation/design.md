# Design

## Context

The archived foundation is a pure 2D browser game. Simulation state is serializable and deterministic locally; multiplayer clients use the existing typed shared-room client, with the elected browser host relaying snapshots to guests.

## Goals / Non-Goals

**Goals:**

- Keep simulation rules independent of Canvas rendering.
- Preserve a straight-down tile grid and separate, replaceable environment and rabbit atlases.
- Make a playable deployment reproducible with the Vercel production endpoint configuration.

**Non-Goals:**

- This record does not add a new server room, promote a shared-server release, or promise durable rooms, anonymous deployment access, or cross-instance recovery.

## Decisions

### Canvas 2D presentation

Use a pixel-aligned Canvas 2D renderer rather than a 3D or 2.5D scene. This directly preserves the requested top-down grid interaction and has no WebGPU dependency.

### Fixed-step local habitat model

Advance the seeded simulation in 100 ms steps. Each plot stores its simulated planting time; mature carrots appear at 20 scaled seconds, and rabbits choose bounded tile-by-tile actions from deterministic state.

### Existing shared-room integration

Use the verified packed `@rmc/multiplayer-client` artifact and the registered `just-like-rabbits` room. The browser host publishes transferable snapshots, while guests send validated gameplay requests through the room.

## Risks / Trade-offs

- [Vercel-hosted room state can expire or route to another instance] -> expose retry and preserve the backend's documented duration limits.
- [Deployment protection restricts anonymous play] -> retain protection and document that a Vercel-authorized browser is needed.
- [Host relay is not a server-authoritative simulation] -> leave authority hardening in the follow-on change.

## Migration Plan

1. Preserve the delivered code and production deployment as the baseline.
2. Address server authority, exhaustive lifecycle tests, and release gates in the follow-on change without rewriting the foundation.
