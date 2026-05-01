#!/usr/bin/env bash
# meta-page-connect.sh -- Save the test FB Page's access token to the worker.
#
# What this does:
#   1. Validates the Page ID argument
#   2. Reads the Page Access Token from clipboard
#   3. Sets META_PAGE_ID + META_PAGE_ACCESS_TOKEN as wrangler secrets
#   4. Logs to scripts/round-2/meta-page-log.md
#
# Usage:
#   1. In Meta App -> Messenger API Settings -> Generate Tokens
#   2. Click Generate next to your Page, click the copy icon on the displayed token
#   3. Run: ./scripts/meta-page-connect.sh <PAGE_ID>
#      Example: ./scripts/meta-page-connect.sh 110744628093661
#
# Note: this is the single-test-Page approach for tonight's wiring test.
# Real plumber pages will go through the OAuth flow with per-page KV storage.

set -euo pipefail

REPO_ROOT="/Users/faith/Desktop/StillOpen.ai/stillopen"
LOG_PATH="${REPO_ROOT}/scripts/round-2/meta-page-log.md"

cd "$REPO_ROOT"

if [[ $# -lt 1 ]]; then
  echo "ERROR: missing Page ID."
  echo "  Usage:    ./scripts/meta-page-connect.sh <PAGE_ID>"
  echo "  Example:  ./scripts/meta-page-connect.sh 110744628093661"
  exit 1
fi

PAGE_ID="$1"

if [[ ! "$PAGE_ID" =~ ^[0-9]{8,20}$ ]]; then
  echo "ERROR: Page ID looks wrong. Expected 8 to 20 digits."
  echo "  Got: $PAGE_ID"
  exit 1
fi

# -- 1. Read Page Access Token from clipboard ---------------------------------
TOKEN=$(pbpaste | tr -d '[:space:]')

if [[ -z "$TOKEN" ]]; then
  echo "ERROR: clipboard is empty. Copy your Page Access Token first."
  echo "  Meta App -> Messenger API Settings -> Generate Tokens -> Generate"
  echo "  Click the copy icon next to the displayed token."
  exit 1
fi

if [[ ${#TOKEN} -lt 50 ]]; then
  echo "WARN: clipboard content is shorter than expected for a Page Access Token."
  echo "  Got: ${TOKEN:0:6}... (length ${#TOKEN})"
  echo "  Page Access Tokens are typically 150-300 characters."
  read -p "Continue anyway? Type YES to continue: " confirm
  if [[ "$confirm" != "YES" ]]; then
    echo "Aborted."
    exit 0
  fi
fi

if [[ ! "$TOKEN" =~ ^EAA ]]; then
  echo "WARN: token doesn't start with 'EAA' (the usual Meta prefix)."
  echo "  Got: ${TOKEN:0:6}..."
  read -p "Continue anyway? Type YES to continue: " confirm
  if [[ "$confirm" != "YES" ]]; then
    echo "Aborted."
    exit 0
  fi
fi

echo "============================================================"
echo "META PAGE CONNECT -- StillOpen Test Page"
echo "============================================================"
echo "  Page ID:        $PAGE_ID"
echo "  Token prefix:   ${TOKEN:0:8}..."
echo "  Token length:   ${#TOKEN} chars"
echo "============================================================"

# -- 2. Set wrangler secrets --------------------------------------------------
echo ""
echo "Setting wrangler secrets on app.stillopen.ai worker..."

echo "  -> META_PAGE_ID"
echo "$PAGE_ID" | wrangler secret put META_PAGE_ID 2>&1 | tail -3

echo "  -> META_PAGE_ACCESS_TOKEN"
echo "$TOKEN" | wrangler secret put META_PAGE_ACCESS_TOKEN 2>&1 | tail -3

# -- 3. Log + summary ---------------------------------------------------------
mkdir -p "$(dirname "$LOG_PATH")"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [[ ! -f "$LOG_PATH" ]]; then
  cat > "$LOG_PATH" <<HEADER
# Meta Page Connect Log

Every Page Access Token bootstrap on this worker, newest last.

| Timestamp (UTC) | Page ID | Token prefix |
|---|---|---|
HEADER
fi

printf "| %s | %s | %s... |\n" \
  "$NOW" "$PAGE_ID" "${TOKEN:0:8}" \
  >> "$LOG_PATH"

echo ""
echo "============================================================"
echo "DONE -- Page secrets saved on the worker"
echo "============================================================"
echo ""
echo "Next: tell Paul 'page secrets set' so the worker update with the"
echo "AI brain + Send API hookup gets deployed. Then DM the test Page"
echo "from your personal FB and watch the bot reply."
echo ""
echo "Logged to: $LOG_PATH"
echo ""
