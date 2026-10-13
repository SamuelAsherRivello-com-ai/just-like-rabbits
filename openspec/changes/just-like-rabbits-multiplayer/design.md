# Design

## Context

The repository is a newly initialized OpenSpec project with no application source. See `proposal.md` for motivation and the three delta specifications for behavior. The user requires a pure straight-down 2D game, while the game-creation workflow requires Babylon Lite's WebGPU 2D Pixel Perfect policy and shared Colyseus multiplayer.

## Goals / Non-Goals

**Goals:**

- Keep all authoritative state and timing in deterministic, renderer-independent TypeScript rules.
- Deliver a cooperative two-player room where planting and time scale are server-authoritative.
- Render only a pixel-perfect 2D tilemap and 2D rabbit sprites; no scene geometry or perspective camera.
- Keep pointer-to-tile conversion and HUD independent of viewport orientation.

**Non-Goals:**

- Controlling rabbits directly, player avatars, chat, persistence across rooms, match-making beyond room join/create, or continuity after a Vercel function expiry.
- 3D rendering, procedural multiplayer fallback, or a guarantee that reconnect restores a room.

## Decisions

### Deterministic fixed-step rules core

Use integer simulation ticks (100 ms base) and a seeded PRNG per room. The authoritative update receives elapsed server time, advances fixed ticks multiplied by the selected scale, and emits serializable state. Growth records the planting tick and matures at 200 ticks at 1x-equivalent time. Rabbit choices use the seeded PRNG and bounded grid pathfinding; target failure clears the target and assigns a cool-down before reconsidering it.

An event-driven wall-clock implementation was considered but rejected because it makes carrot timing and two-client tests harder to reproduce.

### 2D pixel pipeline

Render a fixed logical-resolution tile canvas through the Babylon Lite WebGPU 2D Pixel Perfect policy, scaling only with nearest-neighbor sampling. The renderer consumes state snapshots and asset atlases, while canvas coordinates are inverted to grid coordinates through the same viewport transform. Environment art is an atlas distinct from the rabbit animation atlas. The renderer owns no game state.

An orthographic 3D scene was rejected because it conflicts with the explicit no-3D/no-2.5D visual contract.

### Server-authoritative shared room

Extend the shared Colyseus server first with a `just-like-rabbits` two-seat room. It owns the fixed-step rules, validates `plant` and `setTimeScale`, serializes snapshots/deltas, and publishes connection lifecycle events. The exact released shared client tarball and endpoint are pinned in the game client. Client rendering interpolates visual position but never independently resolves plants, growth, rabbit choices, or time scale.

Peer-to-peer and a client-authoritative model were rejected because concurrent planting would be non-deterministic and easier to corrupt.

### Interaction and feedback

Client input sends only a grid coordinate to the room. The UI immediately presents a non-authoritative pending state, reconciles with the authoritative response, and displays a subtle pulse for invalid targets. A local pause disconnects inputs and animation update only; it neither sends pause nor affects room ticks.

### Responsive layout

Use a landscape-first game viewport with an adaptive HUD. On portrait screens, stack compact controls above/below the map while retaining a minimum logical tile size and safe touch target dimensions. Counts and time scale remain text-visible.

## Risks / Trade-offs

- [Vercel Hobby functions can expire or route clients to different instances] → Bound sessions, surface loss honestly, add retry/new-room UI, and test the 240-second probe below the configured 300-second limit.
- [Network delay makes a planted tile feel late] → Render a pending marker and reconcile against server state rather than mutating local map state.
- [Art licensing/replacement can be unclear] → Include local source files, license/provenance records, and a documented atlas contract.
- [High scales can skip state transitions] → Advance every fixed tick internally even when a render frame spans multiple ticks.
- [WebGPU is unavailable] → Show a clear initialization/unsupported-browser error without substituting 3D or silently changing render policy.

## Migration Plan

1. Implement and test the shared server room, client lifecycle additions, and deployment probe; release a compatible typed client artifact.
2. Create the game client pinned to that release and verify local two-client behavior.
3. Deploy the game only after server and client checks pass; retain the previous stable game/server revisions for documented rollback.
4. On rollback, repoint the game to the prior compatible server release and redeploy; do not delete active rooms or promise state recovery.
