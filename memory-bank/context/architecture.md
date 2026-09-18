# Architecture — keystroke0x65-capstone-project

<!-- Entry file. How the system is put together. Prefer facts verifiable in the code; set src= to the file. -->

## Components
<!-- empty: major modules/services and their responsibility -->

## Data flow
<!-- empty: how data and requests move through the system -->
- [arch-0003] root h=0 x=0 d=2026-09-17 labels=data,pipelines,evaluation src="README.md" :: The intended data flow is raw source data through pipelines into processed outputs, which are consumed by services, UIs, or agents; evaluation data belongs in data/eval.

## Integrations
<!-- empty: external services, APIs, auth providers, queues -->

## Invariants
<!-- empty: rules that must stay true (e.g. "all DB access goes through lib/db") -->

## Repository organization
- [arch-0001] root h=0 x=0 d=2026-09-17 labels=monorepo,architecture,folders src="README.md" :: The repository is a monorepo organized by responsibility: uis for interfaces, services for the centralized API, data for pipelines, agents for AI, workflows for orchestration, and infra/scripts/internal for operations.

## Backend direction
- [arch-0002] root h=0 x=0 d=2026-09-17 labels=fastapi,backend,api src="README.md" :: The documented backend direction is one centralized FastAPI company API with domain routers, adding separate workers only when background execution truly requires it.
