# Spec Delta

## Purpose

Provide a Tiled-compatible layered farm presentation where 32 px terrain, growing carrots, and animated rabbits remain visually distinct and consistent.

## ADDED Requirements

### Requirement: Layered Tiled farm map contract
The system SHALL represent the 18 by 12 habitat as an orthogonal 32 by 32 px Tiled-compatible map with a visible `Ground` tile layer and a visible `Plants` tile layer, in that paint order.

#### Scenario: Ground precedes plant overlays
- **WHEN** the habitat renders a map tile containing a carrot plot
- **THEN** it renders that tile's grass or dirt ground before the carrot overlay

#### Scenario: Map dimensions remain aligned to simulation coordinates
- **WHEN** a Tiled-compatible farm map is validated
- **THEN** it has the habitat's 18 by 12 dimensions and 32 by 32 px orthogonal tile geometry

### Requirement: Farm ground presentation
The `Ground` layer SHALL provide grass and cultivated dirt tiles, with planting allowed only on tiles represented as grass or dirt by the deterministic habitat rules.

#### Scenario: Base terrain is visible
- **WHEN** the habitat is rendered before any planting occurs
- **THEN** grass and dirt are visible as ground-layer tiles across the playable garden

### Requirement: Carrot lifecycle overlay
The `Plants` layer SHALL render a small carrot-growth overlay for a seedling plot and a visibly mature carrot overlay for a mature plot. A mature carrot SHALL remain visible until the existing rabbit simulation consumes that plot.

#### Scenario: Plant progresses above dirt
- **WHEN** a user plants on an eligible tile and twenty simulation seconds elapse at 1x
- **THEN** the tile retains its dirt ground and the plant overlay changes from the seedling to the mature carrot image

#### Scenario: Rabbit consumes mature carrot
- **WHEN** a rabbit reaches a mature carrot selected by the existing simulation
- **THEN** the mature carrot overlay is removed while the dirt ground remains

### Requirement: Unified pixel-art scale
The renderer SHALL display farm ground, plant overlays, and rabbit animation cells as 32 by 32 px logical tiles using nearest-neighbor sampling. Sixteen-pixel source plant cells SHALL scale cleanly to the 32 px grid.

#### Scenario: Plant and rabbit share a tile grid
- **WHEN** a mature carrot and rabbit occupy neighboring map cells
- **THEN** their rendered cell boundaries align to the same 32 px grid without smoothing artifacts

### Requirement: Animated rabbits render above the farm map
The renderer SHALL paint animated rabbit frames after both farm-map layers, while animation selection remains a presentation concern that does not alter simulation or multiplayer state.

#### Scenario: Rabbit remains visible over a planted tile
- **WHEN** a rabbit walks to or eats a carrot
- **THEN** its animation renders above the ground and plant layers and its deterministic food behavior is unchanged
