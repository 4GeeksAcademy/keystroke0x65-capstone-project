---
description: Where TrackFlow product code belongs in the monorepo; never create a parallel app tree.
scope: always
alwaysApply: true
globs:
---

# Placing product code

## Rule
TrackFlow product code goes only in the folders the template already maps. Read that folder's `README.md` before adding anything. Never create a second frontend or API tree anywhere else.

## Why always active
A placement mistake happens when a file is *created*. No file exists yet for a file-pattern rule to match, so this rule has to be loaded every session.

## Map

| Path | What goes here | Entry / shape |
|---|---|---|
| `uis/website/` | Public TrackFlow corporate site: services (warehouse management, last mile, reverse logistics), US + Spain presence, lead-capture form. Brand and copy follow `BRIEFING.md`. | Home at `/`; application form at `/application.html`. React + TypeScript + Vite. |
| `uis/backoffice/` | Internal TrackFlow app for staff (operations, inventory, shipments, carriers, leads). Its own layout, separate from the public site; shares no marketing styling. | Entry view at `/`. Own `package.json`, `README.md`, and typecheck/build scripts. |
| `uis/<other>/` | Any further UI, only for a concern neither app above covers. Ask first. | Own README. |
| `services/<service-name>/` | Backend APIs and workers, one folder per service (e.g. the centralized API the website's application form will post to). | Own README documenting objective, stack, how to run. |
| `packages/shared/` | Types and helpers used by more than one app or service. | Protected: ask before editing. |
| `agents/`, `skills/`, `mcps/`, `workflows/`, `data/pipelines/` | Product AI agents, skills, MCP servers, orchestration, and data pipelines for later milestones. | Each has its own README and `_template`. |

`.agents/` (this folder) configures the coding agent. It is **not** product code; never put app code here, and never put coding-agent config in `agents/` or `skills/`.

## Don't
- Create `frontend/`, `web/`, `apps/`, `client/`, `api/`, `server/`, `backend/`, or similar at the repo root or anywhere outside the map.
- Add app code at the repo root. The root `index.html` and `src/` hold the earlier utility tester. They're legacy, not a pattern: don't extend them. New internal-tool UI goes in `uis/backoffice/`.
- Put internal or staff-only screens in `uis/website/`, or public marketing pages in `uis/backoffice/`.
- Copy domain logic between apps. If two apps need it, propose moving it to `packages/shared/`.

## Do
- Before creating a folder, run `ls <parent>` and read `<parent>/README.md`.
- When a new app or service is created, add it to the parent README (`uis/README.md` or `services/README.md`) and record it in the memory bank (`context/architecture.md`) through the `memory-bank` skill.

## Check
`git status --short` shows new files only under paths in the map above.
