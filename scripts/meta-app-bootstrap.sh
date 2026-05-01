#!/usr/bin/env bash
# meta-app-bootstrap.sh -- One-shot setup for StillOpen FB Messenger bot.
#
# What this does (in order):
#   1. Validates the App ID you pass in
#   2. Reads your Meta App Secret from the clipboard
#   3. Generates a random META_VERIFY_TOKEN (32 hex chars)
#   4. Sets META_APP_ID, META_APP_SECRET, META_VERIFY_TOKEN as wrangler secrets
#      on the stillopen-production worker
#   5. Logs the bootstrap to scripts/round-2/meta-bootstrap-log.md
#   6. Prints the webhook URL and verify token Cole pastes into Meta dashboard
#
# Usage:
#   1. In Meta App Dashboard: Settings -> Basic -> Show App Secret -> Copy
#   2. Run: ./scripts/meta-app-bootstrap.sh <APP_ID>
#      Example: ./scripts/meta-app-bootstrap.sh 1264508738733186

set -euo pipefail

REPO_ROOT="/Users/faith/Desktop/StillOpen.ai/stillopen"
LOG_PATH="${REPO_ROOT}/scripts/round-2/meta-bootstrap-log.md"

cd "$REPO_ROOT"

# -- 0. Validate App ID arg ---------------------------------------------------
if [[ $# -lt 1 ]]; then
  echo "ERROR: missing App ID."
  echo "  Usage:    ./scripts/meta-app-bootstrap.sh <APP_ID>"
  echo "  Example:  ./scripts/meta-app-bootstrap.sh 1264508738733186"
  exit 1
fi

APP_ID="$1"

if [[ ! "$APP_ID" =~ ^[0-9]{10,20}$ ]]; then
  echo "ERROR: App ID looks wrong. Expected 10 to 20 digits."
  echo "  Got: $APP_ID"
  exit 1
fi

# -- 1. Read App Secret from clipboard ----------------------------------------
SECRET=$(pbpaste | tr -d '[:space:]')

if [[ -z "$SECRET" ]]; then
  echo "ERROR: clipboard is empty. Copy your Meta App Secret first."
  echo "  developers.facebook.com -> your app -> Settings -> Basic"
  echo "  Click 'Show' next to App Secret, enter your FB password, copy."
  exit 1
fi

# Meta App Secrets are typically 32 lowercase hex chars. Warn if it looks off
# but allow override (Meta has rotated the format before).
if [[ ${#SECRET} -ne 32 || ! "$SECRET" =~ ^[a-f0-9]+$ ]]; then
  echo "WARN: clipboard doesn't match the typical Meta App Secret shape."
  echo "  Expected: 32 lowercase hex characters"
  echo "  Got:      ${SECRET:0:6}... (length ${#SECRET})"
  read -p "Continue anyway? Type YES to continue: " confirm
  if [[ "$confirm" != "YES" ]]; then
    echo "Aborted. Nothing changed."
    exit 0
  fi
fi

# -- 2. Generate verify token -------------------------------------------------
VERIFY_TOKEN=$(openssl rand -hex 16)

echo "============================================================"
echo "META APP BOOTSTRAP -- StillOpen Messenger"
echo "============================================================"
echo "  App ID:         $APP_ID"
echo "  App Secret:     ${SECRET:0:4}...${SECRET: -4} (length ${#SECRET})"
echo "  Verify token:   $VERIFY_TOKEN"
echo "============================================================"

# -- 3. Set wrangler secrets --------------------------------------------------
echo ""
echo "Setting wrangler secrets on app.stillopen.ai worker..."

echo "  -> META_APP_ID"
echo "$APP_ID" | wrangler secret put META_APP_ID 2>&1 | tail -3

echo "  -> META_APP_SECRET"
echo "$SECRET" | wrangler secret put META_APP_SECRET 2>&1 | tail -3

echo "  -> META_VERIFY_TOKEN"
echo "$VERIFY_TOKEN" | wrangler secret put META_VERIFY_TOKEN 2>&1 | tail -3

# -- 4. Log + summary ---------------------------------------------------------
mkdir -p "$(dirname "$LOG_PATH")"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [[ ! -f "$LOG_PATH" ]]; then
  cat > "$LOG_PATH" <<HEADER
# Meta App Bootstrap Log

Every Meta App + secrets bootstrap on this worker, newest last.

| Timestamp (UTC) | App ID | Verify Token (first 8) |
|---|---|---|
HEADER
fi

printf "| %s | %s | %s... |\n" \
  "$NOW" "$APP_ID" "${VERIFY_TOKEN:0:8}" \
  >> "$LOG_PATH"

# -- 5. What Cole pastes into the Meta dashboard ------------------------------
echo ""
echo "============================================================"
echo "DONE -- secrets set on the worker"
echo "============================================================"
echo ""
echo "Next, in the Meta App Dashboard, add the Messenger product (if it's not"
echo "already added) and configure the webhook with these exact values:"
echo ""
echo "  Callback URL:    https://app.stillopen.ai/webhook/messenger"
echo "  Verify Token:    $VERIFY_TOKEN"
echo ""
echo "Then subscribe the webhook to these Page events:"
echo "  - messages"
echo "  - messaging_postbacks"
echo ""
echo "When you click 'Verify and Save', Meta will GET our endpoint with the"
echo "verify token. If the worker is deployed with the matching secret, it"
echo "echoes Meta's challenge back and the green check shows up."
echo ""
echo "Verify token is also saved here in case you need it again:"
echo "  $LOG_PATH"
echo ""
echo "============================================================"
