# Design

## Context

See [proposal.md](proposal.md) for motivation. The current canvas composition requests a legacy five-cell SVG terrain sheet and retains drawn-shape rabbit fallback code. Supplied rabbit sheets are already represented as 32 by 32 px horizontal frames; the farm pack is a 16 px source grid rendered onto the same 32 px destination grid.

## Goals / Non-Goals

**Goals:**

- Make a single farm-pack atlas contract own grass, cultivated dirt, carrots, and any retained in-world decoration.
- Make the existing rabbit catalog own all rabbit presentation without a hand-drawn fallback.
- Preserve deterministic habitat state and the two data layers while turning failed asset loads into a visible presentation error.

**Non-Goals:**

- No simulation, AI, map-size, multiplayer-protocol, or UI redesign.
- No new third-party art, generated imagery, or replacement gameplay system.
- No requirement to author a static map in the Tiled editor; the existing Tiled-compatible generated map remains valid.

## Decisions

### Preserve the 32 px destination grid

Farm source cells will be selected from the supplied 16 px sheet and scaled by an integer factor of two. Bunny frames already occupy 32 px cells. This keeps mouse targeting and rendering geometry stable. Changing logical tile size would ripple into simulation coordinates and is unnecessary.

### Use an explicit supplied-terrain catalog

The implementation will inspect the confirmed farm-pack PNG folder, copy only required terrain source artwork into the public runtime assets, and record grass/dirt source-cell coordinates beside the existing carrot catalog. This is preferable to hard-coding visual coordinates in the renderer because asset selection remains testable and documented.

### Fail visibly instead of drawing legacy fallback art

Image-load readiness will be aggregated before normal map presentation. A missing required asset will show a clear canvas/UI error state. This honors exclusive asset provenance; a colored rectangle or old SVG fallback would hide a broken asset pipeline and violate the requirement.

### Retire legacy runtime references

The environment SVG and obsolete rabbit sprite source will be removed from the in-world runtime path and documentation. Removing their references rather than leaving dormant fallbacks makes automated checks for the exclusive-source contract meaningful.

## Risks / Trade-offs

- [The source folders are currently unavailable at the confirmed Windows paths] → Re-establish those paths before implementation; do not guess terrain cells or substitute different art.
- [The farm pack may not contain a visually suitable terrain cell] → Stop implementation and report the missing source rather than generating or reusing terrain art.
- [A required image fails in a browser] → Keep a visible error state and test it independently from game simulation.
- [Integer scaling can make tiles look larger than source previews] → Retain nearest-neighbor scaling and the shared 32 px logical grid.

## Migration Plan

1. Inventory the restored supplied folders and copy the selected runtime images with provenance.
2. Replace the legacy atlas and rabbit fallback paths together so no mixed-art frame is possible.
3. Update contracts and tests, then verify a planted carrot and rabbit animation in the browser.
4. Roll back by restoring the prior asset references only if the supplied asset folders prove incomplete; do not silently ship a mixed-art state.
