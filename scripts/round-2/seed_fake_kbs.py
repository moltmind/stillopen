#!/usr/bin/env python3
"""Seed the KV store with rich KB entries for each of the 6 fake sample demos.

For each fake shop in fake-shops.json, build a KB JSON payload matching
the worker's KB_SCHEMA (see worker.js line 2268) and buildKbContext()
renderer (worker.js line 492). Write each as kb:{plumber_id} to the
STILLOPEN_KV namespace via the wrangler CLI.

No Firecrawl spend — these are fictional businesses, so we hand-author
the KB content.

Usage:
    python3 seed_fake_kbs.py fake-shops.json

Result:
    - /tmp/fake-kb-{slug}.json files (one per shop, for inspection + reuse)
    - Each kb:{plumber_id} written to KV with no TTL
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

NAMESPACE_ID = "a8d032d8d52143e0848bc5fc14129c6a"
DEFAULT_HOURS = {
    "Monday": "7 AM - 5 PM",
    "Tuesday": "7 AM - 5 PM",
    "Wednesday": "7 AM - 5 PM",
    "Thursday": "7 AM - 5 PM",
    "Friday": "7 AM - 5 PM",
    "Saturday": "By appointment",
    "Sunday": "Emergency only",
}

# Shop-specific FAQ, pricing, and credential extras. Keyed by slug.
# Keep these grounded in the chat_exchange scenarios from fake-shops.json
# so the chat behaves consistently with the transcript on the page.
SHOP_EXTRAS = {
    "hollow-creek-plumbing": {
        "email": "dispatch@hollowcreekplumbing.demo",
        "pricing_notes": "After-hours dispatch $180 plus parts. Free quotes on every job. Same-day service when the schedule allows.",
        "certifications_licenses": ["Licensed plumber, Iowa", "Insured and bonded", "A-Plus BBB rating"],
        "faqs": [
            {"question": "Do you take emergency calls at night?", "answer": "Yes, twenty-four hours. After-hours dispatch is $180 plus parts."},
            {"question": "How fast can Wes get here?", "answer": "Forty-five minutes is the typical after-hours window. Business hours can be faster."},
            {"question": "Do you do sewer line work?", "answer": "Yes. Camera inspection first, then trenchless when possible, old-school excavation when not."},
            {"question": "What areas do you cover?", "answer": "Hollow Creek, Polk County, Dallas County, and the surrounding towns."},
            {"question": "Are you licensed?", "answer": "Yes. Licensed plumber in Iowa, insured and bonded."},
        ],
    },
    "third-avenue-heat-drain": {
        "email": "dispatch@thirdavenueheatdrain.demo",
        "pricing_notes": "After-hours service fee additional. Free quotes. No subcontracted work.",
        "certifications_licenses": ["Licensed HVAC contractor, Minnesota", "Licensed plumber, Minnesota", "Insured"],
        "faqs": [
            {"question": "Do you handle tankless water heaters?", "answer": "Yes. Tank and tankless, most brands."},
            {"question": "When can Marcus get here?", "answer": "Same day usually. Nine AM next morning at the latest."},
            {"question": "Do you work weekends?", "answer": "Saturday by appointment. Sunday emergency only."},
            {"question": "What is the service area?", "answer": "Bridgepoint, the metro, and the northwest suburbs."},
            {"question": "Do you subcontract?", "answer": "No. Every job is run by our own crew."},
        ],
    },
    "knotwood-brothers-plumbing": {
        "email": "dispatch@knotwoodbrothers.demo",
        "pricing_notes": "$75 diagnostic fee, waived if we do the repair. Free quotes on remodels and installs.",
        "certifications_licenses": ["Licensed master plumber, Ohio", "Insured and bonded", "Family-owned since 2004"],
        "faqs": [
            {"question": "Do both brothers come out?", "answer": "Usually just Eli or Dean, depending on the job. Sometimes both on a bigger project."},
            {"question": "Is there a diagnostic fee?", "answer": "Seventy-five dollars. Waived if we do the repair."},
            {"question": "Do you do bathroom remodels?", "answer": "Yes, plumbing for kitchen and bath remodels. Rough-in through final fixtures."},
            {"question": "How long to get someone out?", "answer": "Inside the hour for an emergency. Same day or next day otherwise."},
            {"question": "What counties do you cover?", "answer": "Knotwood, Hocking County, Athens County, and the surrounding counties."},
        ],
    },
    "anvil-creek-hvac": {
        "email": "dispatch@anvilcreekhvac.demo",
        "pricing_notes": "$150 service call fee. Free estimates on replacements. Priority bumps for elderly or young-kid households at no extra charge.",
        "certifications_licenses": ["Licensed HVAC contractor, Michigan", "EPA 608 certified", "Insured and bonded"],
        "faqs": [
            {"question": "What is the service call fee?", "answer": "$150. Goes toward the repair if we do the work."},
            {"question": "Do you bump priority for elderly customers?", "answer": "Yes. Elderly or young kids in the house, we bump the priority at no extra charge."},
            {"question": "How fast can Rhonda get here?", "answer": "Inside two hours on an emergency. Same day otherwise."},
            {"question": "Do you handle gas line work?", "answer": "Yes. Installation, repair, and leak detection, all licensed and inspected."},
            {"question": "What brands do you service?", "answer": "Most major brands. Carrier, Trane, Lennox, Rheem, Goodman, Bryant, and others."},
        ],
    },
    "northbridge-plumbing-co": {
        "email": "dispatch@northbridgeplumbing.demo",
        "pricing_notes": "Emergency dispatch $220 plus parts. Free quotes on installs and remodels.",
        "certifications_licenses": ["Licensed master plumber, Illinois", "Insured and bonded", "Member, Plumbing-Heating-Cooling Contractors Association"],
        "faqs": [
            {"question": "Do you do commercial work?", "answer": "Yes. Residential and commercial both, code compliant from day one."},
            {"question": "What is the emergency fee?", "answer": "$220 dispatch plus parts. We text you an ETA when Troy leaves."},
            {"question": "Do you replace sump pumps?", "answer": "Yes. Emergency replacements during storms, scheduled replacements otherwise."},
            {"question": "What is the service area?", "answer": "Northbridge, Lake County, McHenry County, and the Chicago northwest suburbs."},
            {"question": "Is the work subcontracted?", "answer": "No. Eighteen years, zero subcontracted jobs."},
        ],
    },
    "old-mill-road-heating-air": {
        "email": "dispatch@oldmillroad.demo",
        "pricing_notes": "$125 diagnostic, waived on the repair. Free quotes on furnace and AC replacements.",
        "certifications_licenses": ["Licensed HVAC contractor, Indiana", "Licensed plumber, Indiana", "NATE certified technicians"],
        "faqs": [
            {"question": "Do you do well pumps?", "answer": "Yes. Repair, replacement, and maintenance."},
            {"question": "How long to get Dale here?", "answer": "Inside the hour on an emergency. Same day otherwise."},
            {"question": "Do you do furnace replacements?", "answer": "Yes. Free quote, financing available on most installs."},
            {"question": "What is the diagnostic fee?", "answer": "$125. Waived if we do the repair."},
            {"question": "What areas do you cover?", "answer": "Millfield, Hamilton County, Boone County, and the surrounding farms and towns."},
        ],
    },
}


def build_kb(shop):
    extras = SHOP_EXTRAS.get(shop["slug"], {})
    kb = {
        "business_name": shop["name"],
        "owner_name": shop["owner_note"].replace("Owned by ", "").replace("Owned and operated by ", "").replace(", brothers and owners", ""),
        "phone": shop["phone"],
        "email": extras.get("email"),
        "service_area": shop["service_area"],
        "hours": DEFAULT_HOURS,
        "services": shop["services"],
        "pricing_notes": extras.get("pricing_notes"),
        "faqs": extras.get("faqs", []),
        "emergency_availability": True,
        "years_in_business": shop["years"],
        "certifications_licenses": extras.get("certifications_licenses", ["Licensed and insured"]),
        "sourceUrl": f"https://stillopen.ai/demo/{shop['slug']}/",
        "scrapedAt": datetime.utcnow().isoformat() + "Z",
        "scrapedBy": "fake-seed-script",
        "sample": True,
    }
    return kb


def put_kv(key, payload_path, remote=True):
    """Call wrangler kv key put for a single key."""
    cmd = [
        "wrangler", "kv", "key", "put",
        "--namespace-id", NAMESPACE_ID,
        key,
        "--path", str(payload_path),
    ]
    if remote:
        cmd.append("--remote")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAILED {key}: {result.stderr.strip()}")
        return False
    print(f"  ok {key}")
    return True


def main():
    if len(sys.argv) != 2:
        print("Usage: seed_fake_kbs.py <fake-shops.json>")
        sys.exit(1)
    shops = json.loads(Path(sys.argv[1]).read_text())
    ok_count = 0
    for shop in shops:
        kb = build_kb(shop)
        payload_path = Path(f"/tmp/fake-kb-{shop['slug']}.json")
        payload_path.write_text(json.dumps(kb, indent=2))
        print(f"\n{shop['name']} ({shop['plumber_id']}):")
        print(f"  payload: {payload_path}")
        if put_kv(f"kb:{shop['plumber_id']}", payload_path):
            ok_count += 1
    print(f"\n{ok_count}/{len(shops)} KB entries written.")


if __name__ == "__main__":
    main()
