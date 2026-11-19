---
description: How to size and word every commit in this repo.
scope: always
alwaysApply: true
globs: []
---

# Making a commit

## Rule
Each commit is one logical change with a message that explains why.

Before any commit, complete the five-step pre-commit workflow in `AGENTS.md`: inspect scope, validate, update memory, review the final diff, confirm readiness. Then wait for the developer's explicit approval. This rule covers what the commit looks like; `AGENTS.md` covers when you may make it.

## Format
Follow the repo's existing convention. If none exists, use:

```
type(scope): short summary in imperative mood

Why this change was needed, and anything a reviewer should know.
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.

## Do
```
fix(website): keep focus on the first invalid application field

Screen-reader users submitting the lead form with errors were left
at the submit button with no announcement of what to correct.
```

## Don't
```
fixed stuff
```

## Also
- Don't commit generated files, build output, secrets, or local config unless the repo already does.
- Don't mix formatting changes with logic changes in one commit.
