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
- Validated uis/website against VALIDATEME.md and BRIEFING.md (both in uis/website).
- Fixed nav/form-header contrast, form error focus, README npx/Codespaces docs.
- Home intro split from three.js (runtime/intro.ts); 3D, toy scenes and footer physics lazy-load.
- Textures converted to WebP; local Lighthouse home mobile 80-83, desktop 100.
- Recorded arch-0005, arch-0006, stack-0007..0009, performance-0001, prog-0005.

## Next steps
Connect the application form to the centralized API, then select and implement
the next TrackFlow domain milestone (telemetry/logging or warehouse restocking).
