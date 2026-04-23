#!/usr/bin/env bash
# Express Install: provision a real paying StillOpen customer.
#
# Flow:
#   1. Call /admin/provision-plumber -> creates Clerk user, returns userId,
#      sign-in URL, and a ready-to-paste embed snippet.
#   2. Log the install to scripts/round-2/express-install-log.md.
#   3. Print a text-ready SMS in Cole's voice that Cole can paste into
#      his phone and send to the new customer.
#
# Does NOT seed the KB automatically. The customer seeds their own KB by
# clicking their sign-in link, landing in the admin dashboard, and hitting
# "Scan my site" (which triggers /scrape with their Clerk session). That
# is the cleanest path without a new admin-scrape-for-user endpoint.
#
# Usage:
#   express-install.sh \
#     --email wes@hollowcreek.com \
#     --name "Wes Tolliver" \
#     --business "Hollow Creek Plumbing" \
#     --phone "5551230101" \
#     --website "https://hollowcreek.com" \
#     [--tier starter|pro|elite] \
#     [--dry-run]
#
# Cost: zero. Just a Clerk user creation (on Cole's existing plan) and an
# SMS Cole sends from his phone. No Firecrawl, no ElevenLabs, no Stripe.

set -euo pipefail

WORKER_URL="https://app.stillopen.ai"
REPO_ROOT="/Users/faith/Desktop/StillOpen.ai/stillopen"
ADMIN_SECRET_PATH="${REPO_ROOT}/.admin-secret-local"
LOG_PATH="${REPO_ROOT}/scripts/round-2/express-install-log.md"

EMAIL=""
NAME=""
BUSINESS=""
PHONE=""
WEBSITE=""
TIER="starter"
DRY_RUN=0

usage() {
  sed -n '3,24p' "$0"
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --email)    EMAIL="$2"; shift 2 ;;
    --name)     NAME="$2"; shift 2 ;;
    --business) BUSINESS="$2"; shift 2 ;;
    --phone)    PHONE="$2"; shift 2 ;;
    --website)  WEBSITE="$2"; shift 2 ;;
    --tier)     TIER="$2"; shift 2 ;;
    --dry-run)  DRY_RUN=1; shift ;;
    -h|--help)  usage ;;
    *)          echo "Unknown flag: $1"; usage ;;
  esac
done

if [ -z "$EMAIL" ] || [ -z "$NAME" ] || [ -z "$BUSINESS" ]; then
  echo "ERROR: --email, --name, and --business are required."
  usage
fi

if [ ! -f "$ADMIN_SECRET_PATH" ]; then
  echo "ERROR: admin secret not found at $ADMIN_SECRET_PATH"
  exit 1
fi
ADMIN_SECRET=$(tr -d '[:space:]' < "$ADMIN_SECRET_PATH")
if [ ${#ADMIN_SECRET} -lt 32 ]; then
  echo "ERROR: admin secret at $ADMIN_SECRET_PATH looks invalid (length ${#ADMIN_SECRET})"
  exit 1
fi

FIRST_NAME="${NAME%% *}"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "============================================================"
echo "EXPRESS INSTALL — StillOpen"
echo "============================================================"
echo "  Business:  $BUSINESS"
echo "  Owner:     $NAME ($FIRST_NAME)"
echo "  Email:     $EMAIL"
echo "  Phone:     ${PHONE:-(not provided)}"
echo "  Website:   ${WEBSITE:-(not provided)}"
echo "  Tier:      $TIER"
echo "  Mode:      $( [ $DRY_RUN -eq 1 ] && echo "DRY-RUN (no Clerk write)" || echo "LIVE" )"
echo "  Worker:    $WORKER_URL"
echo "============================================================"

if [ $DRY_RUN -eq 1 ]; then
  USER_ID="user_DRY_RUN_placeholder"
  SIGN_IN_URL="https://stillopen.ai/app/login.html?__clerk_ticket=DRY_RUN_TICKET"
  EMBED_CODE="<script src=\"${WORKER_URL}/chatbot.js\" data-plumber-id=\"${USER_ID}\"></script>"
else
  PAYLOAD=$(cat <<EOF
{"email":"${EMAIL}","name":"${NAME}","tier":"${TIER}"}
EOF
)
  RESPONSE=$(curl -sS --max-time 30 \
    -X POST "${WORKER_URL}/admin/provision-plumber" \
    -H "Content-Type: application/json" \
    -H "X-Admin-Token: ${ADMIN_SECRET}" \
    -d "${PAYLOAD}")

  if ! echo "$RESPONSE" | python3 -c "import sys, json; d = json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)"; then
    echo "PROVISION FAILED. Worker response:"
    echo "$RESPONSE"
    exit 1
  fi

  USER_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('userId', ''))")
  SIGN_IN_URL=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('signInUrl', ''))")
  EMBED_CODE=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('embedCode', ''))")
fi

SMS_MESSAGE="Hey ${FIRST_NAME}. You are live on StillOpen.

Step 1. Click this inside the next hour to set up your dashboard: ${SIGN_IN_URL}

Step 2. Inside, hit Scan My Site. Takes about a minute. That teaches the AI your services, hours, and prices.

Step 3. Paste this one line anywhere on your homepage (before the closing body tag):
${EMBED_CODE}

That is it. The chat bubble goes live the second the tag is on your site. Text me if you hit a snag.

Cole"

echo ""
echo "============================================================"
echo "SMS TO SEND (paste into your phone to ${PHONE:-$EMAIL}):"
echo "============================================================"
echo "$SMS_MESSAGE"
echo "============================================================"
echo ""
echo "CUSTOMER CREDENTIALS (log only):"
echo "  userId:      $USER_ID"
echo "  signInUrl:   $SIGN_IN_URL"
echo "  embedCode:   $EMBED_CODE"
echo ""

mkdir -p "$(dirname "$LOG_PATH")"
if [ ! -f "$LOG_PATH" ]; then
  cat > "$LOG_PATH" <<'HEADER'
# Express Install Log

Every real-customer provisioning, newest last.

| Timestamp (UTC) | Business | Owner | Email | Tier | userId | Mode |
|---|---|---|---|---|---|---|
HEADER
fi
MODE_LABEL=$( [ $DRY_RUN -eq 1 ] && echo "dry-run" || echo "live" )
printf "| %s | %s | %s | %s | %s | %s | %s |\n" \
  "$NOW" "$BUSINESS" "$NAME" "$EMAIL" "$TIER" "$USER_ID" "$MODE_LABEL" \
  >> "$LOG_PATH"

echo "Logged to $LOG_PATH"
