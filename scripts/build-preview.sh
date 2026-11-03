#!/bin/bash
# Builds dist/ (tracked site files only, no prospect clones, no videos, no functions)
# and deploys it to the free Cloudflare Pages preview project stillopen-preview.
# Usage: bash scripts/build-preview.sh [--no-deploy]
set -euo pipefail
cd "$(dirname "$0")/.."
REPO="$(pwd)"
rm -rf dist && mkdir dist
KEEP="404.html app app-icon.png assets chatbot.js checkout-error.html cole-founder-portrait.jpg data-deletion.html demo demo-tour.js embed-guide founders index.html index-v1.html index-v2-night.html partners privacy.html pro-install-confirmed retired.html robots.txt sitemap.xml terms.html trades-audit vs wake stillopen-demo-poster.jpg"
for d in for-*; do KEEP="$KEEP $d"; done
# Only files git tracks (or new files on this branch), so nothing gitignored can leak.
for p in $KEEP; do
  git ls-files --cached --others --exclude-standard -- "$p" | while read -r f; do
    mkdir -p "dist/$(dirname "$f")"; cp "$f" "dist/$f"
  done
done
# Keep search engines off the preview copy.
printf '/*\n  X-Robots-Tag: noindex\n' > dist/_headers
echo "dist: $(find dist -type f | wc -l | tr -d ' ') files, $(du -sh dist | cut -f1)"
[ "${1:-}" = "--no-deploy" ] && exit 0
# Run from an empty dir so wrangler never picks up a functions/ or wrangler.toml from the repo.
TMPD="$(mktemp -d)"; cd "$TMPD"
wrangler pages deploy "$REPO/dist" --project-name stillopen-preview --branch remodel --commit-dirty=true
