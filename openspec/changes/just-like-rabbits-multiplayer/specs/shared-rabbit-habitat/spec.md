# Spec Delta

## Purpose

Defines the authoritative shared-session behavior needed for players to experience one consistent rabbit habitat together.

## ADDED Requirements

### Requirement: Shared authoritative habitat room
The system SHALL provide a bounded two-player cooperative habitat room in which map tiles, carrot lifecycle, rabbits, simulation time, and the selected time scale are authoritative shared state.

#### Scenario: Two players join one habitat
- **WHEN** two clients join the same available room
- **THEN** both receive the same authoritative habitat state and observe subsequent accepted changes in the same order

### Requirement: Validated shared actions
The authoritative room SHALL accept planting and time-scale actions only when they are valid for the current state, apply each accepted action once, and broadcast the resulting shared state to connected players.

#### Scenario: Competing plant requests
- **WHEN** two players target the same eligible tile before synchronization completes
- **THEN** at most one request plants the tile and the other client receives the resulting occupied state

### Requirement: Connection lifecycle feedback
The client SHALL visibly distinguish connecting, connected, room-full, disconnected, expired-room, and retryable error states. It MUST provide an explicit retry or room-creation path after loss without claiming that room state survives a server expiry or cross-instance route.

#### Scenario: Room expires
- **WHEN** the room is unavailable after a connection loss or hosting expiry
- **THEN** the client explains that the habitat cannot be restored and offers a visible retry path to a new room

### Requirement: Local pause does not pause the room
The client SHALL allow a player to pause or neutralize only local input and presentation without pausing, resetting, or otherwise changing simulation time for other connected players.

#### Scenario: One player pauses locally
- **WHEN** one connected player activates local pause
- **THEN** the other player's shared simulation continues and the paused player sends no map actions until resuming
