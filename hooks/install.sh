#!/bin/bash
# Installs the paul-voice pre-commit hook from this repo into .git/hooks/.
# Run this after cloning the repo or after any git checkout that wipes hooks.
set -e
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO_ROOT="$( cd -- "${SCRIPT_DIR}/.." &> /dev/null && pwd )"
TARGET="${REPO_ROOT}/.git/hooks/pre-commit"
cp "${SCRIPT_DIR}/pre-commit" "${TARGET}"
chmod +x "${TARGET}"
echo "✓ Installed pre-commit hook → ${TARGET}"
echo ""
echo "The hook blocks commits if staged .md files contain em-dashes or banned"
echo "coach words. Internal docs (Claude.md, partners/*/brief.md, *.internal.md)"
echo "skip the strict voice check but still get the em-dash check."
