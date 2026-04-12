#!/usr/bin/env bash
#
# clerk-prod-swap.sh
#
# Swaps Clerk dev instance references to production in the 3 app HTML files.
# Use this during Phase 6 of the Clerk production migration runbook once you
# have the new production publishable key and Frontend API hostname from the
# Clerk dashboard.
#
# Usage:
#   bash scripts/clerk-prod-swap.sh <new-clerk-hostname> <new-pk_live-key>
#
# Example:
#   bash scripts/clerk-prod-swap.sh clerk.stillopen.ai pk_live_abc123xyz789
#
# The script:
#   1. Validates both arguments (hostname looks like a hostname, pk_live key
#      starts with pk_live_)
#   2. Creates a timestamped backup of each file in /tmp (in case we need to
#      roll back)
#   3. Replaces the dev hostname and dev pk_test_ key in all 3 files atomically
#   4. Runs a final grep to confirm no dev references remain
#
# After running this script:
#   1. git diff to review the changes
#   2. Run `node -c worker.js` as a sanity check (not needed but cheap)
#   3. git add + commit the 3 HTML files
#   4. git push
#   5. Hard refresh app/login.html in a browser for Phase 7 of the runbook

set -euo pipefail

# --- Config ---
OLD_HOSTNAME="dear-crab-95.clerk.accounts.dev"
OLD_PK="pk_test_ZGVhci1jcmFiLTk1LmNsZXJrLmFjY291bnRzLmRldiQ"
TARGET_FILES=("app/login.html" "app/settings.html" "app/dashboard.html")

# --- Parse args ---
if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <new-clerk-hostname> <new-pk_live-key>" >&2
  echo "" >&2
  echo "Example:" >&2
  echo "  $0 clerk.stillopen.ai pk_live_abc123xyz789" >&2
  exit 1
fi

NEW_HOSTNAME="$1"
NEW_PK="$2"

# --- Validate inputs ---
if [[ ! "$NEW_HOSTNAME" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$ ]]; then
  echo "ERROR: '$NEW_HOSTNAME' does not look like a valid hostname." >&2
  echo "  Expected something like 'clerk.stillopen.ai' or 'abc-xyz-22.clerk.accounts.dev'" >&2
  exit 1
fi

if [[ ! "$NEW_PK" =~ ^pk_live_ ]]; then
  echo "ERROR: '$NEW_PK' does not start with pk_live_" >&2
  echo "  Production publishable keys always start with pk_live_" >&2
  echo "  Did you paste the dev key by mistake? Abort and re-copy." >&2
  exit 1
fi

if [[ ! -f "app/login.html" ]]; then
  echo "ERROR: Must run from the stillopen/ directory." >&2
  exit 1
fi

# --- Pre-check: old references are present ---
MATCH_COUNT=0
for f in "${TARGET_FILES[@]}"; do
  COUNT=$(grep -c "$OLD_HOSTNAME\|$OLD_PK" "$f" || true)
  if [[ "$COUNT" -eq 0 ]]; then
    echo "WARNING: $f has no dev references. Already migrated? Aborting to be safe." >&2
    exit 1
  fi
  MATCH_COUNT=$((MATCH_COUNT + COUNT))
done
echo "-> Found $MATCH_COUNT dev references across ${#TARGET_FILES[@]} files"

# --- Backup ---
BACKUP_DIR="/tmp/clerk-prod-swap-backup-$(date +%s)"
mkdir -p "$BACKUP_DIR"
for f in "${TARGET_FILES[@]}"; do
  cp "$f" "$BACKUP_DIR/$(basename "$f")"
done
echo "-> Backup saved to $BACKUP_DIR"

# --- Apply replacement ---
echo "-> Swapping hostname: $OLD_HOSTNAME → $NEW_HOSTNAME"
echo "-> Swapping pk:       $OLD_PK → $NEW_PK"
echo ""

for f in "${TARGET_FILES[@]}"; do
  # Use portable sed (works on macOS and Linux)
  # Each file gets both replacements, written to .tmp then moved atomically
  sed -e "s|${OLD_HOSTNAME}|${NEW_HOSTNAME}|g" \
      -e "s|${OLD_PK}|${NEW_PK}|g" \
      "$f" > "$f.tmp"
  mv "$f.tmp" "$f"
  echo "  ✓ $f"
done

echo ""

# --- Post-check: no dev references left ---
REMAINING=0
for f in "${TARGET_FILES[@]}"; do
  COUNT=$(grep -c "$OLD_HOSTNAME\|$OLD_PK" "$f" || true)
  REMAINING=$((REMAINING + COUNT))
done

if [[ "$REMAINING" -ne 0 ]]; then
  echo "ERROR: $REMAINING dev references remain after swap. Investigate:" >&2
  grep -l "$OLD_HOSTNAME\|$OLD_PK" "${TARGET_FILES[@]}" >&2
  echo "" >&2
  echo "Your files have been modified. Restore from $BACKUP_DIR if needed:" >&2
  echo "  cp $BACKUP_DIR/*.html app/" >&2
  exit 1
fi

# --- Post-check: new references are now present ---
for f in "${TARGET_FILES[@]}"; do
  if ! grep -q "$NEW_HOSTNAME" "$f"; then
    echo "ERROR: $f does not contain the new hostname after swap." >&2
    exit 1
  fi
  if ! grep -q "$NEW_PK" "$f"; then
    echo "ERROR: $f does not contain the new pk_live key after swap." >&2
    exit 1
  fi
done

echo "=================================================================="
echo "  CLERK PROD SWAP COMPLETE"
echo "=================================================================="
echo "  Files changed:       ${#TARGET_FILES[@]}"
echo "  References swapped:  $MATCH_COUNT"
echo "  Backup location:     $BACKUP_DIR"
echo ""
echo "  Next steps:"
echo "    1. git diff           (review the 3 file changes)"
echo "    2. git add app/*.html"
echo "    3. git commit -m 'Clerk production migration: swap dev → prod keys'"
echo "    4. git push           (GitHub Pages redeploys in ~60s)"
echo "    5. Hard-refresh app/login.html in a browser (Cmd+Shift+R)"
echo "    6. Run Phase 7 of the runbook (sign up, onboard, connect calendar)"
echo "=================================================================="
