# Agent Guidelines

This repository is a local training tool for ECC / coding workflow practice.
Use the code, scripts, quests, and project profile as the operating truth; do
not rely on README prose when it lags implementation.

## Development Route

For non-trivial implementation, use the parent-owned route:
Plan -> Work -> independent Sol max Review. The central instructions are
`/Users/sora/dev/jinsei/CODEX_GLOBAL_AGENTS.md`, and the deterministic task,
authority, evidence, and Git boundary is `/Users/sora/dev/jinsei/bin/jinsei`.
The Codex parent owns model launch; the current TaskIntent, exact worktree
scope, and fresh verification/review evidence must bind to the current HEAD.
Do not infer launch commands from this repository.

## Development Autonomy

Development GitHub operations are L5 under Jinsei's
`GITHUB_DEVOPS_AUTONOMY_POLICY.md` after this repo's verification and fresh
independent Sol max review evidence bound to the current HEAD pass. This
includes branch work, local commits, pushes to an existing approved remote, PR
creation/update, and issue operations.

Public deployment, repository visibility changes, billing or paid services,
secret mutation, production data mutation, public claims, and publication remain
gated.

## Local Rules

- Keep changes small and quest-focused.
- Do not add broad framework dependencies unless explicitly approved.
- Preserve the Node.js standard-library-only CLI path unless a later slice says
  otherwise.
- Treat `.claude/` content as local training guidance, not a global authority
  model.

## Safety

Do not read, print, commit, or copy private local state such as credentials,
tokens, raw logs, browser profiles, generated workspaces, or personal XP files.

## Verification

Use the narrowest relevant checks:

```bash
node --check scripts/check.js
git diff --check
```
