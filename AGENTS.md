# Agent Guidelines

This repository is a local training tool for ECC / coding workflow practice.
Use the code, scripts, quests, and project profile as the operating truth; do
not rely on README prose when it lags implementation.

## Global Routing

For non-trivial implementation, route through Jinsei / Global Coding Department:

```bash
cd /Users/sora/dev/jinsei
python3 scripts/dispatch_codex_session.py --queue-request --project "ECC Quest" --repo /Users/sora/dev/ecc-quest --operation-id <operation_id> --goal "<bounded goal>" --authority-band A2
python3 scripts/dispatch_codex_session.py --from-queue --limit 3
python3 scripts/dispatch_codex_session.py --check-push-review --project "ECC Quest" --operation-id <operation_id>
```

Use separate Planning Worker, Implementation Worker, and Review Controller
roles for multi-file changes, workflow changes, public/push readiness, or
anything that changes the training contract.

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
