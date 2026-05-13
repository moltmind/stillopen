# Git hooks for StillOpen

The pre-commit hook (`pre-commit`) enforces brand voice on committed `.md` files.
It checks for em-dashes and for the banned-word list defined inside the hook
script itself. See `pre-commit` for the actual rule set.

## Internal-doc exemptions (skip strict voice check, keep em-dash check)

- `Claude.md` and `CLAUDE.md` (the operating contract)
- `partners/*/brief.md` (internal partner one-pagers)
- `hooks/README.md` (this file, meta-doc about the hook)
- any `*.internal.md` file (escape hatch for future internal docs)

## Setup after cloning

```bash
./hooks/install.sh
```

This copies the tracked hook into `.git/hooks/` so it runs on commits. Git
doesn't track files inside `.git/`, which is why we keep the source of truth
here in `hooks/` and install it explicitly.

## To bypass the hook in an emergency

```bash
git commit --no-verify -m "..."
```

Not recommended. Fix the voice violations instead.
