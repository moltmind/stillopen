#!/usr/bin/env python3
"""Round-2 plumber outreach text generator, VERSION 2.

Honest builder identity (no "from Wisconsin"), three variants A/B/C,
stratified 7/7/6 assignment across 20 shops for real A/B test data.

Each shop has three hand-crafted hook fragments (hook_a_clause,
hook_b_subject, hook_c_subject) so every variant reads specifically
about THAT shop, not templated.

Design: see 2026-04-20_round-2-reframe-brainstorm.md in Team/Paul/.
"""

import json
import random
import re
from datetime import date
from pathlib import Path

# ─── HAND-CRAFTED HOOKS PER SHOP ─────────────────────────────────────────
# hook_a_clause: the "you X" clause that goes after "yours caught my eye because..."
# hook_b_subject: the noun phrase that goes before "stood out when I was looking at plumbing sites"
# hook_c_subject: the noun phrase that goes before "told me you already see where this is going"

HOOKS = {
    "erspamer-plumbing": {
        "a": "you put a call-or-text invite right on your homepage in 2001 when most shops still have not caught up",
        "b": "Your call-or-text invite on the homepage",
        "c": "Your call-or-text invite from day one",
    },
    "joe-lay-sons": {
        "a": "you run a 55-year family shop and still put a text line right on the site, most shops pick one or the other",
        "b": "The text-in line your shop runs alongside 55 years of plumbing",
        "c": "The fact that a 55-year shop still runs a live text line",
    },
    "royalty-plumbing": {
        "a": "you tell homeowners to text you photos for an estimate right on the page, which is exactly where this is going",
        "b": "Your 'text photos for estimate' invite",
        "c": "Your 'text photos for estimate' line",
    },
    "saia-plumbing": {
        "a": "you put 'text or call us' in the footer of a 35-year NOLA shop, that is the kind of long-run that integrates the new without losing the old",
        "b": "The 'text or call us' footer on your 35-year NOLA shop",
        "c": "Your 'text or call us' footer after 35 years in NOLA",
    },
    "patriot-plumbing": {
        "a": "you and Spencer answer every call yourselves, a two-man crew reads a text like this instead of routing it to a receptionist",
        "b": "A father-and-son two-man Northern Virginia shop",
        "c": "A two-man crew where the owner actually answers",
    },
    "royal-flush-plumb": {
        "a": "you and Meghan run a veteran-owned shop where both of you show up to jobs, which means whoever reads this is the whole marketing department",
        "b": "A veteran-owned Tacoma shop where both owners show up to jobs",
        "c": "A veteran husband-and-wife running the whole shop",
    },
    "proficient-plumbing": {
        "a": "your 'shoe covers on, mats down' line tells me you already think about what the customer sees, which is exactly what this is built for",
        "b": "Your 'shoe covers on, mats down' service approach",
        "c": "The 'shoe covers on, mats down' line on your site",
    },
    "miller-sons-ocala": {
        "a": "you are fourth-generation plumbing and you install livestock waterers for rural Ocala, that is a niche your bigger competitors cannot match",
        "b": "A fourth-generation veteran-owned rural Ocala shop",
        "c": "Your four-generation lineage plus the rural-Ocala livestock niche",
    },
    "saint-joseph-plumbing": {
        "a": "you are sitting at 5.0 stars with 201 reviews, which means your customers love you but the path from their search to your chat does not exist yet",
        "b": "Your 5.0 rating across 201+ reviews",
        "c": "5.0 stars across 201 reviews with no chat to capture the next one",
    },
    "pro-veterans-plumbing": {
        "a": "you and Melissa run a veteran-owned shop that actively trains transitioning veterans, so you already know what a real-time front desk is worth",
        "b": "Your veteran-owned shop that trains transitioning veterans",
        "c": "A veteran-owned shop where the owner trains the next crew",
    },
    "maffet-plumbers": {
        "a": "you charge by the job not the hour, which is an owner who has already decided to remove friction for the customer",
        "b": "Your 'charge by the job, not the hour' pricing",
        "c": "The 'charge by the job' pricing you already run",
    },
    "real-mccoy-plumbing": {
        "a": "the owner's actual last name is McCoy so 'Real McCoy Plumbing' is not a marketing line, it is an autobiography",
        "b": "A plumbing shop where the owner's name is literally McCoy",
        "c": "The shop where 'Real McCoy' is the owner's real last name",
    },
    "rjc-plumbing-me": {
        "a": "you and Tim answer every call yourselves, which is the whole pitch and the whole reason I built this",
        "b": "The Riley-and-Tim 'a real person answers' shop",
        "c": "The two-man Maine shop where Riley and Tim answer every call",
    },
    "austin-plumbery": {
        "a": "you are positioning as the new-generation Austin plumber, which means you already get that 24/7 chat is the table stakes",
        "b": "Your new-generation Austin plumber positioning",
        "c": "The 'new generation of Austin homeowners' framing you already run",
    },
    "alphalete-plumbing": {
        "a": "you run a plumbing shop AND a trade school to train the next generation, that is a builder not a contractor",
        "b": "Diego's plumbing shop plus the trade school he founded",
        "c": "A plumber who also founded a trade school to train the next one",
    },
    "montana-plumbing-co": {
        "a": "you specialize in trenchless pipe repair and radiant floors, high-skill niche work most shops will not touch",
        "b": "Your trenchless plus radiant-floor specialty in Missoula",
        "c": "The trenchless pipe and radiant floor niche you run",
    },
    "crawfords-plumbing-nc": {
        "a": "your dad Eddie started this in 1979 and now Mike, Chad, and Buddy run it, that is a story you can feel from the site",
        "b": "A second-generation NC shop run by three Crawford brothers",
        "c": "Three Crawford brothers running their dad's shop since 1979",
    },
    "tom-kris-sons": {
        "a": "you and your brother named the company after your parents Tom and Kristy, that is a trust signal nobody can fake",
        "b": "The Cobb County shop named after the founders' parents",
        "c": "A shop the sons literally named after their parents",
    },
    "camps-plumbing": {
        "a": "you and Cyndi started the shop five months after you got married in 2005, that is a risk profile most people will not take",
        "b": "The husband-and-wife Gorge shop started five months after the wedding",
        "c": "The Camp family shop since 2005",
    },
    "mountain-high-plumbing": {
        "a": "Jim Sr., Alana, and Jimmy run the whole shop as a family of three, which means the person reading this IS the marketing department",
        "b": "The father-mother-son Flagstaff shop",
        "c": "The three-person Velez family shop in Flagstaff",
    },
}


