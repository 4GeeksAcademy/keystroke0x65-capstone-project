---
description: Credentials never enter code, commits, logs, or client bundles.
scope: always
alwaysApply: true
globs: []
---

# Working with secrets

## Rule
Credentials never appear in code, commits, logs, error messages, or client bundles.

## Guidelines
- Read secrets from environment variables or the project's config system.
- When adding a new variable, add it to `.env.example` with a placeholder, not a real value.
- Never expose server secrets to the client. In the Vite apps under `uis/`, every `VITE_*` variable is bundled into public JavaScript, so only non-secret values (e.g. a public API base URL) may use that prefix. Secrets stay in `services/`.
- Don't log full request headers, tokens, or connection strings.
- If you find a secret committed in the repo, stop and report it. Don't just move it.
