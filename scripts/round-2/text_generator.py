#!/usr/bin/env python3
"""Generate CUSTOM-frame personalized text messages for 20 new plumbers.

Input: shops.json (same format as demo_generator.py)
Output: text-outreach-CUSTOM-batch-plumbers-round-2-YYYY-MM-DD.md

Voice rules (hard-locked from Cole's CLAUDE.md):
  - First-person Cole ("Cole here from Wisconsin")
  - No em-dashes
  - No pump-dump or coach-speak
  - Customer-angle frame (homeowner who noticed, not vendor)
  - URL without trailing slash (301 redirects clean)
  - No pricing in the text (handled in replies)

Each text follows the proven pattern:
  Opener: "Hey [first_word], Cole here from Wisconsin. [customer-angle hook based on shop data]."
  Acknowledgment: "[years] years [specialty/notable detail] that earns a click."
  UX observation: "I make websites for a living and noticed [specific UX gap]."
  Gift: "Built a version of what could fix that for your shop: stillopen.ai/demo/[slug]"
  Close: "[soft close, no pressure]"
"""

import json
import random
import re
from datetime import date
from pathlib import Path

# ─── TEXT TEMPLATES ───────────────────────────────────────────────────────
# Multiple openers to rotate across 20 shops so they feel varied.

OPENERS = [
    "Tried to find a plumber last week for a leak and landed on your site.",
    "Was looking up local plumbers and ended up on your site.",
    "Had a drain issue and was searching for a plumber when I landed on your site.",
    "Was comparing plumbers in your area and landed on your site.",
    "Needed a plumber for a weekend job and ended up on your site.",
    "Was hunting for a plumber before the holiday rush and landed on your site.",
    "Had a frozen pipe question and was looking up plumbers when I found your site.",
    "Was looking for a plumber who does remodels and landed on your site.",
]

UX_OBSERVATIONS = [
    "I make websites for a living and noticed there was no quick way to type a question to you outside office hours.",
    "I make websites and couldn't tell from the page what to do for an after-hours emergency.",
    "I make websites for a living and noticed I had no way to ask a question without calling first.",
    "I make websites and noticed there was no easy way to reach you outside Monday through Friday hours.",
    "I make websites for a living and noticed no way to type a quick question and get an answer.",
    "I make websites and noticed the only way to reach you was a daytime phone call.",
    "I make websites for a living and noticed I couldn't see any way to reach you outside business hours.",
]

SOFT_CLOSES = [
    "No pressure, just figured you'd want eyes on it.",
    "No pitch, just figured you'd want to see it.",
    "No pressure.",
    "No pitch, just thought you'd want to see it from a customer's angle.",
    "No pressure, just figured a fellow tradesman would want a look.",
    "No pressure, just thought it might land right.",
    "Not a pitch, just wanted to show you.",
    "No pitch.",
]


def first_word(name):
    return re.split(r"[\s,&]+", name.strip())[0] or name


def build_acknowledgment(shop):
    """Build the '[years] years of X, that earns a click' sentence from shop data."""
    years = shop["years"]
    hook = shop["hook"]
    # Extract the shop's credentials/story from the hook for the "earns a click" line
    # Keep lowercase for casual voice (matches existing HVAC style)
    hook_casual = hook.lower().rstrip(".")
    return f"{years} years and {hook_casual}, that earns a click."


def build_text(shop, opener, ux, close):
    """Assemble the full CUSTOM-frame text."""
    name_first = first_word(shop["name"])
    ack = build_acknowledgment(shop)
    text = (
        f"Hey {name_first} team, Cole here from Wisconsin. "
        f"{opener} "
        f"{ack} "
        f"{ux} "
        f"Built a version of what could fix that for your shop: "
        f"stillopen.ai/demo/{shop['slug']}. "
        f"{close}"
    )
    return text


def generate_texts(shops, seed=42):
    """Generate a CUSTOM-frame text for each shop with rotated openers/closes."""
    rnd = random.Random(seed)
    out = []
    for i, shop in enumerate(shops):
        opener = OPENERS[i % len(OPENERS)]
        ux = UX_OBSERVATIONS[i % len(UX_OBSERVATIONS)]
        close = SOFT_CLOSES[i % len(SOFT_CLOSES)]
        text = build_text(shop, opener, ux, close)
        out.append({
            "num": i + 1,
            "shop": shop,
            "text": text,
            "char_count": len(text),
        })
    return out


