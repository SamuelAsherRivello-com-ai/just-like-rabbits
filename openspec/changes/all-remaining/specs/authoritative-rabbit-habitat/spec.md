# Spec Delta

## Purpose

Provide a bounded shared rabbit habitat whose server owns rules, timing, and replicated state for every connected player.

## ADDED Requirements

### Requirement: Server-authoritative shared habitat
The system SHALL provide a two-seat shared habitat room that owns fixed-step seeded state, including map plots, rabbits, elapsed time, and selected time scale. Browser clients SHALL render the latest room state and SHALL send actions without advancing authoritative habitat rules locally.

#### Scenario: Two players observe one habitat
- **WHEN** two clients join an available room and either player plants a carrot or changes time scale
- **THEN** both clients receive the same authoritative resulting state

#### Scenario: Third player cannot join
- **WHEN** a third client attempts to join a two-seat room
- **THEN** the client receives a room-full result and does not enter the habitat

### Requirement: Validated one-time actions
The room SHALL accept only valid planting and time-scale actions, apply each accepted action once in room order, and publish the resulting state to participants.

#### Scenario: Players target the same plot
- **WHEN** two players submit planting actions for the same empty eligible tile
- **THEN** no more than one action creates a plot and both clients receive that occupied plot state

### Requirement: Shared-session lifecycle feedback
The browser SHALL visibly distinguish connecting, connected, room-full, disconnected, expired-room, retryable, and local-input-pause states without hiding the map or HUD.

#### Scenario: Room becomes unavailable
- **WHEN** an active room is lost or expires
- **THEN** the browser explains that habitat state cannot be restored and presents a retry control

### Requirement: Deterministic shared behavior verification
The release candidate SHALL verify carrot growth, rabbit cadence, animation selection, and day/night tint at `0.5x`, `1x`, `2x`, `4x`, and `10x` without resetting elapsed habitat time when the scale changes.

#### Scenario: Scale changes during carrot growth
- **WHEN** a player changes the time scale while a carrot is growing
- **THEN** all connected clients observe the remaining growth time and rabbit behavior continue from the current elapsed time at the new scale
