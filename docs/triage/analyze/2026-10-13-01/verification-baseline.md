[Overview](overview.md) · [Standardization analysis](standardization-analysis.md) · [Architecture analysis](architecture-analysis.md) · Verification baseline · [Back](overview.md)

# Verification Baseline

| # | Check or scenario | Source and scope | State | Result or limitation |
| --- | --- | --- | --- | --- |
| VERI01 | `npm run typecheck` | `package.json`; application and test TypeScript. | run | Passed. |
| VERI02 | `npm test` | Vitest rule/coordinate tests. | run | Passed: 9 tests. |
| VERI03 | `npm run check:typescript-source` | Rejects authored JS/JSX/CJS/MJS beneath source/tool roots. | run | Passed. |
| VERI04 | `npm run build` | Typecheck plus Vite production build. | run | Passed. |
| VERI05 | Two browser sessions | Local Vite game plus local Colyseus room. | run | Host planting and guest time-scale change synchronized; no console errors. |
| VERI06 | Shared client package | Server `verify:client-package`. | run | Passed clean typed packed-consumer verification for 0.9.13. |
| VERI07 | Production endpoint/release | Shared server release workflow and public endpoint. | discovered | Not run; no deployment was authorized or verified. |

Recommended order for future changes: source check, typecheck, unit tests, production build, then two-client browser validation against the intended endpoint.