def render_markdown(results, batch_date, output_path):
    """Render a full markdown file matching the existing batch structure."""
    lines = []
    lines.append("# Plumbing Outreach Batch, Round 2, Custom Per Shop")
    lines.append(f"**Authored by Paul V6, {batch_date}. For Cole. Send from your phone in spaced batches over 2-3 days.**")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## What this is")
    lines.append("")
    lines.append("Round 2 of the custom-per-shop plumber outreach, nationwide. Same customer-not-vendor frame as batch 1. Each text references real shop data (years, location, founder's name, specialty). Each demo URL is live at stillopen.ai/demo/{slug}.")
    lines.append("")
    lines.append("**Geographic focus:** nationwide US, diverse states. Plumbers specifically (pure plumbing or plumbing+HVAC+electrical combos, no HVAC-only).")
    lines.append("")
    lines.append("**All shops screened:**")
    lines.append("- Real independent businesses (no national franchises)")
    lines.append("- Active website with published phone")
    lines.append("- No existing chatbot on their current site")
    lines.append("- Phone number with medium-to-high mobile likelihood")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Send schedule")
    lines.append("")
    lines.append("**Suggested pacing:** 10 texts per day across 2 days, 3-5 min between sends. Adjust based on reply volume.")
    lines.append("")
    lines.append("| Day           | Batch   | Shops (5 each)                                                  |")
    lines.append("|---------------|---------|-----------------------------------------------------------------|")
    shops_list = [r['shop']['name'].split(',')[0].split('&')[0].strip()[:14] for r in results]
    for batch_i, time_slot in enumerate(["9:00 AM", "10:00 AM", "4:00 PM", "4:45 PM"]):
        if batch_i * 5 >= len(shops_list):
            break
        shops_group = shops_list[batch_i * 5:(batch_i + 1) * 5]
        day = "Day 1" if batch_i < 2 else "Day 2"
        time_col = f"{day} {time_slot}"
        lines.append(f"| {time_col:<13} | Batch {batch_i + 1} | {', '.join(shops_group):<63} |")
    lines.append("")
    lines.append("Space 3 to 5 minutes between sends within a batch. **If a reply lands, pause the batch and engage live.**")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(f"# THE {len(results)} CUSTOM TEXTS")
    lines.append("")
    lines.append("Copy the text under each shop and send as one message. The URL auto-links in Messages.")
    lines.append("")
    lines.append("---")
    lines.append("")
    for r in results:
        shop = r['shop']
        lines.append(f"## {r['num']}. {shop['name']}  ·  {shop['city']}, {shop['state']}  ·  {shop['years']}+ years")
        lines.append(f"**Phone:** {shop['phone']}")
        lines.append(f"**URL:** {shop['url']}")
        lines.append(f"**Demo:** https://stillopen.ai/demo/{shop['slug']}")
        lines.append(f"**Detail:** {shop['hook']}")
        lines.append(f"**Cell likelihood:** {shop.get('cell_likelihood', 'UNKNOWN')}")
        lines.append("")
        lines.append("**Text:**")
        # Break into two paragraphs for readability (but no > blockquote markers, so Cole can copy clean)
        lines.append(f"> {r['text']}")
        lines.append(f"> ({r['char_count']} chars)")
        lines.append("")
        lines.append("---")
        lines.append("")
    lines.append("")
    lines.append("# Reply playbook (same as round 1 plumber batch)")
    lines.append("")
    lines.append("See `text-outreach-CUSTOM-batch-1-2026-04-20.md` for the full reply templates. Same customer-not-vendor frame applies.")
    lines.append("")
    lines.append("**New pattern observed in round 1 (add to playbook):**")
    lines.append("")
    lines.append("**\"They try to book you as a real customer\"** (this happened 2026-04-20 with Rosie at AZ Perfect Comfort, who asked Cole what cooling service he needed).")
    lines.append("")
    lines.append("Response template:")
    lines.append("")
    lines.append("> Hey [Rosie], honest clarification: I'm in Wisconsin, not [their city]. I was looking at your site from the angle of an after-hours customer, which is how the demo got built: stillopen.ai/demo/[slug].")
    lines.append(">")
    lines.append("> The [their triage question] you just asked me is exactly what the chat widget on the demo handles 24/7 on your real site. Any homeowner at 11 PM gets that same routing question, types back the answer, and your team sees the lead with the issue already sorted. That is the whole gift.")
    lines.append(">")
    lines.append("> No pressure. Take a look when you have a beat, tell me what you think.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(f". Paul V6 (Opus 4.7, 1M context), {batch_date}, Round 2 custom plumber batch.")
    lines.append("")
    Path(output_path).write_text("\n".join(lines))
    return output_path


if __name__ == "__main__":
    import sys
    if len(sys.argv) not in (2, 3):
        print("Usage: text_generator.py <shops.json> [output.md]")
        sys.exit(1)
    shops = json.loads(Path(sys.argv[1]).read_text())
    results = generate_texts(shops)
    today = date.today().isoformat()
    out = sys.argv[2] if len(sys.argv) == 3 else (
        f"/Users/faith/Desktop/StillOpen.ai/Synchronize/Team/Paul/"
        f"text-outreach-CUSTOM-batch-plumbers-round-2-{today}.md"
    )
    render_markdown(results, today, out)
    print(f"Wrote: {out}")
    print(f"Texts generated: {len(results)}")
    chars = [r['char_count'] for r in results]
    print(f"Avg length: {sum(chars) // len(chars)} chars, min {min(chars)}, max {max(chars)}")
