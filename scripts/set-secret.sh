#!/bin/bash
# StillOpen secret-setting helper.
#
# Usage:
#   1. Copy your secret value (API key, token, etc.) to your macOS clipboard
#   2. Run: ./scripts/set-secret.sh SECRET_NAME
#      Example: ./scripts/set-secret.sh ANTHROPIC_API_KEY
#
# What this does:
#   - Reads the clipboard via pbpaste
#   - Strips any trailing whitespace/newlines (tr -d)
#   - Pipes the cleaned value into `wrangler secret put` via stdin
#   - The secret value never appears in any command line, never lands in
#     shell history, never touches a file on disk
#
# After running:
#   - Copy something else (anything) to overwrite your clipboard
#   - Run `wrangler secret list` from this dir to verify the secret name
#     is stored (the value is never shown back, even to you)
#
# This script does NOT contain any secrets. It is safe to commit.

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 SECRET_NAME"
  echo "Example: $0 ANTHROPIC_API_KEY"
  exit 1
fi

SECRET_NAME="$1"

# cd to the directory that contains wrangler.toml (project root)
cd "$(dirname "$0")/.."

echo "→ Setting secret '$SECRET_NAME' for the StillOpen worker..."
echo "→ Reading clipboard, stripping whitespace, piping to wrangler..."
pbpaste | tr -d '\n\r\t ' | wrangler secret put "$SECRET_NAME"

echo ""
echo "✓ Done. Now copy something else to overwrite your clipboard."
