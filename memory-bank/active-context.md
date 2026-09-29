# Active Context — keystroke0x65-capstone-project

<!-- Freeform, short-lived state. The agent MAY rewrite this file directly (the only exception
     to operations-only writes). Keep it under 80 lines. Durable facts belong in context/ or experience/. -->

## Current focus
TrackFlow's first implementation milestone is the website in `uis/website`.
The React/Vite frontend includes the landing page and application page.

## Open questions / blockers
The application form is currently client-side only; it does not persist or send
submissions to the planned centralized API.

## Recent changes
- Recorded the completed website milestone in the memory bank.
- Verified `npm run build` and `npm run lint` from `uis/website`.
- Added website architecture, React/Vite stack, and command entries.
- Added session-start memory-bank reading instructions to `AGENTS.md`.

## Next steps
Connect the application form to the centralized API, then select and implement
the next TrackFlow domain milestone (telemetry/logging or warehouse restocking).
