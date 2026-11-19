# Active Context — keystroke0x65-capstone-project

<!-- Freeform, short-lived state. The agent MAY rewrite this file directly (the only exception
     to operations-only writes). Keep it under 80 lines. Durable facts belong in context/ or experience/. -->

## Current focus
Addressing reviewer feedback on the agent-infrastructure milestone (branch
`feature/agent-memory-bank`). Rule scopes and skill acceptance criteria are done;
the remaining gap is the Milestone 2 backoffice.

## Open questions / blockers
- `uis/backoffice` holds only `.gitkeep`; the Milestone 2 utility tester still runs
  from root `index.html` + `src/` (prog-0008). Moving it needs approval because the
  root `package.json` is protected.
- The application form is client-side only; no submission reaches an API yet.

## Recent changes
- All 16 `.agents/rules/*.md` declare scope frontmatter; index in `.agents/rules/README.md`.
- New always-active rule `placing-product-code.md` maps uis/website, uis/backoffice, services/.
- git-skill and memory-bank skills gained objective, inputs, output, acceptance criteria.
- Recorded conv-0002 (updated), arch-0007, conv-0003, conv-0004, prog-0006..0008.

## Next steps
1. Commit and push the rules/skills/memory-bank changes; open the PR to `main`.
2. Build `uis/backoffice` (Vite + React + TS, internal layout, entry at `/`) and move
   the utility tester there (prog-0007).
3. Connect the application form to the centralized API.
