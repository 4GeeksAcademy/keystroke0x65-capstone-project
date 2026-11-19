# Conventions — keystroke0x65-capstone-project

<!-- Entry file. How code is written here. Only record conventions observed in the code or stated by the user. -->

## Code style
<!-- empty: formatting, naming, file layout -->

## Patterns
<!-- empty: preferred patterns and ones to avoid -->

## Testing
<!-- empty: what to test, where tests live, how to run a single test -->

## Workflow
<!-- empty: branching, commits, reviews, release steps -->
- [conv-0003] root h=0 x=0 d=2026-11-19 labels=rules,agents,scope,conventions src=".agents/rules/README.md" :: Every .agents/rules/*.md starts with frontmatter declaring scope (always, file-pattern with globs, or agent-requested), indexed in .agents/rules/README.md. placing-product-code.md is always active because placement mistakes happen when a file is created.
- [conv-0004] root h=0 x=0 d=2026-11-19 labels=skills,agents,acceptance-criteria src="skills-lock.json" :: Project-owned coding-agent skills are .agents/skills/git-skill and .agents/skills/memory-bank; each documents an objective, inputs, expected output and command-verifiable acceptance criteria. gsap-*, threejs-* and frontend-design are third-party installs tracked in skills-lock.json files.

## Documentation
- [conv-0001] root h=0 x=0 d=2026-09-17 labels=documentation,folders,conventions src="README.md" :: Each new app, service, agent, or pipeline should live in its own subfolder and include a README documenting what was added and how it is used.

## Placement
- [conv-0002] root h=1 x=0 d=2026-09-17 labels=structure,placement,backoffice,services src="README.md" :: Place product code only in template-mapped folders, reading each README first: public site in uis/website, internal staff app in uis/backoffice, each backend API or worker in services/<name>, pipelines in data/pipelines, product AI in agents/ and skills/. Never create a parallel tree (frontend/, apps/, api/, server/, root src/).