def first_word(name):
    return re.split(r"[\s,&]+", name.strip())[0] or name


def render_variant_a(shop):
    """Specificity-first: observation opens, builder identity bridges, gift closes."""
    fw = first_word(shop["name"])
    slug = shop["slug"]
    hook = HOOKS[slug]["a"]
    return (
        f"Hey {fw} team, Cole here. I build AI front desks for plumbing shops, "
        f"and yours caught my eye because {hook}. "
        f"Built a working demo for your shop: stillopen.ai/demo/{slug}. "
        f"Has your real name, hours, and services baked in. "
        f"Yours either way, no strings."
    )


def render_variant_b(shop):
    """Unity-first: tribe signal (steel erector turned AI-chat builder) opens."""
    fw = first_word(shop["name"])
    slug = shop["slug"]
    hook = HOOKS[slug]["b"]
    return (
        f"Hey {fw} team, Cole here. Steel erector turned AI-chat builder, "
        f"working on tools for shops like yours. "
        f"{hook} stood out when I was looking at plumbing sites, "
        f"so I built you a working demo: stillopen.ai/demo/{slug}. "
        f"Your real name, hours, and services baked in. "
        f"Yours free, no strings."
    )


def render_variant_c(shop):
    """Builder-gift clean: gift is headline, specificity justifies, tiny ask."""
    fw = first_word(shop["name"])
    slug = shop["slug"]
    hook = HOOKS[slug]["c"]
    return (
        f"Hey {fw} team, Cole here. I build AI front desks for plumbing shops "
        f"and made a working demo for your shop: stillopen.ai/demo/{slug}. "
        f"Has your real name, hours, and services baked in. "
        f"{hook} told me you already see where this is going. "
        f"Take a look if you want. Yours either way."
    )


VARIANTS = {
    "A": ("Specificity-first", render_variant_a),
    "B": ("Unity-first", render_variant_b),
    "C": ("Builder-gift clean", render_variant_c),
}


def stratified_assign(shops, seed=42):
    """Return a list of (shop, variant) pairs with 7/7/6 split, stratified by cell-likelihood.

    Within each cell-likelihood tier, shops get round-robin A/B/C to ensure
    each variant gets a mix of HIGH and MEDIUM cell-likelihood shops.
    """
    rnd = random.Random(seed)
    high = [s for s in shops if s.get("cell_likelihood") == "HIGH"]
    med = [s for s in shops if s.get("cell_likelihood") == "MEDIUM"]
    rnd.shuffle(high)
    rnd.shuffle(med)

    # Assign variant letter in round-robin within each tier
    letters = ["A", "B", "C"]
    assignments = []
    i = 0
    for shop in high + med:
        assignments.append((shop, letters[i % 3]))
        i += 1
    # Check distribution
    from collections import Counter
    counts = Counter(v for _, v in assignments)
    # If we have 20 shops, round-robin gives 7/7/6 naturally (20 % 3 = 2 remainder)
    return assignments, counts


