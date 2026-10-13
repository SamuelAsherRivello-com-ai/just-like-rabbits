[Overview](overview.md) · [Standardization analysis](standardization-analysis.md) · Architecture analysis · [Verification baseline](verification-baseline.md) · [Back](overview.md)

# Architecture Analysis

## Module map and observations

| # | Module | Responsibility | Evidence |
| --- | --- | --- | --- |
| ARCH01 | `src/simulation.ts` | Deterministic map, growth, rabbit state, timing, and sprite-frame rules. | Imported by tests and browser entrypoint without DOM dependencies. |
| ARCH02 | `src/coordinates.ts` | CSS-pointer to logical-grid conversion. | Unit tested independently. |
| ARCH03 | `src/main.ts` | DOM setup, canvas presentation, user input, Colyseus lifecycle, and host snapshot publication. | Current browser entrypoint. |
| ARCH04 | `public/assets/` | Separate environment and rabbit sprite atlases. | Documented 32px atlas contract. |

`simulation.ts` has a meaningful test seam and owns mutable habitat state. `main.ts` is an acceptable composition root for the current size, but it mixes five changing concerns. Extracting a session adapter and renderer is the next architectural seam when lifecycle/error handling expands.

| # | Candidate | Expected value | Risk / non-goal | Urgency and owner |
| --- | --- | --- | --- | --- |
| ARCH05 | Extract a `HabitatSession` adapter | Isolate Colyseus events, local/host authority, retries, and snapshot serialization. | Do not change server protocol or simulation outcomes. | Medium, Rearchitect |
| ARCH06 | Extract canvas renderer | Make visual regression and sprite-state checks easier. | Do not introduce 3D rendering. | Low, Rearchitect |

Dependency direction is currently sound: browser adapter depends on rules and client package; rules depend on neither. The main pressure point is `main.ts` owning both authority handoff and direct canvas drawing.
