#!/usr/bin/env python3
"""Generate StillOpen SAMPLE demo pages for FICTIONAL businesses.

Distinct from demo_generator.py which was for real-plumber outreach.
This one:
- Sample-deployment disclosure banner at the top.
- No founders_popup injection.
- Hero card shows a sample CHAT transcript (not audio) because the
  StillOpen product is typed chat.
- Live chatbot.js widget embedded so visitors can chat the AI in real
  time on every sample page.
- Clear "fictional business" language throughout.

Input: fake-shops.json with a `chat_exchange` list of turns per shop.
Output: stillopen/demo/{slug}/index.html per fake shop.
"""

import json
import re
from pathlib import Path

REPO_ROOT = Path("/Users/faith/Desktop/StillOpen.ai/stillopen")
DEMO_DIR = REPO_ROOT / "demo"

THEMES = {
    "teal":     {"primary": "#0d7377", "primary_light": "#14919b", "primary_bright": "#7eedf2", "primary_soft": "#cfe8e3", "cream": "#f7f5f0", "border": "#d9d4c7", "lede": "#cfe8e3"},
    "olive":    {"primary": "#4a5b1a", "primary_light": "#5c7222", "primary_bright": "#b8d468", "primary_soft": "#d4dfc4", "cream": "#f7f5f0", "border": "#d9d4c7", "lede": "#d4dfc4"},
    "stone":    {"primary": "#57534e", "primary_light": "#78716c", "primary_bright": "#cda3a8", "primary_soft": "#d6d3d1", "cream": "#f7f5f0", "border": "#d9d4c7", "lede": "#d6d3d1"},
    "navy":     {"primary": "#1e3a5f", "primary_light": "#2c5282", "primary_bright": "#90cdf4", "primary_soft": "#bee3f8", "cream": "#f7f5f0", "border": "#d9d4c7", "lede": "#bee3f8"},
    "forest":   {"primary": "#2f3e2e", "primary_light": "#4a6041", "primary_bright": "#c77d3d", "primary_soft": "#e4a672", "cream": "#f7f5f0", "border": "#d9d4c7", "lede": "#e4a672"},
    "burgundy": {"primary": "#6b1d2e", "primary_light": "#8b2b3d", "primary_bright": "#f4a261", "primary_soft": "#f7d3b1", "cream": "#f9f6f2", "border": "#e4d9ca", "lede": "#f7d3b1"},
}


TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>{name} | Sample StillOpen Deployment | {city}, {state}</title>
<meta name="description" content="Sample StillOpen deployment for a fictional business. Built to show the product. Not an active business.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
:root {{
  --primary: {primary};
  --primary-light: {primary_light};
  --primary-bright: {primary_bright};
  --primary-soft: {primary_soft};
  --cream: {cream};
  --border: {border};
  --lede: {lede};
  --text: #1a1a1a;
  --text-muted: #5a5a5a;
  --bg-alt: #ffffff;
}}
html {{ scroll-behavior: smooth; }}
body {{ font-family: 'Work Sans', -apple-system, sans-serif; background: var(--cream); color: var(--text); line-height: 1.6; -webkit-font-smoothing: antialiased; }}

