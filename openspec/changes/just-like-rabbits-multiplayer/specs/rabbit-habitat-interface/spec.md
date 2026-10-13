# Spec Delta

## Purpose

Defines the responsive map controls, HUD, presentation constraints, and documented visual sources for the rabbit habitat game.

## ADDED Requirements

### Requirement: Map-targeted pointer and touch control
The client SHALL translate mouse and touch targets to the intended tile in both landscape desktop and portrait mobile layouts. Only map-tile targets may issue planting actions.

#### Scenario: Mobile player plants a tile
- **WHEN** a portrait mobile player taps an eligible visible grass or soil tile
- **THEN** the client targets that grid tile and shows the resulting planted plot after the authoritative action is accepted

### Requirement: Readable habitat HUD
The client SHALL continuously display the title **Just Like Rabbits**, a concise planting instruction, planted-plot and mature-carrot counts, and the current time-scale selector without requiring hover.

#### Scenario: Counts change
- **WHEN** a plot is planted, matures, or is eaten
- **THEN** the displayed planted and mature-carrot counts update to match the current shared state

### Requirement: Readable day and night presentation
The client SHALL keep map tiles, rabbits, grid feedback, and HUD legible at every point in the day/night tint cycle.

#### Scenario: Night phase
- **WHEN** the simulation reaches its darkest visual phase
- **THEN** a player can still distinguish eligible terrain, mature carrots, rabbits, and HUD controls

### Requirement: Asset provenance and replacement guidance
The repository SHALL document separate sources for the environment tileset and rabbit sprite sheet, the applicable attribution or license information, and the file locations and dimensions needed to replace either source.

#### Scenario: Maintainer replaces art
- **WHEN** a maintainer reads the asset documentation
- **THEN** they can identify the environment and rabbit asset sources and replace either without changing simulation behavior
