# Spec Delta

## Purpose

Defines the deterministic tile habitat and autonomous rabbit behavior that make the shared simulation predictable, natural, and testable.

## ADDED Requirements

### Requirement: Straight-down tile habitat
The game SHALL render a readable, grid-aligned, fully 2D top-down habitat using one cohesive environment tileset for terrain, plots, carrots, bushes, and decorative vegetation. It MUST not render 3D models, perspective, billboards, angled tiles, or a 2.5D camera.

#### Scenario: Habitat is displayed
- **WHEN** a player opens a habitat session
- **THEN** the player sees aligned grass, soil, path, bush, plant, and carrot-plot tiles from a straight-down view

### Requirement: Planting and independent carrot growth
The simulation SHALL plant a seedling immediately when a player targets an eligible unoccupied grass or soil tile and mature that plot after exactly 20 seconds at 1x simulation time. Each plot MUST grow independently, persist when mature, and be removed only when eaten.

#### Scenario: Simultaneous plots mature independently
- **WHEN** players plant plots at different simulation times
- **THEN** each plot changes to a mature visible carrot exactly 20 scaled seconds after its own planting time

#### Scenario: Ineligible planting is rejected
- **WHEN** a player targets water, a path, a bush, or an occupied plot
- **THEN** the map state remains unchanged and the client displays a subtle invalid-action indication

### Requirement: Autonomous rabbit state machine
The simulation SHALL begin with two autonomous rabbits and SHALL expose the states `idle`, `wander`, `seekCarrot`, `moveToCarrot`, `eatCarrot`, `hide`, and `rest`. Rabbits MUST independently select actions, move to food one tile at a time, eat an available mature carrot, and recover from an unreachable or invalid food target.

#### Scenario: Rabbit eats a mature carrot
- **WHEN** a rabbit selects a reachable mature carrot
- **THEN** it enters seek and movement states, reaches the tile, plays its eating state, and removes that carrot from the authoritative map

#### Scenario: Rabbit target becomes invalid
- **WHEN** a selected carrot is removed or cannot be reached before arrival
- **THEN** the rabbit clears its target and transitions to a valid alternate activity without permanently retrying that tile

### Requirement: Rabbit sprite animation
The game SHALL use a separate rabbit-only sprite sheet for rabbit idle, hopping or walking, and eating animation. Animation selection MUST reflect the rabbit's current visible behavior.

#### Scenario: Rabbit is eating
- **WHEN** a rabbit enters `eatCarrot`
- **THEN** its sprite sheet displays the eating animation until the eating transition completes

### Requirement: Consistent simulation time scale
The simulation SHALL offer `0.5x`, `1x`, `2x`, `4x`, and `10x` time scales. The selected scale MUST consistently affect carrot growth, rabbit decisions and movement, animation timing, and the readable day/night tint.

#### Scenario: Accelerated growth
- **WHEN** the authoritative scale changes from 1x to 2x while a plot is growing
- **THEN** its remaining growth progresses at twice the 1x rate without changing its elapsed simulation time
