#!/usr/bin/env bash
# stripe-bootstrap.sh — One-shot setup for StillOpen Stripe Checkout
#
# What this does (in order):
#   1. Reads your Stripe TEST secret key from the clipboard (sk_test_...)
#   2. Creates "StillOpen Express Install" product + $297 one-time price
#   3. Creates "StillOpen Monthly Service" product + $47/mo recurring price
#   4. Sets STRIPE_SECRET_KEY, STRIPE_PRICE_INSTALL, STRIPE_PRICE_STARTER
#      as wrangler secrets on the worker
#   5. Logs the price IDs to scripts/round-2/stripe-bootstrap-log.md
#   6. Prints both price IDs so we can verify
#
# Usage:
#   1. Open https://dashboard.stripe.com/test/apikeys
#   2. Click "Reveal test key" under "Secret key"
#   3. Copy it (starts with sk_test_...)
#   4. Run: ./scripts/stripe-bootstrap.sh
#
# To run against LIVE keys later, the script auto-detects sk_live_ vs sk_test_
# and uses the matching mode. Same script, different clipboard.

set -euo pipefail

REPO_ROOT="/Users/faith/Desktop/StillOpen.ai/stillopen"
LOG_PATH="${REPO_ROOT}/scripts/round-2/stripe-bootstrap-log.md"

cd "$REPO_ROOT"

# ── 1. Read secret from clipboard ─────────────────────────────────────────────
SK=$(pbpaste | tr -d '[:space:]')

if [[ -z "$SK" ]]; then
  echo "ERROR: clipboard is empty. Copy your Stripe secret key (sk_test_... or sk_live_...) first."
  exit 1
fi

if [[ ! "$SK" =~ ^sk_(test|live)_ ]]; then
  echo "ERROR: clipboard doesn't look like a Stripe secret key."
  echo "  Expected to start with sk_test_ or sk_live_"
  echo "  Got: ${SK:0:10}... (length ${#SK})"
  echo "  Open https://dashboard.stripe.com/test/apikeys and copy 'Secret key'"
  exit 1
fi

if [[ "$SK" == sk_test_* ]]; then
  MODE="TEST"
elif [[ "$SK" == sk_live_* ]]; then
  MODE="LIVE"
fi

echo "============================================================"
echo "STRIPE BOOTSTRAP — StillOpen — $MODE MODE"
echo "============================================================"
echo "  Key prefix:  ${SK:0:11}..."
echo "  Length:      ${#SK} chars"
echo "============================================================"

if [[ "$MODE" == "LIVE" ]]; then
  echo ""
  echo "WARNING: this will create LIVE products in your real Stripe account."
  echo "If you meant to test first, copy a sk_test_ key instead and re-run."
  read -p "Type LIVE to continue, anything else to abort: " confirm
  if [[ "$confirm" != "LIVE" ]]; then
    echo "Aborted. Nothing changed."
    exit 0
  fi
fi

# ── 2. Create Express Install product ($297 one-time) ────────────────────────
echo ""
echo "Creating product: StillOpen Express Install (one-time \$297)..."

INSTALL_PRODUCT=$(curl -sS https://api.stripe.com/v1/products \
  -u "$SK:" \
  -d "name=StillOpen Express Install" \
  -d "description=One-time setup fee. AI front desk live on your site in 48 hours.")

INSTALL_PRODUCT_ID=$(echo "$INSTALL_PRODUCT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)

if [[ -z "$INSTALL_PRODUCT_ID" ]]; then
  echo "ERROR creating Install product. Stripe response:"
  echo "$INSTALL_PRODUCT"
  exit 1
fi
echo "  Product:  $INSTALL_PRODUCT_ID"

INSTALL_PRICE=$(curl -sS https://api.stripe.com/v1/prices \
  -u "$SK:" \
  -d "product=$INSTALL_PRODUCT_ID" \
  -d "unit_amount=29700" \
  -d "currency=usd")

INSTALL_PRICE_ID=$(echo "$INSTALL_PRICE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)

if [[ -z "$INSTALL_PRICE_ID" ]]; then
  echo "ERROR creating Install price. Stripe response:"
  echo "$INSTALL_PRICE"
  exit 1
fi
echo "  Price:    $INSTALL_PRICE_ID  (\$297.00 one-time)"

# ── 3. Create Monthly Service product ($47/mo recurring) ─────────────────────
echo ""
echo "Creating product: StillOpen Monthly Service (\$47/mo recurring)..."

MONTHLY_PRODUCT=$(curl -sS https://api.stripe.com/v1/products \
  -u "$SK:" \
  -d "name=StillOpen Monthly Service" \
  -d "description=24/7 AI front desk. Calendar bookings + Stripe deposits + lead notifications.")

MONTHLY_PRODUCT_ID=$(echo "$MONTHLY_PRODUCT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)

if [[ -z "$MONTHLY_PRODUCT_ID" ]]; then
  echo "ERROR creating Monthly product. Stripe response:"
  echo "$MONTHLY_PRODUCT"
  exit 1
fi
echo "  Product:  $MONTHLY_PRODUCT_ID"

MONTHLY_PRICE=$(curl -sS https://api.stripe.com/v1/prices \
  -u "$SK:" \
  -d "product=$MONTHLY_PRODUCT_ID" \
  -d "unit_amount=4700" \
  -d "currency=usd" \
  -d "recurring[interval]=month")

MONTHLY_PRICE_ID=$(echo "$MONTHLY_PRICE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)

if [[ -z "$MONTHLY_PRICE_ID" ]]; then
  echo "ERROR creating Monthly price. Stripe response:"
  echo "$MONTHLY_PRICE"
  exit 1
fi
echo "  Price:    $MONTHLY_PRICE_ID  (\$47.00/month)"

# ── 4. Set wrangler secrets on the worker ────────────────────────────────────
echo ""
echo "Setting wrangler secrets on app.stillopen.ai worker..."

echo "  → STRIPE_SECRET_KEY"
echo "$SK" | wrangler secret put STRIPE_SECRET_KEY 2>&1 | tail -3

echo "  → STRIPE_PRICE_INSTALL"
echo "$INSTALL_PRICE_ID" | wrangler secret put STRIPE_PRICE_INSTALL 2>&1 | tail -3

echo "  → STRIPE_PRICE_STARTER"
echo "$MONTHLY_PRICE_ID" | wrangler secret put STRIPE_PRICE_STARTER 2>&1 | tail -3

# ── 5. Log + summary ─────────────────────────────────────────────────────────
mkdir -p "$(dirname "$LOG_PATH")"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [[ ! -f "$LOG_PATH" ]]; then
  cat > "$LOG_PATH" <<HEADER
# Stripe Bootstrap Log

Every Stripe products + secrets bootstrap, newest last.

| Timestamp (UTC) | Mode | Install Price ID | Monthly Price ID |
|---|---|---|---|
HEADER
fi

printf "| %s | %s | %s | %s |\n" \
  "$NOW" "$MODE" "$INSTALL_PRICE_ID" "$MONTHLY_PRICE_ID" \
  >> "$LOG_PATH"

echo ""
echo "============================================================"
echo "DONE — $MODE mode bootstrap complete"
echo "============================================================"
echo "  Install price ID:  $INSTALL_PRICE_ID"
echo "  Monthly price ID:  $MONTHLY_PRICE_ID"
echo "  Logged to:         $LOG_PATH"
echo "============================================================"
echo ""
echo "Next: tell Paul \"secrets set, both prices created\" and Paul"
echo "modifies worker /checkout to combine install + 7-day-trial subscription."
echo ""
