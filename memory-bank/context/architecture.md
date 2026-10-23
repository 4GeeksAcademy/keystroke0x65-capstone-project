# Architecture — keystroke0x65-capstone-project

<!-- Entry file. How the system is put together. Prefer facts verifiable in the code; set src= to the file. -->

## Components
<!-- empty: major modules/services and their responsibility -->
- [arch-0004] root h=1 x=0 d=2026-09-24 labels=website,react,frontend :: uis/website is the first implemented UI: a Vite-served React TypeScript frontend with a TrackFlow landing page at / and an application page at /application.html.
- [arch-0005] root h=0 x=0 d=2026-10-23 labels=website,intro,performance,three :: Home page runtime: runtime/intro.ts (no three.js) plays the intro wordmark and creates the intro pin at boot; runtime/scene (three.js) is dynamically imported after the cue shows or on first scroll/key; porch and conveyor scenes build near viewport; footer matter-js loads near the footer.

## Data flow
<!-- empty: how data and requests move through the system -->
- [arch-0003] root h=0 x=0 d=2026-09-17 labels=data,pipelines,evaluation src="README.md" :: The intended data flow is raw source data through pipelines into processed outputs, which are consumed by services, UIs, or agents; evaluation data belongs in data/eval.

## Integrations
<!-- empty: external services, APIs, auth providers, queues -->

## Invariants
<!-- empty: rules that must stay true (e.g. "all DB access goes through lib/db") -->
- [arch-0006] root h=0 x=0 d=2026-10-23 labels=website,scrolltrigger,lcp,intro :: The intro pin must use the existing #intro-spacer wrapper as pinSpacer, and other ScrollTriggers must read the pin's start/end instead of using #intro as trigger: moving or un-pinning the intro makes Chrome repaint it as new content and pushes Largest Contentful Paint late.

## Repository organization
- [arch-0001] root h=1 x=0 d=2026-09-17 labels=monorepo,architecture,folders src="README.md" :: The repository is a monorepo organized by responsibility: uis for interfaces, services for the centralized API, data for pipelines, agents for AI, workflows for orchestration, and infra/scripts/internal for operations.

## Backend direction
- [arch-0002] root h=0 x=0 d=2026-09-17 labels=fastapi,backend,api src="README.md" :: The documented backend direction is one centralized FastAPI company API with domain routers, adding separate workers only when background execution truly requires it.
