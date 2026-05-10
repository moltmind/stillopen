#!/bin/bash
# stripe-setup.sh — Creates StillOpen products, prices, and webhook in Stripe
# Usage: Copy your Stripe SECRET key (sk_live_...) to clipboard, then run this script.
# The key never appears on screen or in shell history.

set -euo pipefail

SK=$(pbpaste | tr -d '[:space:]')

if [[ ! "$SK" =~ ^sk_ ]]; then
  echo "❌ Clipboard doesn't contain a Stripe secret key (should start with sk_live_ or sk_test_)"
  exit 1
fi

echo "→ Creating StillOpen products and prices in Stripe..."

# Create Starter product + price
echo ""
echo "Creating Starter ($49/mo)..."
STARTER=$(curl -s https://api.stripe.com/v1/products \
  -u "$SK:" \
  -d "name=StillOpen Starter" \
  -d "description=24/7 AI front desk. Chat + Google Calendar + Stripe deposits. 1 user.")

STARTER_ID=$(echo "$STARTER" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "  Product: $STARTER_ID"

STARTER_PRICE=$(curl -s https://api.stripe.com/v1/prices \
  -u "$SK:" \
  -d "product=$STARTER_ID" \
  -d "unit_amount=4900" \
  -d "currency=usd" \
  -d "recurring[interval]=month")

STARTER_PRICE_ID=$(echo "$STARTER_PRICE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "  Price:   $STARTER_PRICE_ID"

# Create Pro product + price
echo ""
echo "Creating Pro ($97/mo)..."
PRO=$(curl -s https://api.stripe.com/v1/products \
  -u "$SK:" \
  -d "name=StillOpen Pro" \
  -d "description=Everything in Starter + CRM sync + SMS + missed-call-text-back. Up to 3 users.")

PRO_ID=$(echo "$PRO" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "  Product: $PRO_ID"

PRO_PRICE=$(curl -s https://api.stripe.com/v1/prices \
  -u "$SK:" \
  -d "product=$PRO_ID" \
  -d "unit_amount=9700" \
  -d "currency=usd" \
  -d "recurring[interval]=month")

PRO_PRICE_ID=$(echo "$PRO_PRICE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "  Price:   $PRO_PRICE_ID"

# Create Elite product + price
echo ""
echo "Creating Elite ($197/mo)..."
ELITE=$(curl -s https://api.stripe.com/v1/products \
  -u "$SK:" \
  -d "name=StillOpen Elite" \
  -d "description=Everything in Pro + follow-up automation + voicemail handling + customer memory. Unlimited users.")

ELITE_ID=$(echo "$ELITE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "  Product: $ELITE_ID"

ELITE_PRICE=$(curl -s https://api.stripe.com/v1/prices \
  -u "$SK:" \
  -d "product=$ELITE_ID" \
  -d "unit_amount=19700" \
  -d "currency=usd" \
  -d "recurring[interval]=month")

ELITE_PRICE_ID=$(echo "$ELITE_PRICE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "  Price:   $ELITE_PRICE_ID"

# Create webhook endpoint
echo ""
echo "Creating webhook endpoint..."
WEBHOOK=$(curl -s https://api.stripe.com/v1/webhook_endpoints \
  -u "$SK:" \
  -d "url=https://app.stillopen.ai/webhook/stripe" \
  -d "enabled_events[]=checkout.session.completed" \
  -d "enabled_events[]=customer.subscription.deleted" \
  -d "enabled_events[]=customer.subscription.updated")

WEBHOOK_SECRET=$(echo "$WEBHOOK" | python3 -c "import sys,json; print(json.load(sys.stdin)['secret'])" 2>/dev/null)
WEBHOOK_ID=$(echo "$WEBHOOK" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "  Webhook: $WEBHOOK_ID"
echo "  Secret:  $WEBHOOK_SECRET"

echo ""
echo "============================================"
echo "DONE. Save these — you'll need them as worker secrets:"
echo ""
echo "STRIPE_PRICE_STARTER=$STARTER_PRICE_ID"
echo "STRIPE_PRICE_PRO=$PRO_PRICE_ID"
echo "STRIPE_PRICE_ELITE=$ELITE_PRICE_ID"
echo "STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET"
echo ""
echo "To set them, run these one at a time:"
echo "  echo '$STARTER_PRICE_ID' | pbcopy && ~/Desktop/StillOpen.ai/stillopen/scripts/set-secret.sh STRIPE_PRICE_STARTER"
echo "  echo '$PRO_PRICE_ID' | pbcopy && ~/Desktop/StillOpen.ai/stillopen/scripts/set-secret.sh STRIPE_PRICE_PRO"
echo "  echo '$ELITE_PRICE_ID' | pbcopy && ~/Desktop/StillOpen.ai/stillopen/scripts/set-secret.sh STRIPE_PRICE_ELITE"
echo "  echo '$WEBHOOK_SECRET' | pbcopy && ~/Desktop/StillOpen.ai/stillopen/scripts/set-secret.sh STRIPE_WEBHOOK_SECRET"
echo "============================================"
