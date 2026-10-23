# Archive

Superseded, deleted and promoted entries. Not loaded by default.

- 2026-09-24 SUPERSEDE batch=b-20260924-104634-26vq file=context/tech-stack.md reason="the website is now implemented and validated"
  - [stack-0002] root h=1 x=0 d=2026-09-17 labels=status,template,tooling src="README.md" :: The repository is currently a documentation and folder-structure skeleton; no root workspace runner or runnable applications are configured yet.
- 2026-10-23 SUPERSEDE batch=b-20261023-015205-yij5 file=context/tech-stack.md reason="stack changed: TS 5.9, Tailwind v4 via Vite plugin, motion libs"
  - [stack-0004] root h=0 x=1 d=2026-09-24 labels=react,vite,typescript :: The website uses React 19, TypeScript 6, and Vite 8 with @vitejs/plugin-react; Tailwind utility classes are loaded at runtime from jsDelivr.
- 2026-10-23 SUPERSEDE batch=b-20261023-015205-yij5 file=context/tech-stack.md reason="oxlint removed; build now prerenders"
  - [stack-0005] root h=0 x=1 d=2026-09-24 labels=website,build,lint :: From uis/website, npm run build passes TypeScript compilation and Vite production bundling, and npm run lint passes Oxlint.
- 2026-10-23 SUPERSEDE batch=b-20261023-015205-yij5 file=context/tech-stack.md reason="lint no longer exists"
  - [stack-0006] root h=0 x=0 d=2026-09-24 labels=status,template,tooling src="uis/website/package.json" supersedes=stack-0002 :: The repository remains documentation-first outside uis/website, while uis/website now contains a runnable React/Vite frontend with validated build and lint commands.
