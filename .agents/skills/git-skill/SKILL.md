---
name: git-skill
description: Create, update, and maintain git repositories safely. Use this skill whenever the user wants to start, set up, or initialize a project or repo; commit, save, checkpoint, or "push" work; write commit messages; create or switch branches; tag a release; sync with or add a remote; clean up branches; fix a messy git state; or whenever Claude is about to modify files in a project folder and needs to know whether it is under version control. Always run the detection step first. If no repository exists, this skill initializes one automatically with a stack-aware .gitignore and a safe initial commit. Trigger even when the user doesn't say "git" (e.g. "save my progress", "set up this project", "version this folder").
---

# git-skill

Handles the full lifecycle of a git repository: **detect → create (if missing) → update → maintain**. Helper scripts live in `scripts/` (Python 3, standard library only) and print JSON so results are easy to reason about.

## Objective

Every git operation the agent performs leaves the repository in a safe, recoverable state: nothing secret committed, no work lost, and each change recorded as one Conventional Commit on the right branch.

Create, Update, and Maintain below are three paths to that one goal, chosen by what `detect_repo.py` reports.

## Inputs

| Input | Required | Description | Example |
|---|---|---|---|
| `task` | yes | The git outcome the user wants. | "commit the rules change", "start a branch for the backoffice", "push" |
| `path` | no (default: cwd) | Folder to operate on; passed to `detect_repo.py`. | `.` |
| `change_intent` | yes, for commits | What changed and *why*, in one or two sentences. Becomes the commit summary and body. | "Rules lacked a declared scope, so agents couldn't tell when to load them." |
| `files` | no (default: all changes, after review) | Paths that belong to this one logical change. Anything else stays unstaged. | `.agents/rules/` |
| `branch_name` | yes, for new branches | Must follow the repo convention (see below). | `feature/backoffice-shell` |
| `push` | no (default: don't push) | Push or create a remote only when the user asks. | "and push it" |

## Expected output

A git state that meets the acceptance criteria below, plus the short report described in **Reporting back**: what ran, the branch, the commit (short hash + subject), and anything the user must act on.

## In this repository (keystroke0x65 / TrackFlow monorepo)

These override the generic guidance further down:

- The repo already exists, so `detect_repo.py` should report `state: repo` from the root. **Never** run Create here. If you see `nested` from a subfolder, work in the parent repo.
- **No commit without approval.** Before `git commit`, run the five-step pre-commit workflow in `AGENTS.md`. Present the readiness report and wait for the developer's explicit "yes". The auto-commit in Create does not apply here.
- **Branch names:** `feature/<kebab-topic>` (e.g. `feature/agent-memory-bank`, `feature/domain-models`). UI integration branches may use `uis/<app>`. PRs target `main`.
- **Protected paths** (listed in `AGENTS.md`: `AGENTS.md`, `CONTEXT.md`, `README.md`, `.agents/`, `memory-bank/`, `packages/shared/`, root config/lockfiles/`.github/`) may appear in a diff only if the developer confirmed that specific change.
- **Scopes for commit messages:** use the area touched: `website`, `backoffice`, `services`, `agents`, `rules`, `skills`, `memory-bank`, `repo`.

## Acceptance criteria

The run passes only if every item holds. Commands run from the repo root.

1. **Detected first.** `python3 .agents/skills/git-skill/scripts/detect_repo.py .` ran before any other git command, and the agent followed the table row for the `state` it returned.
2. **No secrets staged.** `python3 .agents/skills/git-skill/scripts/check_staged.py .` exits `0` right before `git commit`. Exit code `1` means findings; unstage and report them.
3. **Conventional subject line.** This prints `ok`:
   ```bash
   s=$(git log -1 --format=%s); echo "$s" | grep -Eq '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9./-]+\))?!?: [a-z].*[^.]$' && [ ${#s} -le 72 ] && echo ok
   ```
4. **One logical change.** Every path in `git show --stat --format= HEAD` belongs to `change_intent`. Unrelated edits stay unstaged and are reported.
5. **Approved.** In this repo, the developer's explicit approval of the `AGENTS.md` step-5 report appears in the conversation before the commit.
6. **Correct branch.** `git branch --show-current` matches `^(feature|uis)/[a-z0-9-]+$` (or `main` only for an approved merge), and the agent never commits directly to `main`.
7. **No destructive shortcuts.** No `push --force` was run (only `--force-with-lease`, on the agent's own branch). No `reset --hard`, `clean -fd`, `branch -D`, or history rewrite of pushed commits was run without the user's explicit approval.
8. **Reported.** The final message gives the branch, the short hash and subject, and any action items (missing identity, flagged files, no upstream).

## Step 0: Always detect first

Before any git work, run:

```bash
python3 <skill-dir>/scripts/detect_repo.py [path]   # path defaults to cwd
```

Read the JSON and branch on `state`:

| state | meaning | what to do |
|---|---|---|
| `no_git` | git isn't installed | Tell the user; stop. |
| `no_repo` | folder isn't tracked by any repo | Go to **Create** (auto-init is the default). |
| `nested` | folder sits *inside* a parent repo (`repo_root` ≠ `path`) | Don't init silently. Ask whether they meant to work in the parent repo or want a separate repo here. |
| `repo` | folder is a repo root | Go to **Update** or **Maintain** as the task requires. |

Also note `unsafe_location` (true for `/`, the home directory, and system dirs). Never auto-init there; initializing your whole home folder as a repo is a classic, painful mistake. Ask the user which project folder they meant.

## Create: initialize a repo when none exists

When `state` is `no_repo` and the location is safe, initialize without waiting for permission, then report what happened. The user has asked for this behavior: a missing repo is a gap to fill, not a question to ask.

```bash
python3 <skill-dir>/scripts/init_repo.py [path] [--branch main] [--dry-run] [--no-commit]
```

The script:

1. Detects the stack from marker files (`package.json`, `next.config.*`, `astro.config.*`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, `Dockerfile`, etc.).
2. Runs `git init` with default branch `main`.
3. Writes a `.gitignore` combining a common base (OS files, editor files, `.env*`) with per-stack rules. If a `.gitignore` already exists, it only appends missing lines.
4. Checks for files that should never be committed (`.env`, private keys, credentials) and files over 50 MB, and makes sure they are ignored or flagged.
5. Stages everything and runs `scripts/check_staged.py` for secret patterns.
6. Makes the initial commit `chore: initial commit` **only if** the secret check passes and `user.name`/`user.email` are configured. Otherwise it leaves files staged and reports why.

Use `--dry-run` first if the folder has a lot of unfamiliar content or the user seems unsure. After it runs, summarize for the user: branch name, detected stack, what went into `.gitignore`, file count committed, and any warnings.

A README or license is not created automatically. Offer them if the project has neither.

**Remote setup is a separate step.** Don't create a GitHub repo or add a remote unless the user asks. When they do:
- If `gh` is available and authenticated (`gh auth status`): `gh repo create <name> --private --source . --remote origin --push`. Default to **private** unless told otherwise.
- Otherwise: `git remote add origin <url>` then `git push -u origin main`.

## Update: day-to-day commits and branches

### Before every commit
1. `git status --short` and `git diff --stat` to see what changed.
2. Stage deliberately. Prefer `git add <paths>` for the files related to one change; `git add -A` is fine when every change belongs together.
3. Run `python3 <skill-dir>/scripts/check_staged.py`. If it reports findings, unstage those files and tell the user. Don't commit secrets "just this once"; removing them from history later is much harder than not committing them.

### Commit messages: Conventional Commits
Format: `type(scope): summary` in imperative mood, lowercase, no trailing period, ≤72 chars. Add a body (blank line, then wrapped text) when the *why* isn't obvious.

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Append `!` for breaking changes (`feat(api)!: drop v1 endpoints`).

Examples:
- Added the backoffice layout shell → `feat(backoffice): add internal layout with sidebar nav`
- Fixed the lead form losing focus on error → `fix(website): focus first invalid application field`
- Declared scopes on agent rules → `docs(rules): declare scope frontmatter on every rule`
- Updated memory-bank files → `docs(memory-bank): update active context`

One logical change per commit. If the working tree mixes unrelated changes, split them into separate commits rather than writing a vague "update stuff" message.

### Branches
- Naming: follow the repo's convention. In this repo that's `feature/<kebab-topic>`; elsewhere default to `type/short-kebab-description` (e.g. `feat/artifact-marketplace`).
- Create from an up-to-date base: `git switch main && git pull --ff-only && git switch -c feature/x`.
- Solo projects may commit directly to `main` for small changes. Use a branch for anything experimental or multi-session.

### Pushing
- `git push` for tracked branches; `git push -u origin <branch>` the first time.
- If the push is rejected because the remote moved ahead, `git pull --rebase` on your own feature branch, or `git pull --ff-only` / merge on shared branches, then push again.

## Maintain: health and housekeeping

For anything beyond everyday commits, read `references/maintenance.md`. It covers:
- syncing and pruning (`fetch --prune`, deleting merged branches)
- releases (semantic version tags, changelog from Conventional Commits)
- undoing mistakes (amend, revert, reset, reflog recovery), from least to most destructive
- conflict resolution
- removing a committed secret
- a periodic health check checklist

## Safety rules

These protect work that can't be recovered. Follow them even if a shortcut seems faster.

- **Never** `git push --force` to `main`/`master` or any shared branch. On your own feature branch, use `--force-with-lease`, never bare `--force`.
- **Never** rewrite published history (rebase, amend, reset of pushed commits on shared branches) without explicit user approval.
- **Ask before destructive commands**: `reset --hard`, `clean -fd`, `branch -D`, `checkout -- <file>`/`restore` on uncommitted work, `stash drop`, `filter-repo`. Show what would be lost first (`git status`, `git clean -n`, `git log`).
- If something went wrong, check `git reflog` before concluding work is lost.
- Don't change global git config (`--global`) without asking. If `user.name`/`user.email` is missing, tell the user and suggest the command rather than inventing an identity.
- Don't run `git init` inside an existing repo, in the home directory, or at filesystem root.

## Reporting back

After git operations, give a short summary: what ran, the resulting branch and commit (short hash plus message), and anything the user needs to act on (missing identity, flagged secrets, no remote yet). Don't dump raw command output unless something failed.
