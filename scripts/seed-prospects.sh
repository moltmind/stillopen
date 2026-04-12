#!/usr/bin/env bash
#
# seed-prospects.sh
#
# Batch-seeds the /admin/seed-demo endpoint against drafts/prospect-list.json.
# Each prospect gets a 30-day KB cached at kb:seed-{hash} so when they click
# their outreach link, the demo loads instantly instead of taking 60 seconds.
#
# The seed URL format is:
#   https://stillopen.ai/?demo=seed-{hash}
#
# This script writes a JSONL manifest to drafts/seed-manifest.jsonl mapping
# each prospect to their demoUrl so Paul can bake the URLs into outreach copy.
#
# Usage:
#   1. Copy the ADMIN_SECRET value to your clipboard (or export ADMIN_SECRET env var)
#   2. Run one of:
#      ./scripts/seed-prospects.sh dry-run             # Show what WOULD happen, no API calls
#      ./scripts/seed-prospects.sh first 5             # Seed only the first 5 (test batch)
#      ./scripts/seed-prospects.sh metro Milwaukee     # Seed only Milwaukee prospects
#      ./scripts/seed-prospects.sh trade plumbing      # Seed only plumbing trade
#      ./scripts/seed-prospects.sh all                 # Seed ALL 112 prospects
#
# Each Firecrawl scrape costs roughly $0.04-0.05, so seeding all 112 ≈ $5.
# Paul can run this before each outreach wave to refresh any stale KBs.
#
# Rate limiting: we space requests 2 seconds apart to avoid hammering Firecrawl
# or hitting any concurrent-request limits on Cloudflare Workers.

set -euo pipefail

# --- Config ---
WORKER_URL="https://app.stillopen.ai"
PROSPECT_FILE="drafts/prospect-list.json"
MANIFEST_FILE="drafts/seed-manifest.jsonl"
DELAY_SECONDS=2

# --- Parse mode ---
MODE="${1:-}"
MODE_ARG="${2:-}"

if [[ -z "$MODE" ]]; then
  echo "Usage: $0 <mode> [arg]" >&2
  echo "  dry-run              Preview without making API calls" >&2
  echo "  first <N>            Seed only the first N prospects" >&2
  echo "  metro <name>         Seed only a specific metro (e.g. Milwaukee)" >&2
  echo "  trade <name>         Seed only a specific trade (plumbing|HVAC|electrical|roofing)" >&2
  echo "  all                  Seed ALL prospects" >&2
  exit 1
fi

# --- Get admin secret ---
if [[ -z "${ADMIN_SECRET:-}" ]]; then
  ADMIN_SECRET="$(pbpaste | tr -d '[:space:]')"
  if [[ ! "$ADMIN_SECRET" =~ ^[a-f0-9]{64}$ ]]; then
    echo "ERROR: ADMIN_SECRET not found." >&2
    echo "Either export ADMIN_SECRET env var or copy the 64-char hex token to clipboard first." >&2
    exit 1
  fi
fi

# --- Verify prospect file exists ---
if [[ ! -f "$PROSPECT_FILE" ]]; then
  echo "ERROR: $PROSPECT_FILE not found. Run from the stillopen/ directory." >&2
  exit 1
fi

# --- Filter prospects using python ---
TOTAL_COUNT=$(python3 -c "import json; print(len(json.load(open('$PROSPECT_FILE'))))")
echo "-> Loaded $TOTAL_COUNT prospects from $PROSPECT_FILE"

FILTER_EXPR=""
case "$MODE" in
  dry-run)
    FILTER_EXPR="True"
    ;;
  first)
    if [[ -z "$MODE_ARG" ]]; then echo "ERROR: 'first' requires a count" >&2; exit 1; fi
    FILTER_EXPR="idx < $MODE_ARG"
    ;;
  metro)
    if [[ -z "$MODE_ARG" ]]; then echo "ERROR: 'metro' requires a name" >&2; exit 1; fi
    FILTER_EXPR="p.get('metro','').lower() == '$(echo "$MODE_ARG" | tr '[:upper:]' '[:lower:]')'"
    ;;
  trade)
    if [[ -z "$MODE_ARG" ]]; then echo "ERROR: 'trade' requires a name" >&2; exit 1; fi
    FILTER_EXPR="p.get('trade','').lower() == '$(echo "$MODE_ARG" | tr '[:upper:]' '[:lower:]')'"
    ;;
  all)
    FILTER_EXPR="True"
    ;;
  *)
    echo "ERROR: Unknown mode '$MODE'" >&2
    exit 1
    ;;
