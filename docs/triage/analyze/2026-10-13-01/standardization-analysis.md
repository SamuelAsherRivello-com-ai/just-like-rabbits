[Overview](overview.md) · Standardization analysis · [Architecture analysis](architecture-analysis.md) · [Verification baseline](verification-baseline.md) · [Back](overview.md)

# Standardization Analysis

`standards-document.md` has not been customized by user. Using defaults.

## Observations

| # | Finding | Evidence | Delta and owner |
| --- | --- | --- | --- |
| STND01 | Strict TypeScript baseline | `tsconfig.app.json` enables strict, checked indexing, exact optionals, override checks, and verbatim modules; `npm run typecheck` passed. | Aligned. |
| STND02 | Discoverable local quality commands | `package.json` exposes typecheck, test, build, and source checks; README repeats them. | Aligned; CI is the remaining delivery gap. |
| STND03 | Missing project-level instructions | No repository `AGENTS.md` exists; current constraints are only in the active task and package docs. | Standardize candidate: add concise canonical project guidance. |
| STND04 | Documented assets and setup | README and `public/assets/ASSETS.md` identify source, frame dimensions, licensing, and replacement path. | Aligned. |

## Repository integrity

| # | Candidate | Classification | Evidence and limits | Recommended owner |
| --- | --- | --- | --- | --- |
| INTG01 | `vendor/rmc-multiplayer-client-0.9.13.tgz` | intentionally future-facing | Referenced by package lock and README; package was verified as a typed artifact. | N/A |
| INTG02 | `just-like-rabbits-*.png` | orphan candidate | Browser screenshots exist but are not linked from README. They may be retained as evidence. | Standardize |
| INTG03 | OpenSpec change artifacts | intentionally future-facing | Required by the active implementation workflow. | N/A |

## AI readiness

| # | Area | Status | Evidence | Practical improvement |
| --- | --- | --- | --- | --- |
| READY01 | Canonical agent instructions | missing | No root `AGENTS.md`. | Add focused guidance for source, checks, assets, and local server dependencies. |
| READY02 | Command discovery | nailed | README and `package.json`. | Keep commands synchronized. |
| READY03 | Project orientation | partial | README explains behavior; source is compact. | Add a small module map when source grows. |
| READY04 | Definition of done | partial | OpenSpec tasks list verification, but no durable CI/release checklist. | Add CI or a documented gate. |
| READY05 | Maintenance relationships | partial | Asset and server evidence docs exist. | Link screenshots and server version evidence in release docs. |
| READY06 | Safety boundaries | partial | `.gitignore` protects dependencies/output; no `.aiignore` is needed from current evidence. | Keep secrets in `.env.local`; do not commit production credentials. |
