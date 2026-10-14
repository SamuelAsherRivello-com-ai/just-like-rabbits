# Design

## Context

The released authoritative room has `maxClients = 2`, two player colours/names,
and a snapshot whose rabbit list contains only Hazel and Poppy. The browser
already renders every rabbit from that list, while its HUD displays server
presence. See [proposal.md](proposal.md) for motivation and the capability
specification for observable behavior.

## Goals / Non-Goals

**Goals:**

- Scale one room to twelve human connections without turning rabbits into
  player seats.
- Keep bot selection, movement, and carrot consumption reproducible from the
  authoritative simulation.
- Preserve a small on-screen animal population as human occupancy grows.
- Render the supplied carrot sequence with deterministic one-minute progression
  and correct ground/plant/object layer separation.
- Release a protocol version that keeps the game and server in lockstep.

**Non-Goals:**

- Per-player avatars, chat, ownership of a rabbit, or user-configurable bot
  difficulty.
- Persisting a room across deploys or extending platform session limits.
- Changing the supplied farm or rabbit artwork.

## Decisions

### Separate human presence from rabbit actors

The room will set its human `maxClients` to 12 and generate names and colours
from twelve-item deterministic catalogues. Presence remains an array of human
connections. Rabbit actors remain simulation data and gain a discriminant such
as `kind: "resident" | "bot"`; they never appear in presence or consume a
seat. This avoids a misleading `players/capacity` HUD and keeps client input
authority unchanged. Treating bot rabbits as clients was rejected because it
would consume admission capacity and introduce needless socket lifecycle work.

### Use deterministic occupancy bands for bot population

After each join/leave, the room will reconcile bots against the current human
count: 1–4 humans => 3 bots; 5–8 => 2; 9–12 => 1. Bots use stable IDs and
deterministic spawn points; removed bots are cleared safely, including an
in-progress carrot target. The fixed simulation continues to own all bot
decisions. A fixed three-bot population was rejected because the requested
range supports reducing visual and simulation load as the room fills.

### Version server and client together

The shared client types will include the rabbit discriminator and advertised
capacity. The consumer will update its pinned tarball only after the server
release has passed its established checks. This is a deliberate compatible
schema extension but a release is still required because the previous server
enforces a different capacity.

### Model crop soil, growth, and harvest separately

The authoritative habitat will store cultivated ground independently from a
plant's age/stage and from a mature carrot object. A plant action changes a
valid ground cell to cultivated dirt at elapsed time zero. The renderer maps
the four supplied cells `(9,24)`, `(10,24)`, `(11,24)`, and `(12,24)` to
elapsed windows 0–14.9, 15–29.9, 30–44.9, and 45–59.9 seconds. At 60 seconds
the final carrot is emitted as a top-layer object and the plant overlay is
removed. This preserves dirt after harvest and keeps rabbit food targeting
unambiguous. Reusing the mature plant frame as both crop and food was rejected
because it cannot show the requested object-on-dirt result.

## Risks / Trade-offs

- [Twelve clients increase broadcast work] → Keep the fixed 100 ms tick and
  compact snapshots; prove capacity and late-join behavior with an integration
  test before release.
- [Bot removal can leave stale carrot targets] → Reconcile actor lists only at
  a tick boundary and have the existing target-validity logic clear invalid
  targets.
- [Old consumer tarballs show an incorrect two-player assumption] → Release
  the typed package and pin the new verified tarball before Pages deployment.
- [Ground/object migration may break old snapshots] → Treat new crop fields as
  an atomic protocol version and cover late-join snapshot rendering.
- [Public room is occupied during verification] → Use an otherwise empty room
  or isolated intended endpoint for the twelve-client test, then verify Pages
  against the released stable endpoint.

## Migration Plan

1. Add server simulation, room, shared-client, crop-stage/object, and integration coverage.
2. Run server source, type, package, and capacity/lifecycle verification;
   publish the compatible server/client release through the existing workflow.
3. Update the game dependency, HUD/docs, and focused browser/unit tests.
4. Deploy Pages and validate a 12-client capacity flow plus supplied-art bot
   and carrot-growth rendering. Roll back by redeploying the prior compatible server/client
   release and restoring the prior pinned tarball if the new release fails.
