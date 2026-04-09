#!/usr/bin/env bash
#
# mint-dev-session.sh
#
# Mint a dev Clerk session JWT for testing StillOpen's authenticated endpoints
# (/scrape, /config, /bookings) without touching a browser.
#
# Usage:
#   1. Copy your Clerk Secret Key (sk_test_... or sk_live_...) to your clipboard.
#      Find it at: dashboard.clerk.com -> API Keys -> Secret keys -> Show -> Copy
#   2. Run: ~/Desktop/stillopen/scripts/mint-dev-session.sh
#   3. The script reads the secret from your clipboard, creates (or reuses)
#      a dev user, mints a session, and prints a session JWT to stdout.
#   4. Copy the JWT line and paste it to Max.
#   5. Overwrite your clipboard immediately (copy something else).
#
# The Clerk secret key is NEVER written to disk, shell history, or terminal
# output. It lives in your clipboard only while this script is running and is
# passed to curl via a header argument (not visible in `ps` on macOS).
#
# The JWT expires in ~60 seconds per Clerk's default. Re-run anytime to mint
# a fresh one.

set -euo pipefail

CLERK_API="https://api.clerk.com/v1"
DEV_EMAIL="max-dev+stillopen@stillopen.ai"

# --- Read and validate the secret from the clipboard -------------------------
CLERK_SECRET="$(pbpaste | tr -d '[:space:]')"

if [[ -z "$CLERK_SECRET" ]]; then
  echo "ERROR: Clipboard is empty. Copy your Clerk secret key first." >&2
  echo "  dashboard.clerk.com -> API Keys -> Secret keys -> Show -> Copy" >&2
  exit 1
fi

if [[ ! "$CLERK_SECRET" =~ ^sk_(test|live)_ ]]; then
  PREFIX="${CLERK_SECRET:0:8}"
  echo "ERROR: Clipboard does not contain a Clerk secret key." >&2
  echo "Expected something starting with 'sk_test_' or 'sk_live_'." >&2
  echo "You copied something starting with: '${PREFIX}...'" >&2
  exit 1
fi

# --- Helper: parse a JSON field via python3 (preinstalled on macOS) ----------
json_get() {
  # Usage: echo "$RESPONSE" | json_get "path.to.field"
  python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
except Exception as e:
    print('', end='')
    sys.exit(0)

parts = sys.argv[1].split('.')
cur = d
for p in parts:
    if isinstance(cur, list):
        try:
            cur = cur[int(p)]
        except Exception:
            cur = None
            break
    elif isinstance(cur, dict):
        cur = cur.get(p)
    else:
        cur = None
        break
    if cur is None:
        break
print(cur if cur is not None else '', end='')
" "$1"
}

# --- Step 1: look up existing dev user ---------------------------------------
echo "-> Looking for existing dev user ($DEV_EMAIL)..." >&2

EMAIL_ENCODED=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$DEV_EMAIL")

USER_LOOKUP=$(curl -sS "$CLERK_API/users?email_address=$EMAIL_ENCODED" \
  -H "Authorization: Bearer $CLERK_SECRET")

USER_ID=$(echo "$USER_LOOKUP" | json_get "0.id")

# --- Step 2: create user if none found ---------------------------------------
if [[ -z "$USER_ID" ]]; then
  echo "-> No existing user. Creating new dev user..." >&2

  DEV_PASSWORD="SOdev-$(openssl rand -hex 12)-Xy9!"

  USER_CREATE=$(curl -sS -X POST "$CLERK_API/users" \
    -H "Authorization: Bearer $CLERK_SECRET" \
    -H "Content-Type: application/json" \
    -d "{
      \"email_address\": [\"$DEV_EMAIL\"],
      \"password\": \"$DEV_PASSWORD\",
      \"first_name\": \"Max\",
      \"last_name\": \"Dev\",
      \"skip_password_checks\": true,
      \"skip_password_requirement\": false
    }")

  USER_ID=$(echo "$USER_CREATE" | json_get "id")

  if [[ -z "$USER_ID" ]]; then
    echo "ERROR: Could not create dev user. Clerk raw response:" >&2
    echo "$USER_CREATE" >&2
    exit 1
  fi

  echo "-> Created user: $USER_ID" >&2
else
  echo "-> Found existing user: $USER_ID" >&2
fi

# --- Step 3: create a session for the user -----------------------------------
echo "-> Creating session..." >&2

SESSION_CREATE=$(curl -sS -X POST "$CLERK_API/sessions" \
  -H "Authorization: Bearer $CLERK_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$USER_ID\"}")

SESSION_ID=$(echo "$SESSION_CREATE" | json_get "id")

if [[ -z "$SESSION_ID" ]]; then
  echo "ERROR: Could not create session. Clerk raw response:" >&2
  echo "$SESSION_CREATE" >&2
  exit 1
fi

echo "-> Session ID: $SESSION_ID" >&2

# --- Step 4: mint a session token (JWT) --------------------------------------
echo "-> Minting session token..." >&2

TOKEN_RESPONSE=$(curl -sS -X POST "$CLERK_API/sessions/$SESSION_ID/tokens" \
  -H "Authorization: Bearer $CLERK_SECRET" \
  -H "Content-Type: application/json")

JWT=$(echo "$TOKEN_RESPONSE" | json_get "jwt")

if [[ -z "$JWT" ]]; then
  echo "ERROR: Could not mint session token. Clerk raw response:" >&2
  echo "$TOKEN_RESPONSE" >&2
  exit 1
fi

# --- Clear the secret from memory (best-effort) ------------------------------
unset CLERK_SECRET

# --- Print the JWT to stdout (only the JWT, nothing else) --------------------
echo "" >&2
echo "=================================================================" >&2
echo "JWT (copy the line below to hand to Max):" >&2
echo "=================================================================" >&2
echo "$JWT"
echo "=================================================================" >&2
echo "" >&2
echo "-> JWT expires in ~60 seconds. Re-run this script to mint a fresh one." >&2
echo "-> Now overwrite your clipboard (copy something else) to clear the secret." >&2
