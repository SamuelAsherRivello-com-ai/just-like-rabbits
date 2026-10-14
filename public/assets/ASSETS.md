# Art sources

All in-world artwork is copied from the owner-approved `C:\Users\srive\Desktop\Desktop\Archive Of Tilesets To Copy From` archive. The interface uses project-authored text and HTML only.

- `farm-plants.png` comes from `free-plants-for-farm\PNG\Plants.png`. It is a 48 × 27 grid of 16 × 16 px source cells; the renderer doubles selected cells to the habitat's shared 32 × 32 px destination grid. Grass uses `(9, 25)`, cultivated dirt uses `(18, 22)`, the carrot seedling uses `(9, 24)`, and the mature carrot uses `(11, 24)`.
- `rabbit/` contains nine 32 px-high horizontal PNG sprite sheets. Every cell is 32 × 32 px and is played by `src/rabbit-animation-catalog.ts`: Idle (8 frames), Run (5), CarrotSkill (15), LieDown (2), Sleep (2), Sitting (3), Attack (7), Hurt (3), and Dead (9).
- Habitat state maps to the visible sheets as follows: idle → Idle; wander, seekCarrot, and moveToCarrot → Run; eatCarrot → CarrotSkill; hide → LieDown; rest → Sleep. Sitting, Attack, Hurt, and Dead are registered and available for later behaviors but are not currently selected by the habitat rules.

The Tiled-compatible farm map keeps `Ground` (farm-sheet terrain) below `Plants` (dynamic seedling and carrot overlays), with animated rabbits rendered last. Replace either asset set with matching frame dimensions (or update `src/farm-assets.ts` or `src/rabbit-animation-catalog.ts`). Art remains separate from deterministic rules and multiplayer state; missing supplied art surfaces a visible load failure rather than legacy-game artwork.
