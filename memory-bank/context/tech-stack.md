# Tech Stack — keystroke0x65-capstone-project

<!-- Entry file. Versions, tooling, environments, and the commands that actually work. -->

## Runtime and frameworks
<!-- empty: languages, frameworks, key libraries with versions -->
- [stack-0007] root h=0 x=0 d=2026-10-23 labels=react,vite,typescript supersedes=stack-0004 :: uis/website uses React 19, TypeScript ~5.9, Vite 8 and Tailwind CSS v4 via @tailwindcss/vite (no CDN); motion uses gsap+ScrollTrigger, three@0.149 and matter-js@0.19, pinned on purpose (newer three shifts colours).

## Services and infrastructure
<!-- empty: hosting, databases, storage, CI/CD -->

## Dev environment
<!-- empty: setup steps, env var NAMES (never values), local services -->

## Commands
<!-- empty: build, test, lint, run, deploy commands verified to work -->
- [stack-0003] root h=0 x=0 d=2026-09-17 labels=memory-bank,commands,python src=".agents/skills/memory-bank/references/init.md" :: Memory-bank maintenance uses python3 .agents/skills/memory-bank/scripts/memory.py with init, apply, validate, find, consolidate, stats, index, and rollback commands.
- [stack-0008] root h=0 x=0 d=2026-10-23 labels=website,build,lint supersedes=stack-0005 :: From uis/website: npm run typecheck (tsc -b) and npm run build (typecheck, client build, SSR build, scripts/prerender.mjs into dist/) both pass; there is no lint script. README documents npx vite --host 0.0.0.0 for Codespaces.

## Repository baseline
- [stack-0001] root h=0 x=0 d=2026-09-17 labels=typescript,shared,package src="packages/shared/package.json" :: The repository currently has a private TypeScript shared package named @repo/shared-types at version 0.0.1, with index.ts as its main and type entry point.

## Current implementation status
- [stack-0009] root h=0 x=0 d=2026-10-23 labels=status,template,tooling src="uis/website/package.json" supersedes=stack-0006 :: The repository remains documentation-first outside uis/website, which contains a runnable, prerendered React/Vite site with validated typecheck and build commands.