.sample-banner {{ position: sticky; top: 0; z-index: 9999; background: #0f172a; color: #f7f5f0; padding: 10px 20px; text-align: center; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; border-bottom: 2px solid #f97316; line-height: 1.5; }}
.sample-banner strong {{ color: #fb923c; font-weight: 700; }}
.sample-banner a {{ color: #fb923c; text-decoration: underline; font-weight: 600; margin-left: 10px; }}
@media (max-width: 640px) {{ .sample-banner {{ font-size: 12px; padding: 8px 14px; }} .sample-banner a {{ display: block; margin: 4px auto 0; }} }}

.top-bar {{ background: var(--primary); color: var(--cream); padding: 8px 0; font-size: 14px; }}
.top-bar-inner {{ max-width: 1100px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }}
.top-bar strong {{ color: var(--primary-bright); }}

header {{ background: var(--cream); border-bottom: 2px solid var(--border); position: sticky; top: 38px; z-index: 50; }}
.header-inner {{ max-width: 1100px; margin: 0 auto; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 24px; }}
.logo {{ display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--primary); }}
.logo-mark {{ width: 48px; height: 48px; border-radius: 8px; background: var(--primary); color: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }}
.logo-text {{ font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }}
.logo-text small {{ display: block; font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }}
nav ul {{ list-style: none; display: flex; gap: 28px; align-items: center; }}
nav a {{ color: var(--primary); text-decoration: none; font-weight: 500; font-size: 15px; }}
nav a:hover {{ color: var(--primary-light); }}
.header-phone {{ background: var(--primary); color: var(--cream); padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px; }}
.header-phone:hover {{ background: var(--primary-light); }}
@media (max-width: 720px) {{ nav ul li:not(:last-child) {{ display: none; }} }}

.hero {{ padding: 64px 20px 80px; background: linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.0) 100%), var(--primary); color: var(--cream); }}
.hero-inner {{ max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: center; }}
@media (max-width: 860px) {{ .hero-inner {{ grid-template-columns: 1fr; }} }}
.hero-badge {{ display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); color: var(--primary-bright); padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }}
.hero-badge::before {{ content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--primary-bright); box-shadow: 0 0 8px var(--primary-bright); animation: pulse 2s infinite; }}
@keyframes pulse {{ 0%, 100% {{ opacity: 1; }} 50% {{ opacity: 0.4; }} }}
.hero h1 {{ font-size: clamp(32px, 5.5vw, 52px); font-weight: 800; line-height: 1.05; letter-spacing: -1.5px; margin-bottom: 20px; }}
.hero h1 em {{ font-style: normal; color: var(--primary-bright); }}
.hero p {{ font-size: 18px; color: var(--lede); max-width: 520px; margin-bottom: 32px; }}
.hero-cta {{ display: flex; gap: 12px; flex-wrap: wrap; }}
.btn-primary {{ background: var(--cream); color: var(--primary); padding: 14px 26px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-flex; align-items: center; gap: 8px; }}
.btn-ghost {{ background: transparent; color: var(--cream); padding: 14px 26px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; border: 2px solid rgba(245,241,232,0.3); }}

.chat-card {{ background: var(--cream); color: var(--text); padding: 24px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }}
.chat-card .eyebrow {{ display: inline-block; background: #f97316; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 12px; }}
.chat-card h3 {{ font-size: 18px; font-weight: 800; letter-spacing: -0.4px; margin-bottom: 4px; color: var(--primary); }}
.chat-card .subtitle {{ font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }}
.chat-log {{ display: flex; flex-direction: column; gap: 10px; max-height: 360px; overflow-y: auto; padding: 4px 2px; }}
.chat-row {{ display: flex; }}
.chat-row.customer {{ justify-content: flex-start; }}
.chat-row.ai {{ justify-content: flex-end; }}
.chat-bubble {{ max-width: 82%; padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.45; }}
.chat-row.customer .chat-bubble {{ background: #f1f5f9; color: #1a1a1a; border-bottom-left-radius: 4px; }}
.chat-row.ai .chat-bubble {{ background: var(--primary); color: var(--cream); border-bottom-right-radius: 4px; }}
.chat-row.ai .chat-bubble::before {{ content: "AI"; display: block; font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--primary-bright); margin-bottom: 2px; }}
.chat-footnote {{ margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); }}
.chat-footnote strong {{ color: var(--primary); }}

section {{ padding: 72px 20px; }}
.section-inner {{ max-width: 1100px; margin: 0 auto; }}
.section-eyebrow {{ display: block; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--primary); margin-bottom: 12px; }}
.section-title {{ font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -1px; line-height: 1.1; color: var(--primary); margin-bottom: 16px; max-width: 720px; }}
.section-lede {{ font-size: 18px; color: var(--text-muted); max-width: 640px; margin-bottom: 48px; }}

.services-section {{ background: var(--bg-alt); }}
.services-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }}
.service-card {{ background: var(--cream); padding: 28px; border-radius: 10px; border: 1px solid var(--border); transition: transform 0.15s, border-color 0.15s; }}
.service-card:hover {{ transform: translateY(-2px); border-color: var(--primary); }}
.service-card h3 {{ font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--primary); }}
.service-card p {{ font-size: 14px; color: var(--text-muted); margin-bottom: 12px; }}
.service-card .price {{ font-size: 14px; font-weight: 600; color: var(--primary); }}

