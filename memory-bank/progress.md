# Progress — keystroke0x65-capstone-project

<!-- Entry file. Changed only through memory.py apply. Move items between sections with UPDATE + section. -->

## Now
<!-- empty: work in progress -->
- [prog-0003] root h=0 x=0 d=2026-09-24 labels=status,website,frontend :: The TrackFlow website is implemented in uis/website with a React/Vite landing page, application form, responsive styling, and separate application.html routing.

## Next
<!-- empty: planned work, highest priority first -->
- [prog-0002] root h=0 x=0 d=2026-09-17 labels=next,telemetry,warehouse src="company-choice.md" :: Define the first implementation milestone, prioritizing centralized telemetry and logging or digitized warehouse restocking, then establish the required application structure.
- [prog-0004] root h=0 x=0 d=2026-09-24 labels=next,backend,application :: Connect the application form and website data to the planned centralized API; the current form renders client-side and has no persisted submission flow.
- [prog-0007] root h=0 x=0 d=2026-11-19 labels=next,backoffice,milestone-2,review :: Build uis/backoffice (Vite + React + TypeScript, internal layout, entry at /) and surface the Milestone 2 utility tester there; reviewer failed the milestone partly because it runs from root index.html instead.

## Done
<!-- empty: completed milestones (keep the latest 15; consolidate archives older ones) -->
- [prog-0001] root h=1 x=0 d=2026-09-17 labels=status,trackflow src="git log --oneline -10" :: The project selected TrackFlow, populated CONTEXT.md, and completed the initial website milestone with landing and application pages.
- [prog-0005] root h=0 x=0 d=2026-10-23 labels=website,lighthouse,validation :: Website validated against uis/website/VALIDATEME.md and BRIEFING.md: contrast and form-focus fixes, README npx/Codespaces docs; local Lighthouse home 80-83 mobile / 100 desktop, application 94 / 100, screenshots saved in uis/website.
- [prog-0006] root h=0 x=0 d=2026-11-19 labels=agents,rules,skills,review :: Agent infrastructure tightened after review: all 16 rules declare scope, placing-product-code rule maps uis/website, uis/backoffice and services/, and git-skill and memory-bank gained acceptance criteria.

## Known issues
<!-- empty: bugs, tech debt, limitations still open -->
- [prog-0008] root h=0 x=0 d=2026-11-19 labels=tech-debt,placement,milestone-2,backoffice src="index.html" :: Root index.html and src/ (Milestone 2 inventory, search, carrier and validation utilities with a CDN Tailwind tester) sit outside the mapped app folders; move them into uis/backoffice and remove the root copies and root package.json once approved.
