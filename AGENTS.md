# Agent Instructions

At the start of each session, read only these memory-bank files:

1. `memory-bank/index.md` — generated catalog of project memory.
2. `memory-bank/active-context.md` — current focus, blockers, and next steps.

Before non-trivial work, use the index and, when useful, run
`memory.py find <keywords...>` to identify relevant entries. Read the other
memory-bank files selectively according to the task:

- `context/project-brief.md` — product goals, users, scope, or constraints.
- `context/architecture.md` — system structure, data flow, APIs, or integrations.
- `context/tech-stack.md` — tools, dependencies, environments, or commands.
- `context/conventions.md` — code, documentation, or repository organization.
- `context/decisions.md` — architectural or product decisions.
- `progress.md` — planning, status checks, or milestone updates.

Do not read every context file for every change; keep context usage proportional
to the task. Always inspect the relevant source code and current configuration
before relying on memory.

Use the memory-bank skill at `.agents/skills/memory-bank/SKILL.md` for all memory
operations. Never hand-edit entry files (`context/*.md`, `progress.md`, or
`index.md`); update them through `memory.py apply`. `active-context.md` is the
only memory-bank file that may be edited directly, and must remain under 80
lines. Do not store secrets or personal data in memory.

## Mandatory pre-commit workflow

Before creating **every commit**, complete these steps in order:

1. **Inspect scope:** run `git status --short` and review the complete diff with
	`git diff`; confirm that every changed file is intentional.
2. **Validate changes:** run the relevant tests, linters, type checks, builds, or
	validation commands for the files changed. If no automated check exists,
	perform an explicit manual review and record that limitation.
3. **Update project memory:** if the work changed project facts, decisions,
	progress, or reusable lessons, update the appropriate memory-bank files
	through the memory-bank workflow and run `memory.py validate`.
4. **Review the final diff:** verify the diff contains no secrets, credentials,
	personal data, generated artifacts, unrelated edits, or accidental debug
	code; check that documentation matches the implementation.
5. **Confirm commit readiness:** report the files changed, checks run and their
	results, known limitations, and the proposed commit message. Do not commit
	until the developer explicitly approves the final commit.

## Protected paths

The following files and folders must not be modified, deleted, renamed, or
regenerated without explicit developer confirmation for that specific change:

- `AGENTS.md`
- `CONTEXT.md`
- `company-choice.md`
- `.agents/`
- `memory-bank/` (including generated files, except updates explicitly required
  by the memory-bank workflow)
- `packages/shared/`
- `README.md`
- Any root-level configuration, dependency, CI, deployment, or environment file
  added later, including `package.json`, lockfiles, `docker-compose.yml`,
  `.env*`, and files under `.github/`

If a requested task requires changing a protected path, stop before editing it
and ask the developer for explicit confirmation. Do not infer confirmation from
general task approval. Changes made by the memory-bank workflow are allowed
only when they are directly required to record an approved project update;
otherwise ask first.