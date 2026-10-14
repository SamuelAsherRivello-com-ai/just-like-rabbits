# Spec Delta

## Purpose

Ensure the rabbit habitat presents only owner-supplied rabbit and farm artwork while preserving a clear, layered playable garden.

## ADDED Requirements

### Requirement: Exclusive in-world art sources
The system SHALL render every rabbit, terrain, crop, and in-world decoration from the confirmed `32PixelBunny/PNG` or `free-plants-for-farm/PNG` source sets. Text and HTML interface elements are outside this requirement.

#### Scenario: Habitat renders after the asset replacement
- **WHEN** a player opens the habitat
- **THEN** rabbits and the map are drawn from the supplied PNG-derived runtime assets and no legacy game-art atlas is requested or drawn

### Requirement: Supplied grass and cultivated dirt
The system SHALL draw grass on unplanted walkable ground and cultivated dirt beneath every planted carrot using supplied farm-pack terrain art at the shared logical tile size.

#### Scenario: Planting changes the ground presentation
- **WHEN** a player plants a carrot on an eligible grass or soil cell
- **THEN** that cell presents supplied cultivated-dirt art beneath its crop while surrounding eligible cells present supplied grass art

### Requirement: Layered supplied carrot lifecycle
The system SHALL render supplied carrot seedling and mature artwork above supplied cultivated dirt, and SHALL remove the crop overlay when the carrot is consumed or otherwise removed.

#### Scenario: Carrot grows and is consumed
- **WHEN** a planted carrot reaches maturity and a rabbit consumes it
- **THEN** the visible crop changes from the supplied seedling to supplied mature art and later clears while the ground remains valid farm terrain

### Requirement: No legacy-art fallback
The system SHALL not substitute legacy rabbit shapes, legacy terrain art, or unrelated substitute graphics if a required supplied in-world asset fails to load; it SHALL surface a visible asset-load failure instead.

#### Scenario: Required supplied image is unavailable
- **WHEN** a required supplied in-world image cannot load
- **THEN** the habitat shows an understandable loading failure and does not draw prior game artwork in its place
