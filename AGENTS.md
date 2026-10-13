# Repository Guidance

## Scope

`src/simulation.ts` owns deterministic habitat rules. Keep it independent of DOM, canvas, and multiplayer-client imports so rule tests remain fast and reproducible.

`src/main.ts` is the browser composition root. Preserve the strictly 2D, straight-down canvas presentation; do not introduce 3D scenes, perspective cameras, or billboarded assets.

Environment tiles and rabbit sprites are separate replaceable assets in `public/assets/`. Update `public/assets/ASSETS.md` and the README when their atlas contract changes.

## Quality gate

Run these before handoff:

```sh
npm run check:typescript-source
npm run typecheck
npm test
npm run build
```

For shared habitat changes, also use two browser sessions against the intended Colyseus endpoint and verify planting, a time-scale change, and clean browser consoles.

## Safety

Keep endpoint overrides in `.env.local`; do not commit service credentials. Preserve the pinned shared-client tarball under `vendor/` unless replacing it with a verified compatible package.
