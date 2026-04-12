#!/usr/bin/env bash
#
# test-signin-token.sh
#
# Smoke-tests the Clerk Sign-in Tokens API by minting a token for the existing
# dev user and printing the sign-in URL. Used to verify the onboarding email
# flow works BEFORE a real paying customer triggers it.
#
# Usage:
#   1. Copy your Clerk secret key (sk_test_ or sk_live_) to your clipboard
#   2. Run: bash scripts/test-signin-token.sh
#   3. The script mints a token, prints the sign-in URL
#   4. Click the URL in a browser → should auto-sign-in to the dashboard
#
# The token expires in 7 days but is single-use. If you click it once and it
# works, that's proof the onboarding flow will work for real customers.

set -euo pipefail

DEV_USER_ID="user_3C85eIXNeefCTvZ9zi0xv3wkcSK"  # the dev user from mint-dev-session.sh

CLERK_SECRET="$(pbpaste | tr -d '[:space:]')"

if [[ ! "$CLERK_SECRET" =~ ^sk_(test|live)_ ]]; then
  echo "ERROR: Clipboard does not contain a Clerk secret key." >&2
  echo "Copy your Clerk secret key (sk_test_... or sk_live_...) first." >&2
  exit 1
fi

echo "-> Minting sign-in token for dev user $DEV_USER_ID..."

RESPONSE=$(curl -sS -X POST "https://api.clerk.com/v1/sign_in_tokens" \
  -H "Authorization: Bearer $CLERK_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$DEV_USER_ID\",\"expires_in_seconds\":604800}")

TOKEN=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('token',''))" 2>/dev/null || echo "")

if [[ -z "$TOKEN" ]]; then
  echo "ERROR: Could not mint sign-in token. Raw response:" >&2
  echo "$RESPONSE" >&2
  exit 1
fi

unset CLERK_SECRET

echo ""
echo "=================================================================="
echo "  SIGN-IN TOKEN MINTED"
echo "=================================================================="
echo ""
echo "  Click this URL to test the auto-sign-in flow:"
echo ""
echo "  https://stillopen.ai/app/login.html?__clerk_ticket=$TOKEN"
echo ""
echo "  Expected behavior:"
echo "    1. Browser loads login.html"
echo "    2. Clerk SDK detects the ticket and signs you in"
echo "    3. Redirects to /app/dashboard.html"
echo "    4. You see the onboarding wizard (if you haven't dismissed it)"
echo ""
echo "  If this works, the onboarding email flow is verified for real"
echo "  paying customers."
echo ""
echo "  Token expires in 7 days or after first click, whichever is first."
echo "=================================================================="
