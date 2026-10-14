# Spec Delta

## Purpose

Allow a lively shared rabbit garden to welcome a group of people without
mistaking autonomous animal actors for human player seats.

## ADDED Requirements

### Requirement: Twelve-person habitat admission
The shared habitat SHALL admit up to twelve simultaneously connected human clients and SHALL report capacity `12` in each authoritative presence and snapshot payload. A thirteenth human client SHALL receive the existing full-room outcome; a departed or expired human seat SHALL become available to retrying or late-joining clients.

#### Scenario: Twelfth human joins
- **WHEN** twelve human clients join the same habitat
- **THEN** each connected client reports twelve players and capacity twelve

#### Scenario: Thirteenth human attempts to join
- **WHEN** all twelve human seats are occupied and another client joins
- **THEN** that client receives the full-room outcome without changing shared habitat state

#### Scenario: Released human seat is retried
- **WHEN** a connected human departs or expires while the room is full
- **THEN** one subsequent retrying or late-joining human is admitted

### Requirement: Capacity-adaptive bot rabbits
The authoritative habitat SHALL retain Hazel and Poppy and SHALL add deterministic non-human bot rabbits that do not consume human seats: three bots with 1–4 humans, two bots with 5–8 humans, and one bot with 9–12 humans. Every authoritative state SHALL identify bot rabbits distinctly from resident rabbits and SHALL contain one to three bot rabbits while humans are connected.

#### Scenario: Small group receives three bot rabbits
- **WHEN** one through four humans are connected
- **THEN** the authoritative snapshot contains Hazel, Poppy, and three distinct bot rabbits

#### Scenario: Full group retains one bot rabbit
- **WHEN** nine through twelve humans are connected
- **THEN** the authoritative snapshot contains Hazel, Poppy, and one bot rabbit while presence still reports only human players

### Requirement: Bots obey rabbit habitat rules
Bot rabbits SHALL be advanced only by the authoritative deterministic habitat simulation and SHALL use the same valid movement, carrot targeting, eating, idle, wandering, hiding, and resting behavior as resident rabbits. Clients SHALL render bot rabbits from the supplied rabbit art without requiring player input.

#### Scenario: Bot eats a mature carrot
- **WHEN** a mature carrot exists and a bot selects it under the deterministic rules
- **THEN** every connected client receives the same bot movement and carrot-removal state

#### Scenario: Client cannot command a bot
- **WHEN** a human client sends planting or time-scale intent
- **THEN** the server validates the shared action without accepting a direct bot-control command

### Requirement: Four-stage one-minute carrot growth
The authoritative habitat SHALL progress every planted carrot through four supplied-art stages over 60 simulation seconds at 1x. Stages SHALL change at 0, 15, 30, and 45 seconds; at 60 seconds the crop overlay SHALL be replaced by a harvestable carrot object. Time-scale changes SHALL alter elapsed simulation time without resetting progress.

#### Scenario: Carrot advances at fifteen-second intervals
- **WHEN** a carrot is planted and simulation time reaches 15, 30, and 45 seconds
- **THEN** each snapshot selects the next supplied growth stage in order

#### Scenario: Carrot becomes harvestable after one minute
- **WHEN** a planted carrot reaches 60 simulation seconds at 1x
- **THEN** the crop overlay is absent and a harvestable carrot object is present

#### Scenario: Time scale preserves crop progress
- **WHEN** a carrot is partway through growth and the shared time scale changes
- **THEN** it reaches subsequent stages according to accumulated simulation time rather than restarting

### Requirement: Cultivated dirt and carrot object layering
Planting on valid grass or soil SHALL change the corresponding ground cell to cultivated dirt immediately and SHALL place the first carrot stage in the plant layer. The cultivated dirt SHALL remain after maturation and after a rabbit consumes the carrot object, allowing the cell to be replanted.

#### Scenario: Planting establishes cultivated dirt
- **WHEN** a human plants on a valid grass or soil cell
- **THEN** all clients receive cultivated dirt below the first carrot growth frame

#### Scenario: Rabbit consumes a mature carrot object
- **WHEN** a rabbit consumes a harvestable carrot object
- **THEN** the object is removed while the cultivated dirt cell remains visible and plantable
