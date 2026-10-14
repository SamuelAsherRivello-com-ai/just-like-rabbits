# Spec Delta

## Purpose

Publish a public browser entry point for the rabbit habitat and document only a demo URL that has passed release verification.

## ADDED Requirements

### Requirement: Public GitHub Pages game frontend
The repository SHALL deploy its production browser build to GitHub Pages through a repeatable repository workflow. The published frontend SHALL load all required project-local assets and connect to the configured released multiplayer endpoint.

#### Scenario: Public demo loads
- **WHEN** a player opens the GitHub Pages URL in a browser without repository checkout access
- **THEN** the game page, its supplied art, and its interface load without static-asset path failures

### Requirement: Verified README demo link
The README SHALL link to the verified GitHub Pages URL as the live demo and SHALL not present an unverified deployment as playable.

#### Scenario: README directs players to the deployed game
- **WHEN** a reader follows the README's live-demo link after a successful deployment
- **THEN** the destination is the verified GitHub Pages game URL

### Requirement: Release evidence before demo promotion
The project SHALL record the deployed frontend revision, backend endpoint, and independent desktop and portrait browser results before treating the Pages deployment as the live demo.

#### Scenario: Deployment validation fails
- **WHEN** a release browser check finds a loading, interaction, shared-session, or console failure
- **THEN** the README does not promote that deployment as the verified live demo
