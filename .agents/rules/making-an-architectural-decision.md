---
description: Use when choosing a library, data model, folder convention, or deviating from a pattern.
scope: agent-requested
alwaysApply: false
globs: []
---

# Making an architectural decision

## Rule
Significant choices get a short written record so they aren't relitigated later.

## Counts as significant
Choosing a library or framework, a data model or schema design, an auth approach, a caching strategy, a folder structure convention, or deliberately deviating from an existing pattern.

## Guidelines
- Before deciding, run `python3 .agents/skills/memory-bank/scripts/memory.py find <keywords>` and read `memory-bank/context/decisions.md` for prior choices.
- If a decision contradicts a past one, flag it rather than silently overriding it. Once approved, SUPERSEDE the old entry; don't add a conflicting one.
- For big choices, propose options to the human before implementing.

## Where to record it
In this repo, decisions live in the memory bank, not in `docs/decisions/`. Use the `memory-bank` skill to add an entry to `context/decisions.md` through `memory.py apply`; never hand-edit that file. One entry, ≤400 chars, covering:

- **Decision:** what we chose.
- **Why:** the problem or constraint that prompted it.
- **Rejected:** the main alternative and why it lost.
- **Consequence:** what this makes harder.

If the reasoning needs more than one entry can hold, add a longer note under `docs/` and point to it with the entry's `src=` attribute.