.about-section {{ background: var(--primary); color: var(--cream); }}
.about-section .section-title {{ color: var(--cream); }}
.about-section .section-lede {{ color: var(--lede); }}
.about-section .section-eyebrow {{ color: var(--primary-bright); }}
.about-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-top: 40px; }}
.stat {{ padding: 20px 0; border-top: 1px solid rgba(245,241,232,0.15); }}
.stat .num {{ font-size: 42px; font-weight: 800; letter-spacing: -1.5px; color: var(--primary-bright); line-height: 1; }}
.stat .label {{ font-size: 14px; color: var(--lede); margin-top: 8px; font-weight: 500; }}

.area-section {{ background: var(--bg-alt); }}
.area-tags {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px; }}
.area-tag {{ background: var(--cream); border: 1px solid var(--border); padding: 8px 16px; border-radius: 100px; font-size: 14px; font-weight: 500; color: var(--primary); }}

.cta-section {{ background: var(--cream); text-align: center; padding: 72px 20px 96px; }}
.cta-section .section-title {{ margin: 0 auto 16px; }}
.cta-section .section-lede {{ margin: 0 auto 32px; }}
.cta-section .sample-note {{ display: inline-block; background: #fff7ed; color: #9a3412; border: 1px solid #fed7aa; padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500; margin-top: 20px; max-width: 560px; }}

footer {{ background: var(--primary); color: var(--lede); padding: 40px 20px 24px; font-size: 14px; }}
.footer-inner {{ max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }}
@media (max-width: 720px) {{ .footer-inner {{ grid-template-columns: 1fr; }} }}
footer h4 {{ color: var(--cream); font-weight: 700; margin-bottom: 12px; font-size: 15px; }}
footer a {{ color: var(--lede); text-decoration: none; display: block; margin-bottom: 6px; }}
footer a:hover {{ color: var(--cream); }}
.footer-bottom {{ max-width: 1100px; margin: 32px auto 0; padding-top: 20px; border-top: 1px solid rgba(245,241,232,0.15); font-size: 12px; color: var(--lede); text-align: center; opacity: 0.7; }}

@keyframes so-bubble-pulse {{ 0% {{ box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.55), 0 4px 16px rgba(0,0,0,0.25); }} 70% {{ box-shadow: 0 0 0 22px rgba(249, 115, 22, 0), 0 4px 16px rgba(0,0,0,0.25); }} 100% {{ box-shadow: 0 0 0 0 rgba(249, 115, 22, 0), 0 4px 16px rgba(0,0,0,0.25); }} }}
#he-bubble {{ animation: so-bubble-pulse 2.5s ease-out infinite !important; }}
#he-bubble.open {{ animation: none !important; }}
</style>
</head>
<body>

<div class="sample-banner">
  <strong>Sample deployment.</strong> {name} is a fictional business. This page exists to show the StillOpen product. The chat widget in the corner is live.
  <a href="https://stillopen.ai/">See StillOpen &rarr;</a>
</div>

<div class="top-bar">
  <div class="top-bar-inner">
    <div><strong>Serving {city} since {founded}.</strong> Licensed &amp; insured. {years}+ years in the trade.</div>
    <div>{owner_note}</div>
  </div>
</div>

<header>
  <div class="header-inner">
    <a href="#top" class="logo">
      <div class="logo-mark">{initials}</div>
      <div class="logo-text">{name}<small>{city}, {state}</small></div>
    </a>
    <nav>
      <ul>
        <li><a href="#services">Services</a></li>
        <li><a href="#area">Service Area</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="tel:+1{tel_digits}" class="header-phone">Call {phone}</a></li>
      </ul>
    </nav>
  </div>
</header>

<section class="hero" id="top">
  <div class="hero-inner">
    <div>
      <span class="hero-badge">Sample StillOpen deployment</span>
      <h1>{years}+ years of {trade} {city} can count on. <em>Every time.</em></h1>
      <p>{name} has served {city} and the surrounding area since {founded}. {specialty}. Honest work, fair prices, and a front desk that answers the first time.</p>
      <div class="hero-cta">
        <a href="tel:+1{tel_digits}" class="btn-primary">Call {phone}</a>
        <a href="#services" class="btn-ghost">Services</a>
      </div>
    </div>
    <div class="chat-card">
      <span class="eyebrow">Sample chat</span>
      <h3>An after-hours call, handled by text.</h3>
      <p class="subtitle">This is how the AI front desk books a job while the shop is closed.</p>
      <div class="chat-log">
        {chat_bubbles}
      </div>
      <div class="chat-footnote"><strong>Try the live version &rarr;</strong> The chat bubble in the corner is running for this sample. Ask it anything.</div>
    </div>
  </div>
</section>

<section class="services-section" id="services">
  <div class="section-inner">
    <span class="section-eyebrow">What the shop does</span>
    <h2 class="section-title">{trade_title} services built for the real calls.</h2>
    <p class="section-lede">From emergency repairs to scheduled service, {name} is built to handle the work {city} actually calls in.</p>
    <div class="services-grid">{service_cards}</div>
  </div>
</section>

<section class="about-section" id="about">
  <div class="section-inner">
    <span class="section-eyebrow">The shop</span>
    <h2 class="section-title">Locally owned. In the trade since {founded}.</h2>
    <p class="section-lede">{owner_note_long}</p>
    <div class="about-grid">
      <div class="stat"><div class="num">{years}+</div><div class="label">Years in the trade</div></div>
      <div class="stat"><div class="num">{founded}</div><div class="label">Year founded</div></div>
      <div class="stat"><div class="num">Free</div><div class="label">Quotes on every job</div></div>
      <div class="stat"><div class="num">Yes</div><div class="label">Licensed &amp; insured</div></div>
    </div>
  </div>
</section>

<section class="area-section" id="area">
  <div class="section-inner">
    <span class="section-eyebrow">Where the shop works</span>
    <h2 class="section-title">Serving {city} and the surrounding area.</h2>
    <p class="section-lede">Based in {city}, covering the local area and nearby communities.</p>
    <div class="area-tags">{area_tags}</div>
  </div>
</section>

<section class="cta-section" id="contact">
  <div class="section-inner">
    <span class="section-eyebrow">This is what your shop could look like</span>
    <h2 class="section-title">Ready to build the real version for your shop?</h2>
    <p class="section-lede">This is a sample built on fictional data. The real one uses your logo, your services, your hours, your numbers.</p>
    <a href="https://stillopen.ai/" class="btn-primary" style="background: #f97316; color: #fff;">See StillOpen &rarr;</a>
    <div class="sample-note">{name} is a fictional business. Any resemblance to a real shop is coincidental. Built to show the product.</div>
  </div>
</section>

<footer>
  <div class="footer-inner">
    <div>
      <h4>{name} (sample)</h4>
      <p>Fictional business. Built to show the StillOpen product.</p>
      <p style="margin-top: 12px;">The live AI chat widget in the corner is real.</p>
    </div>
    <div>
      <h4>StillOpen</h4>
      <a href="https://stillopen.ai/">stillopen.ai</a>
      <a href="https://stillopen.ai/#pricing">Pricing</a>
    </div>
    <div>
      <h4>Sample city</h4>
      <p>{city}, {state}</p>
    </div>
  </div>
  <div class="footer-bottom">
    &copy; 2026 StillOpen. {name} is a fictional sample business.
  </div>
</footer>

<script src="https://app.stillopen.ai/chatbot.js" data-plumber-id="{plumber_id}"></script>

</body>
</html>
"""


def initials_from_name(name):
    stop = {"and", "of", "the", "plumbing", "heating", "plumbers", "drain", "air", "hvac", "co"}
    words = [w for w in re.split(r"[\s&+,]+", name) if w and w.lower() not in stop]
    if not words:
        words = name.split()
    initials = "".join(w[0] for w in words[:2]).upper()
    return initials or "SO"


def trade_from_services(services):
    joined = " ".join(s.lower() for s in services)
    if "hvac" in joined and "plumbing" in joined:
        return "plumbing and HVAC", "Plumbing and HVAC"
    if "hvac" in joined:
        return "HVAC", "HVAC"
    return "plumbing", "Plumbing"


def render_services_grid(services):
    descriptions = {
        "residential plumbing": "Residential plumbing, repair, install, and maintenance. Treat the house like my own.",
        "commercial plumbing":  "Commercial plumbing. Code work from a crew that has done it for years.",
        "drain cleaning":       "Drain cleaning. Snake, hydro-jet, or camera. Clear the problem at the source.",
        "water heater repair":  "Water heater repair. Tank or tankless. Most brands.",
        "water heater installation": "Water heater installation. Tank or tankless. Most brands.",
        "leak detection":       "Leak detection and repair. Find it, fix it, dry it out.",
        "sewer line repair":    "Sewer line repair. Camera inspection, trenchless when possible.",
        "emergency service":    "Twenty-four-hour emergency response. When water or heat quits, we pick up.",
        "fixture installation": "Faucets, toilets, showers, sinks. Replacement or upgrade.",
        "gas line service":     "Gas line install, repair, and leak detection. Licensed and inspected.",
        "well pump service":    "Well pump repair and replacement. Keep the water coming.",
        "remodeling":           "Kitchen and bath remodel plumbing. Rough-in through fixtures.",
        "hvac service":         "Heating and cooling service, repair, and maintenance.",
    }
    cards = []
    for svc in services:
        key = svc.lower()
        desc = descriptions.get(key, f"{svc}. From a team that has been in the trade a long time.")
        cards.append(f'<div class="service-card"><h3>{svc}</h3><p>{desc}</p><div class="price">Free quote</div></div>')
    return "".join(cards)


def render_area_tags(areas):
    return "".join(f'<span class="area-tag">{a}</span>' for a in areas)


def render_chat_bubbles(exchange):
    rows = []
    for turn in exchange:
        role = turn.get("role", "customer")
        text = turn.get("text", "")
        rows.append(f'<div class="chat-row {role}"><div class="chat-bubble">{text}</div></div>')
    return "".join(rows)


def render_shop(shop):
    theme = THEMES[shop.get("theme", "teal")]
    trade, trade_title = trade_from_services(shop.get("services", []))
    data = {
        **theme,
        "name": shop["name"],
        "slug": shop["slug"],
        "phone": shop["phone"],
        "tel_digits": shop["tel_digits"],
        "city": shop["city"],
        "state": shop["state"],
        "years": shop["years"],
        "founded": shop["founded"],
        "specialty": shop["specialty"],
        "owner_note": shop["owner_note"],
        "owner_note_long": shop["owner_note_long"],
        "initials": initials_from_name(shop["name"]),
        "trade": trade,
        "trade_title": trade_title,
        "service_cards": render_services_grid(shop["services"]),
        "area_tags": render_area_tags(shop["service_area"]),
        "chat_bubbles": render_chat_bubbles(shop["chat_exchange"]),
        "plumber_id": shop["plumber_id"],
    }
    return TEMPLATE.format(**data)


def write_demo(shop):
    slug = shop["slug"]
    out_dir = DEMO_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "index.html"
    out_path.write_text(render_shop(shop))
    return out_path


def generate_all(shops_file):
    shops = json.loads(Path(shops_file).read_text())
    paths = []
    for shop in shops:
        p = write_demo(shop)
        paths.append(p)
        print(f"  wrote {p}  (theme: {shop.get('theme')})")
    return paths


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: fake_demo_generator.py <fake-shops.json>")
        sys.exit(1)
    paths = generate_all(sys.argv[1])
    print(f"\nGenerated {len(paths)} sample demo pages.")
