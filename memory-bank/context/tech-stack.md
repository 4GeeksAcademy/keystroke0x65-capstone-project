# Tech Stack — keystroke0x65-capstone-project

<!-- Entry file. Versions, tooling, environments, and the commands that actually work. -->

## Runtime and frameworks
<!-- empty: languages, frameworks, key libraries with versions -->
- [stack-0004] root h=0 x=0 d=2026-09-24 labels=react,vite,typescript :: The website uses React 19, TypeScript 6, and Vite 8 with @vitejs/plugin-react; Tailwind utility classes are loaded at runtime from jsDelivr.

## Services and infrastructure
<!-- empty: hosting, databases, storage, CI/CD -->

## Dev environment
<!-- empty: setup steps, env var NAMES (never values), local services -->

## Commands
<!-- empty: build, test, lint, run, deploy commands verified to work -->
- [stack-0003] root h=0 x=0 d=2026-09-17 labels=memory-bank,commands,python src=".agents/skills/memory-bank/references/init.md" :: Memory-bank maintenance uses python3 .agents/skills/memory-bank/scripts/memory.py with init, apply, validate, find, consolidate, stats, index, and rollback commands.
- [stack-0005] root h=0 x=0 d=2026-09-24 labels=website,build,lint :: From uis/website, npm run build passes TypeScript compilation and Vite production bundling, and npm run lint passes Oxlint.

## Repository baseline
- [stack-0001] root h=0 x=0 d=2026-09-17 labels=typescript,shared,package src="packages/shared/package.json" :: The repository currently has a private TypeScript shared package named @repo/shared-types at version 0.0.1, with index.ts as its main and type entry point.

## Current implementation status
- [stack-0006] root h=0 x=0 d=2026-09-24 labels=status,template,tooling src="uis/website/package.json" supersedes=stack-0002 :: The repository remains documentation-first outside uis/website, while uis/website now contains a runnable React/Vite frontend with validated build and lint commands.