esac

# --- Extract matching prospects as pipe-delimited lines: name|url ---
PROSPECTS=$(python3 <<EOF
import json
data = json.load(open("$PROSPECT_FILE"))
for idx, p in enumerate(data):
    if $FILTER_EXPR:
        name = p.get('name','').replace('|','/')
        url = p.get('url','').strip()
        if url:
            print(f"{name}|{url}")
EOF
)

MATCH_COUNT=$(echo "$PROSPECTS" | grep -c '|' || true)
echo "-> Filter '$MODE $MODE_ARG' matched $MATCH_COUNT prospects"
echo ""

if [[ "$MODE" == "dry-run" ]]; then
  echo "=== DRY RUN — showing first 10 that would be seeded ==="
  echo "$PROSPECTS" | head -10
  echo ""
  echo "Total that would be seeded: $MATCH_COUNT"
  echo "Estimated cost: \$$(python3 -c "print(f'{$MATCH_COUNT * 0.05:.2f}')")"
  exit 0
fi

# --- Initialize manifest (append mode so repeated runs build up) ---
mkdir -p "$(dirname "$MANIFEST_FILE")"
echo "-> Manifest will be appended to $MANIFEST_FILE"
echo ""

# --- Seed each prospect ---
SUCCESS=0
FAILED=0
CACHED=0

while IFS='|' read -r NAME URL; do
  [[ -z "$URL" ]] && continue

  echo -n "  seeding: $NAME ... "

  PAYLOAD=$(python3 -c 'import json,sys; print(json.dumps({"websiteUrl": sys.argv[1], "prospectName": sys.argv[2]}))' "$URL" "$NAME")

  RESPONSE=$(curl -s -X POST "$WORKER_URL/admin/seed-demo" \
    -H "Content-Type: application/json" \
    -H "X-Admin-Token: $ADMIN_SECRET" \
    -d "$PAYLOAD" \
    --max-time 90)

  SUCCESS_FIELD=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('success',False))" 2>/dev/null || echo "False")

  if [[ "$SUCCESS_FIELD" == "True" ]]; then
    PLUMBER_ID=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('plumberId',''))")
    DEMO_URL=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('demoUrl',''))")
    BUSINESS_NAME=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('businessName',''))")
    IS_CACHED=$(echo "$RESPONSE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('cached',False))")

    if [[ "$IS_CACHED" == "True" ]]; then
      echo "cached ($PLUMBER_ID)"
      CACHED=$((CACHED + 1))
    else
      echo "ok ($PLUMBER_ID)"
      SUCCESS=$((SUCCESS + 1))
    fi

    # Append to manifest (pass values via argv so apostrophes/quotes don't break parsing)
    python3 -c 'import json,sys; print(json.dumps({"prospectName": sys.argv[1], "websiteUrl": sys.argv[2], "plumberId": sys.argv[3], "businessName": sys.argv[4], "demoUrl": sys.argv[5], "seededAt": sys.argv[6]}))' \
      "$NAME" "$URL" "$PLUMBER_ID" "$BUSINESS_NAME" "$DEMO_URL" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
      >> "$MANIFEST_FILE"
  else
    ERROR=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('error','unknown'))" 2>/dev/null || echo "parse-failed")
    echo "FAILED ($ERROR)"
    FAILED=$((FAILED + 1))
  fi

  sleep "$DELAY_SECONDS"
done <<< "$PROSPECTS"

echo ""
echo "=================================================================="
echo "  SEEDING COMPLETE"
echo "=================================================================="
echo "  New scrapes:     $SUCCESS"
echo "  Already cached:  $CACHED"
echo "  Failed:          $FAILED"
echo "  Manifest:        $MANIFEST_FILE"
echo ""
echo "  Next: Paul reads the manifest to pair demoUrls with outreach copy."
echo "=================================================================="
