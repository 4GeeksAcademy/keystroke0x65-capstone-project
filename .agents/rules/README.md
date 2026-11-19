# Rules

Development rules for coding agents working in this repository. `AGENTS.md` at the repo root takes precedence over any rule here.

Every rule file starts with frontmatter declaring its **scope**:

| `scope` | When the agent applies it | Extra fields |
|---|---|---|
| `always` | Loaded at the start of every session, regardless of task. | `alwaysApply: true` |
| `file-pattern` | Applied when the agent reads, creates, or edits a file matching one of `globs`. | `globs:` list of patterns, `alwaysApply: false` |
| `agent-requested` | The agent loads it when the task matches `description` (e.g. "fixing a bug"). | `alwaysApply: false`, no globs |

## Index

| Rule | Scope | Applies to |
|---|---|---|
| [placing-product-code](placing-product-code.md) | always | Where website, backoffice, and services code goes |
| [making-a-commit](making-a-commit.md) | always | Every commit |
| [working-with-secrets](working-with-secrets.md) | always | All work |
| [changing-behavior-or-interfaces](changing-behavior-or-interfaces.md) | always | All work |
| [removing-code](removing-code.md) | always | All work |
| [defining-types](defining-types.md) | file-pattern | `**/*.ts`, `**/*.tsx` |
| [writing-a-function](writing-a-function.md) | file-pattern | Source files (ts, tsx, js, jsx, mjs, py) |
| [naming-things](naming-things.md) | file-pattern | Source files |
| [writing-comments](writing-comments.md) | file-pattern | Source files |
| [handling-errors](handling-errors.md) | file-pattern | Source files |
| [writing-tests](writing-tests.md) | file-pattern | `*.test.*`, `*.spec.*`, `tests/`, `evals/` |
| [handling-external-input](handling-external-input.md) | file-pattern | `uis/**/src/**`, `services/**`, `agents/**`, `mcps/**` |
| [organizing-code-across-layers](organizing-code-across-layers.md) | file-pattern | `uis/**`, `services/**`, `agents/**` |
| [adding-a-dependency](adding-a-dependency.md) | file-pattern | `package.json`, `requirements*.txt`, `pyproject.toml` |
| [fixing-a-bug](fixing-a-bug.md) | agent-requested | Bug-fix tasks |
| [creating-an-abstraction](creating-an-abstraction.md) | agent-requested | Adding helpers or generic layers |
| [making-an-architectural-decision](making-an-architectural-decision.md) | agent-requested | Library, data-model, or structure choices |

When you add a rule, give it frontmatter and add a row here.
