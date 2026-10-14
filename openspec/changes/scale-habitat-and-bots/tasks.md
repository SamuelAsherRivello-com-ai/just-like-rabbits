# Tasks

## 1. Authoritative twelve-seat habitat

- [x] 1.1 Raise the shared `just-like-rabbits` room to twelve human seats with stable twelve-player identity metadata; verify server integration tests admit twelve, reject thirteen, and admit a replacement after leave/expiry.
- [x] 1.2 Extend the deterministic authoritative habitat state with resident/bot rabbit identity and capacity-adaptive reconciliation (3/2/1 bots across the specified occupancy bands); verify rule tests retain Hazel/Poppy, produce the expected bot count/IDs, and keep bot decisions deterministic.
- [ ] 1.3 Keep bot rabbits server-controlled and compatible with planting, growth, carrot targeting, eating, late join, disconnect, and retry; verify two or more room clients receive identical bot/carrot state and no bot takes a human seat.
- [x] 1.4 Replace the two-stage crop state with cultivated dirt, four 15-second growth stages, and a 60-second harvestable carrot object; verify deterministic rules tests cover all transitions, time-scale continuity, rabbit eating, and replanting after harvest.

## 2. Versioned client and game presentation

- [x] 2.1 Update and pack the shared typed client contract for twelve-seat presence and distinguished rabbit actors; verify a strict consumer compiles against the packed artifact and the server package checks pass.
- [ ] 2.2 Update the game to pin the released compatible client, render each supplied-art bot rabbit, and show `n/12` human occupancy without a full-room message below capacity; verify focused TypeScript/unit tests and browser rendering cover the extra rabbits.
- [ ] 2.3 Document the twelve-human capacity, capacity-adaptive bot rabbits, release version, and in-memory retry/expiry limits in the game and server docs; verify documented commands and links resolve.
- [ ] 2.4 Map the supplied carrot cells `(9,24)` through `(12,24)` to plants/object layers above cultivated dirt; verify renderer tests and a browser screenshot show all layer states without legacy art.

## 3. Release and public playtest

- [ ] 3.1 Run required server source/type/package/integration checks and publish the compatible shared server/client through its existing release workflow; verify the stable endpoint reports and enforces twelve seats.
- [ ] 3.2 Run the game source/type/test/build gates and deploy the Pages frontend against the compatible release; verify the production build carries only supplied farm/rabbit assets.
- [ ] 3.3 Playtest the released Pages game with independent browser sessions: verify twelve human joins, thirteenth-full behavior, departure/expiry retry, planting, a time-scale change, 1–3 bot rabbits, four carrot stages over one minute, cultivated dirt and harvest-object layering, supplied-art rendering, and clean browser consoles.