def render_batch(shops, batch_date):
    assignments, counts = stratified_assign(shops)
    lines = []
    lines.append("# Plumbing Outreach, Round 2 v2, A/B/C Honest-Builder Reframe")
    lines.append(f"**Authored by Paul V6, {batch_date}. Send from your phone in spaced batches.**")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## What changed from v1")
    lines.append("")
    lines.append("v1 used \"Cole here from Wisconsin\" for nationwide shops, which breaks credibility the moment an out-of-state owner reads it. v2 drops the Wisconsin geography, replaces the customer-angle frame with an **honest builder identity** (\"I build AI front desks for plumbing shops\"), and splits the 20 shops across three psychological variants for real A/B/C reply-rate data.")
    lines.append("")
    lines.append("## Psychological framework (PLFS-ranked, top 5)")
    lines.append("")
    lines.append("1. **Reciprocity** (PLFS 15), working demo as the gift, no strings.")
    lines.append("2. **Specificity (Ogilvy)** (PLFS 15), shop-specific hook defeats template pattern-match.")
    lines.append("3. **Liking** (PLFS 15), warmth plus named custom details.")
    lines.append("4. **Unity** (PLFS 15), Cole's steel-erector-turned-builder identity signals tribe.")
    lines.append("5. **Commitment ladder** (PLFS 13), tiny first yes (\"just look\") opens the funnel.")
    lines.append("")
    lines.append("**Held for reply playbook, not first-touch:** Scarcity (Founders $47), Authority (41 shops built), Social proof, Loss aversion. All score PLFS 9-12 on first touch and read pushy.")
    lines.append("")
    lines.append("## A/B/C assignment")
    lines.append("")
    lines.append(f"- **Variant A (Specificity-first):** {counts.get('A', 0)} shops, leads with observation about the shop")
    lines.append(f"- **Variant B (Unity-first):** {counts.get('B', 0)} shops, leads with Cole's steel-erector-turned-AI-builder identity")
    lines.append(f"- **Variant C (Builder-gift clean):** {counts.get('C', 0)} shops, leads with gift, tiny ask")
    lines.append("")
    lines.append("Stratified by cell-likelihood so each variant gets a mix of HIGH and MEDIUM shops.")
    lines.append("")
    lines.append("## Send schedule")
    lines.append("")
    lines.append("10 per day across 2 days, 3 to 5 min between sends. If a reply lands, pause and engage live.")
    lines.append("")
    lines.append("## How to track replies")
    lines.append("")
    lines.append("Each shop below has its variant letter noted. When a reply lands, note the variant letter next to the shop name in this file. After the batch, we count replies per variant for directional A/B/C data.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(f"# THE 20 TEXTS, VARIANT-TAGGED")
    lines.append("")
    lines.append("---")
    lines.append("")

    for i, (shop, variant) in enumerate(assignments, 1):
        variant_name, renderer = VARIANTS[variant]
        text = renderer(shop)
        char_count = len(text)
        lines.append(f"## {i}. [{variant}] {shop['name']}  ·  {shop['city']}, {shop['state']}  ·  {shop['years']}+ years")
        lines.append(f"**Phone:** {shop['phone']}")
        lines.append(f"**Demo:** https://stillopen.ai/demo/{shop['slug']}")
        lines.append(f"**Variant:** {variant}, {variant_name}")
        lines.append(f"**Cell likelihood:** {shop.get('cell_likelihood', 'UNKNOWN')}")
        lines.append("")
        lines.append("**Text:**")
        lines.append(f"> {text}")
        lines.append(f"> ({char_count} chars)")
        lines.append("")
        lines.append("---")
        lines.append("")

    lines.append("")
    lines.append("# Reply playbook")
    lines.append("")
    lines.append("Same posture as round 1. See `text-outreach-CUSTOM-batch-1-2026-04-20.md` for the full reply templates. The new \"they try to book you as a customer\" pattern from AZ Perfect Comfort also applies, clarify geography up front, flip their triage question into proof of the widget.")
    lines.append("")
    lines.append("**With the honest-builder reframe, two likely new reply patterns:**")
    lines.append("")
    lines.append("**\"Why us specifically?\"** (owner curious about the selection)")
    lines.append("> Honest answer: I was going through plumber sites looking for the ones where the owner already thinks about the customer experience. Yours did (the [specific hook from their text]). Built a demo for shops that already think that way, because you are the ones who would actually use it well.")
    lines.append("")
    lines.append("**\"What is the catch?\"** (skepticism)")
    lines.append("> No catch. $47/mo flat when you are ready, no contract, cancel any time. I built it because I kept hitting the same wall trying to find tradesmen myself. If it helps your shop, great. If not, the demo is still yours, no strings.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(f". Paul V6 (Opus 4.7, 1M context), {batch_date}, round 2 v2 reframe after Cole's honesty-over-theater guidance.")
    lines.append("")

    return "\n".join(lines), assignments, counts


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: text_generator_v2.py <shops.json>")
        sys.exit(1)
    shops = json.loads(Path(sys.argv[1]).read_text())
    today = date.today().isoformat()
    out_path = Path(
        f"/Users/faith/Desktop/StillOpen.ai/Synchronize/Team/Paul/"
        f"text-outreach-CUSTOM-batch-plumbers-round-2-v2-{today}.md"
    )
    md, assignments, counts = render_batch(shops, today)
    out_path.write_text(md)
    print(f"Wrote: {out_path}")
    print(f"A: {counts.get('A', 0)}   B: {counts.get('B', 0)}   C: {counts.get('C', 0)}")
    print(f"Total: {sum(counts.values())}")
