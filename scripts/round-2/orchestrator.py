#!/usr/bin/env python3
"""End-to-end orchestrator for round 2 plumber outreach build.

Runs in 3 phases:
  PHASE 1: For each shop, call /admin/seed-demo to scrape their real site
           via Firecrawl and seed the KB at kb:seed-{hash}. Captures the
           returned plumberId.
  PHASE 2: Generate demo HTML pages at stillopen/demo/{slug}/index.html
           using the seeded plumberId.
  PHASE 3: Generate the personalized outreach text file.

COST WARNING: PHASE 1 calls Firecrawl (roughly $0.04-0.05 per shop, total
~$1 for 20 shops). This orchestrator will REFUSE to run without --confirm-spend
on the command line.

Usage:
  # Dry run, no cost:
  python3 orchestrator.py shops.json --dry-run

  # Live run, authorized spend:
  export ADMIN_SECRET=$(cat /Users/faith/Desktop/StillOpen.ai/family/.admin-secret-local | tr -d '[:space:]')
  python3 orchestrator.py shops.json --confirm-spend
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

import urllib.request
import urllib.error

WORKER_URL = "https://app.stillopen.ai"
ADMIN_SECRET_PATH = "/Users/faith/Desktop/StillOpen.ai/stillopen/.admin-secret-local"
DEMO_GENERATOR = "/Users/faith/Desktop/StillOpen.ai/stillopen/scripts/round-2/demo_generator.py"
TEXT_GENERATOR = "/Users/faith/Desktop/StillOpen.ai/stillopen/scripts/round-2/text_generator.py"


def load_admin_secret():
    env_secret = os.environ.get("ADMIN_SECRET", "").strip()
    if env_secret:
        return env_secret
    if Path(ADMIN_SECRET_PATH).exists():
        return Path(ADMIN_SECRET_PATH).read_text().strip()
    raise RuntimeError(f"ADMIN_SECRET not found in env or {ADMIN_SECRET_PATH}")


def seed_one(shop, admin_secret, dry_run=False):
    """Call /admin/seed-demo for a single shop, return seedPlumberId."""
    payload = json.dumps({
        "websiteUrl": shop["url"],
        "prospectName": shop["name"],
    }).encode("utf-8")
    if dry_run:
        return {
            "success": True,
            "plumberId": f"seed-dryrun-{shop['slug']}",
            "businessName": shop["name"],
            "cached": False,
            "dryRun": True,
        }
    req = urllib.request.Request(
        f"{WORKER_URL}/admin/seed-demo",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Admin-Token": admin_secret,
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return {"success": False, "error": f"HTTP {e.code}", "detail": body}
    except Exception as e:
        return {"success": False, "error": str(e)}


def phase1_seed(shops, admin_secret, dry_run, delay):
    """For each shop, seed the KB and attach plumberId to the shop dict."""
    results = []
    for i, shop in enumerate(shops, 1):
        print(f"[{i}/{len(shops)}] seeding {shop['name']}... ", end="", flush=True)
        result = seed_one(shop, admin_secret, dry_run=dry_run)
        if result.get("success"):
            shop["plumber_id"] = result["plumberId"]
            shop["seed_business_name"] = result.get("businessName", shop["name"])
            shop["seed_cached"] = result.get("cached", False)
            status = "cached" if result.get("cached") else ("dryrun" if result.get("dryRun") else "scraped")
            print(f"ok [{result['plumberId']}] ({status})")
        else:
            print(f"FAILED: {result.get('error', 'unknown')} {result.get('detail', '')[:100]}")
            shop["plumber_id"] = None
            shop["seed_error"] = result.get("error")
        results.append(result)
        if not dry_run and i < len(shops):
            time.sleep(delay)
    success_count = sum(1 for r in results if r.get("success") and not r.get("dryRun"))
    cached_count = sum(1 for r in results if r.get("cached"))
    failed = sum(1 for r in results if not r.get("success"))
    print(f"\nSeed phase: {success_count} new scrapes, {cached_count} cached, {failed} failed")
    return results


def phase2_demos(shops, shops_file):
    """Run demo_generator.py with the updated shops list."""
    # Write updated shops.json with plumber_id filled in
    updated_path = str(shops_file) + ".with-ids.json"
    Path(updated_path).write_text(json.dumps(shops, indent=2))
    print(f"\nRunning demo_generator on {updated_path}...")
    result = subprocess.run(
        ["python3", DEMO_GENERATOR, updated_path],
        capture_output=True, text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"STDERR: {result.stderr}", file=sys.stderr)
        return False
    return True


def phase3_texts(shops_file):
    """Run text_generator.py."""
    updated_path = str(shops_file) + ".with-ids.json"
    print("\nRunning text_generator...")
    result = subprocess.run(
        ["python3", TEXT_GENERATOR, updated_path],
        capture_output=True, text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"STDERR: {result.stderr}", file=sys.stderr)
        return False
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("shops_file", help="Path to shops.json")
    ap.add_argument("--dry-run", action="store_true", help="No API calls, no cost")
    ap.add_argument("--confirm-spend", action="store_true", help="Authorize Firecrawl spend (~$1 total for 20 shops)")
    ap.add_argument("--delay", type=float, default=2.0, help="Seconds between seed calls")
    ap.add_argument("--skip-phase1", action="store_true", help="Skip seeding, assume plumber_id already set")
    args = ap.parse_args()

    shops = json.loads(Path(args.shops_file).read_text())
    print(f"Loaded {len(shops)} shops from {args.shops_file}")

    if args.dry_run:
        print("DRY RUN MODE - no API calls, no spend")
    elif not args.confirm_spend and not args.skip_phase1:
        estimated_cost = len(shops) * 0.05
        print(f"\nABORT: phase 1 will cost approximately ${estimated_cost:.2f} in Firecrawl fees.")
        print("Re-run with --confirm-spend to authorize, or --dry-run to preview.")
        sys.exit(1)

    admin_secret = None
    if not args.skip_phase1 and not args.dry_run:
        admin_secret = load_admin_secret()
        if len(admin_secret) < 32:
            print(f"ABORT: ADMIN_SECRET looks invalid (length {len(admin_secret)})")
            sys.exit(1)

    if not args.skip_phase1:
        phase1_seed(shops, admin_secret, args.dry_run, args.delay)
    else:
        print("Skipping phase 1 (seed) — assuming plumber_id already present in shops.json")

    # Write back the shops with plumberIds attached
    updated_path = str(args.shops_file) + ".with-ids.json"
    Path(updated_path).write_text(json.dumps(shops, indent=2))
    print(f"Wrote enriched shops list: {updated_path}")

    if args.dry_run:
        print("\nDRY RUN - skipping demo and text generation (re-run with --confirm-spend)")
        return

    ok = phase2_demos(shops, args.shops_file)
    if not ok:
        print("ABORT: demo generation failed")
        sys.exit(1)

    ok = phase3_texts(args.shops_file)
    if not ok:
        print("ABORT: text generation failed")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("PIPELINE COMPLETE")
    print("=" * 60)
    print(f"Demos:    /Users/faith/Desktop/StillOpen.ai/stillopen/demo/")
    print(f"Texts:    /Users/faith/Desktop/StillOpen.ai/Synchronize/Team/Paul/text-outreach-CUSTOM-batch-plumbers-round-2-*.md")
    print(f"Manifest: {updated_path}")
    print("\nNext: Cole reviews, commits to repo, pushes to deploy.")


if __name__ == "__main__":
    main()
