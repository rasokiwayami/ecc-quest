# ecc-quest/AGENTS.md

This repository is a local training tool for ECC / coding workflow practice.
Use the code, scripts, quests, and project profile as the operating truth; do
not rely on README prose when it lags implementation.

## Development Route

For non-trivial implementation, the current central Jinsei contract and linked
policies own the route, model and effort selection, review, task evidence, and
Git side effects:

- `/Users/sora/dev/jinsei/CODEX_GLOBAL_AGENTS.md`
- `/Users/sora/dev/jinsei/docs/policies/DEVELOPMENT_MODEL_ROUTE_POLICY.md`
- `/Users/sora/dev/jinsei/docs/policies/DEVELOPMENT_PROTOCOL.md`
- `/Users/sora/dev/jinsei/docs/policies/MANAGED_REPOSITORY_INHERITANCE.md`

This repository is a specialized Jinsei-managed implementation unit. The
`project.authority` block in `PROJECT_PROFILE.yaml` only narrows central
authority; it does not grant authority or replace central task, halt, identity,
or review checks.

## Repository Scope

This repository owns the standard-library-only Node.js CLI and local quest and
training state. For cross-repository changes, inspect only directly affected
contracts and actual consumers; `.claude/` remains local training guidance,
not a global authority model.

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
