#!/usr/bin/env python3
"""Generate StillOpen demo HTML pages for a list of plumbing shops.

Input: shops.json (list of shop dicts, see SCHEMA below)
Output: stillopen/demo/{slug}/index.html per shop

Each shop gets a palette from THEMES rotation, real shop data rendered
into the HTML, and a data-plumber-id matching demo-plumbing-{slug} so
the chatbot worker can load kb:demo-plumbing-{slug} from KV once seeded.
"""

import json
import os
import re
from pathlib import Path

REPO_ROOT = Path("/Users/faith/Desktop/StillOpen.ai/stillopen")
DEMO_DIR = REPO_ROOT / "demo"

# ─── SCHEMA ───────────────────────────────────────────────────────────────
# Each shop dict must provide:
#   slug            url-safe identifier (e.g. "jones-plumbing")
#   name            display name
#   phone           formatted (XXX) XXX-XXXX
#   tel_digits      just digits, e.g. "4142139617"
#   url             their real website URL
#   city            city name
#   state           two-letter state abbreviation
#   years           number of years in business
#   founded         founding year (YYYY)
#   hook            one sentence personalization (for banner copy)
#   services        list of strings (4 to 8 services)
#   service_area    list of strings (neighborhoods / counties / regions)
#   specialty       short phrase for hero subhead, e.g. "24/7 emergency service"
#   owner_note      optional one-line owner credit, e.g. "Owned by Mike Ingrilli"
#   theme           palette key from THEMES below
#
# Optional:
#   email           if published on their site
#   hours           dict of day to hours string, or "24/7"

# ─── COLOR THEMES ─────────────────────────────────────────────────────────
# Each theme returns the 7 CSS variable values. StillOpen orange stays as
# the Cole-demo-banner accent across all themes (not part of the theme).

THEMES = {
    "teal": {
        "primary":        "#0d7377",
        "primary_light":  "#14919b",
        "primary_bright": "#7eedf2",
        "primary_soft":   "#cfe8e3",
        "cream":          "#f7f5f0",
        "border":         "#d9d4c7",
        "lede":           "#cfe8e3",
    },
    "olive": {
        "primary":        "#4a5b1a",
        "primary_light":  "#5c7222",
        "primary_bright": "#b8d468",
        "primary_soft":   "#d4dfc4",
        "cream":          "#f7f5f0",
        "border":         "#d9d4c7",
        "lede":           "#d4dfc4",
    },
    "stone": {
        "primary":        "#57534e",
        "primary_light":  "#78716c",
        "primary_bright": "#cda3a8",
        "primary_soft":   "#d6d3d1",
        "cream":          "#f7f5f0",
        "border":         "#d9d4c7",
        "lede":           "#d6d3d1",
    },
    "navy": {
        "primary":        "#1e3a5f",
        "primary_light":  "#2c5282",
        "primary_bright": "#90cdf4",
        "primary_soft":   "#bee3f8",
        "cream":          "#f7f5f0",
        "border":         "#d9d4c7",
        "lede":           "#bee3f8",
    },
    "forest": {
        "primary":        "#2f3e2e",
        "primary_light":  "#4a6041",
        "primary_bright": "#c77d3d",
        "primary_soft":   "#e4a672",
        "cream":          "#f7f5f0",
        "border":         "#d9d4c7",
        "lede":           "#e4a672",
    },
    "burgundy": {
        "primary":        "#6b1d2e",
        "primary_light":  "#8b2b3d",
        "primary_bright": "#f4a261",
        "primary_soft":   "#f7d3b1",
        "cream":          "#f9f6f2",
        "border":         "#e4d9ca",
        "lede":           "#f7d3b1",
    },
}

# Rotate through themes for variety
THEME_ROTATION = ["teal", "olive", "stone", "navy", "forest", "burgundy"]


# ─── HTML TEMPLATE ────────────────────────────────────────────────────────

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{name} | {city}, {state} | {specialty}</title>
<meta name="description" content="{name} serving {city}, {state} and the surrounding area since {founded}. {specialty}. Licensed and insured.">
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

.top-bar {{ background: var(--primary); color: var(--cream); padding: 8px 0; font-size: 14px; }}
.top-bar-inner {{ max-width: 1100px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }}
.top-bar strong {{ color: var(--primary-bright); }}

header {{ background: var(--cream); border-bottom: 2px solid var(--border); position: sticky; top: 0; z-index: 50; }}
.header-inner {{ max-width: 1100px; margin: 0 auto; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 24px; }}
.logo {{ display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--primary); }}
.logo-mark {{ width: 48px; height: 48px; border-radius: 8px; background: var(--primary); color: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }}
.logo-text {{ font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1; }}
.logo-text small {{ display: block; font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }}
nav ul {{ list-style: none; display: flex; gap: 28px; align-items: center; }}
nav a {{ color: var(--primary); text-decoration: none; font-weight: 500; font-size: 15px; }}
nav a:hover {{ color: var(--primary-light); }}
.header-phone {{ background: var(--primary); color: var(--cream); padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px; transition: background 0.15s; }}
.header-phone:hover {{ background: var(--primary-light); }}
@media (max-width: 720px) {{ nav ul li:not(:last-child) {{ display: none; }} }}

.hero {{ padding: 64px 20px 80px; background: linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.0) 100%), var(--primary); color: var(--cream); }}
.hero-inner {{ max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: center; }}
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
.hero-card {{ background: var(--cream); color: var(--text); padding: 28px; border-radius: 10px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }}
.hero-card h3 {{ font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--primary); margin-bottom: 12px; }}
.hero-card h4 {{ font-size: 22px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }}
.hero-card p {{ font-size: 15px; color: var(--text-muted); margin-bottom: 18px; }}
.hero-card ul {{ list-style: none; display: flex; flex-direction: column; gap: 8px; }}
.hero-card li {{ font-size: 14px; display: flex; align-items: center; gap: 10px; }}
.hero-card li::before {{ content: "\\2713"; color: #16a34a; font-weight: 800; font-size: 14px; }}

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

.hours-section {{ background: var(--cream); }}
.hours-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }}
@media (max-width: 720px) {{ .hours-grid {{ grid-template-columns: 1fr; }} }}
.hours-card {{ background: var(--bg-alt); padding: 28px; border-radius: 10px; border: 1px solid var(--border); }}
.hours-card h3 {{ font-size: 20px; font-weight: 800; margin-bottom: 16px; color: var(--primary); }}
.hours-card .row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 15px; }}
.hours-card .row:last-child {{ border: none; }}
.hours-card .row .day {{ color: var(--text-muted); }}
.hours-card .row .hrs {{ font-weight: 600; color: var(--primary); }}
.emergency-card {{ background: var(--primary); color: var(--cream); padding: 28px; border-radius: 10px; }}
.emergency-card h3 {{ font-size: 20px; font-weight: 800; margin-bottom: 12px; }}
.emergency-card p {{ font-size: 15px; margin-bottom: 18px; opacity: 0.95; }}
.emergency-card .big-number {{ font-size: 26px; font-weight: 800; letter-spacing: 1px; background: rgba(0,0,0,0.25); padding: 14px 18px; border-radius: 6px; text-align: center; }}

.cta-section {{ background: var(--cream); text-align: center; }}
.cta-section .section-title {{ margin: 0 auto 16px; }}
.cta-section .section-lede {{ margin: 0 auto 32px; }}

footer {{ background: var(--primary); color: var(--lede); padding: 40px 20px 24px; font-size: 14px; }}
.footer-inner {{ max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }}
@media (max-width: 720px) {{ .footer-inner {{ grid-template-columns: 1fr; }} }}
footer h4 {{ color: var(--cream); font-weight: 700; margin-bottom: 12px; font-size: 15px; }}
footer a {{ color: var(--lede); text-decoration: none; display: block; margin-bottom: 6px; }}
footer a:hover {{ color: var(--cream); }}
.footer-bottom {{ max-width: 1100px; margin: 32px auto 0; padding-top: 20px; border-top: 1px solid rgba(245,241,232,0.15); font-size: 12px; color: var(--lede); text-align: center; opacity: 0.7; }}

.cole-demo-banner {{ position: sticky; top: 0; z-index: 9999; background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%); color: #f7f5f0; padding: 12px 20px; text-align: center; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 14px; border-bottom: 1px solid #f97316; line-height: 1.5; }}
.cole-demo-banner-inner {{ max-width: 1100px; margin: 0 auto; }}
.cole-demo-banner strong {{ color: #fb923c; font-weight: 600; }}
.cole-demo-cta {{ display: inline-block; margin-left: 16px; padding: 5px 14px; background: #f97316; color: #fff !important; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 13px; }}
.cole-demo-cta:hover {{ background: #ea580c; }}
@media (max-width: 720px) {{ .cole-demo-banner {{ font-size: 13px; padding: 10px 14px; }} .cole-demo-cta {{ display: block; margin: 8px auto 0; max-width: 200px; }} }}
@keyframes cole-demo-bubble-pulse {{ 0% {{ box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.55), 0 4px 16px rgba(0,0,0,0.25); }} 70% {{ box-shadow: 0 0 0 22px rgba(249, 115, 22, 0), 0 4px 16px rgba(0,0,0,0.25); }} 100% {{ box-shadow: 0 0 0 0 rgba(249, 115, 22, 0), 0 4px 16px rgba(0,0,0,0.25); }} }}
#he-bubble {{ animation: cole-demo-bubble-pulse 2.5s ease-out infinite !important; }}
#he-bubble.open {{ animation: none !important; }}
</style>
</head>
<body>

<div class="cole-demo-banner">
  <div class="cole-demo-banner-inner">
    <strong>Hey {first_word},</strong> Cole here. Built this demo for your shop.
    <a href="#" onclick="event.preventDefault(); coleOpenChat();" class="cole-demo-cta">Try the chat &rarr;</a>
  </div>
</div>
<script>
function coleOpenChat() {{
  var attempts = 0;
  function attempt() {{
    var b = document.getElementById('he-bubble');
    if (b) {{ b.click(); }}
    else if (attempts++ < 12) {{ setTimeout(attempt, 250); }}
  }}
  attempt();
}}
</script>

<div class="top-bar">
  <div class="top-bar-inner">
    <div><strong>Serving {city} since {founded}.</strong> Licensed &amp; Insured. {years}+ years of trusted plumbing.</div>
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
        <li><a href="#hours">Hours</a></li>
        <li><a href="tel:+1{tel_digits}" class="header-phone">Call {phone}</a></li>
      </ul>
    </nav>
  </div>
</header>

<section class="hero" id="top">
  <div class="hero-inner">
    <div>
      <span class="hero-badge">Since {founded}</span>
      <h1>{years}+ years of plumbing {city} can count on. <em>Every time.</em></h1>
      <p>{name} has served {city} and the surrounding area for over {years} years. {specialty}. Honest work, fair prices, and a team that shows up when we say we will.</p>
      <div class="hero-cta">
        <a href="tel:+1{tel_digits}" class="btn-primary">Call {phone}</a>
        <a href="#services" class="btn-ghost">Our services</a>
      </div>
    </div>
    <div class="hero-card">
      <h3>Why {first_word}?</h3>
      <h4>{years}+ years. Real work you can trust.</h4>
      <p>{hook}</p>
      <ul>{hero_card_list}</ul>
    </div>
  </div>
</section>

<section class="services-section" id="services">
  <div class="section-inner">
    <span class="section-eyebrow">What we do</span>
    <h2 class="section-title">Plumbing services for every home and business.</h2>
    <p class="section-lede">From emergency repairs to full remodels, {name} has the experience and the team to get it done right the first time.</p>
    <div class="services-grid">{service_cards}</div>
  </div>
</section>

<section class="about-section">
  <div class="section-inner">
    <span class="section-eyebrow">The shop</span>
    <h2 class="section-title">Locally owned. Trusted since {founded}.</h2>
    <p class="section-lede">{name} has served {city} and the surrounding area for {years}+ years. We believe in honest work, fair prices, and treating every job like it matters. {owner_note_long}</p>
    <div class="about-grid">
      <div class="stat"><div class="num">{years}+</div><div class="label">Years in business</div></div>
      <div class="stat"><div class="num">{founded}</div><div class="label">Year founded</div></div>
      <div class="stat"><div class="num">Free</div><div class="label">Quotes on every job</div></div>
      <div class="stat"><div class="num">Yes</div><div class="label">Licensed &amp; insured</div></div>
    </div>
  </div>
</section>

<section class="area-section" id="area">
  <div class="section-inner">
    <span class="section-eyebrow">Where we work</span>
    <h2 class="section-title">Serving {city} and the surrounding area.</h2>
    <p class="section-lede">Based in {city}, we cover the local area and nearby communities. If you are in the area, give us a call.</p>
    <div class="area-tags">{area_tags}</div>
  </div>
</section>

<section class="hours-section" id="hours">
  <div class="section-inner">
    <span class="section-eyebrow">When we are available</span>
    <h2 class="section-title">Standard hours plus emergency availability.</h2>
    <div class="hours-grid">
      <div class="hours-card">
        <h3>Regular hours</h3>
        <div class="row"><span class="day">Monday</span><span class="hrs">7 AM - 5 PM</span></div>
        <div class="row"><span class="day">Tuesday</span><span class="hrs">7 AM - 5 PM</span></div>
        <div class="row"><span class="day">Wednesday</span><span class="hrs">7 AM - 5 PM</span></div>
        <div class="row"><span class="day">Thursday</span><span class="hrs">7 AM - 5 PM</span></div>
        <div class="row"><span class="day">Friday</span><span class="hrs">7 AM - 5 PM</span></div>
        <div class="row"><span class="day">Saturday</span><span class="hrs">By appointment</span></div>
        <div class="row"><span class="day">Sunday</span><span class="hrs">Emergency only</span></div>
      </div>
      <div class="emergency-card">
        <h3>Emergency Service</h3>
        <p>Plumbing emergencies do not wait for business hours. Call us when you need help.</p>
        <div class="big-number">{phone}</div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section" id="contact">
  <div class="section-inner">
    <span class="section-eyebrow">Get a free quote</span>
    <h2 class="section-title">{years}+ years of trust. One call to get started.</h2>
    <p class="section-lede">{name} serves {city}, {state} and the surrounding area. Call us or chat with our front desk in the corner.</p>
    <a href="tel:+1{tel_digits}" class="btn-primary">Call {phone}</a>
  </div>
</section>

<footer>
  <div class="footer-inner">
    <div>
      <h4>{name}</h4>
      <p>Serving {city} and the surrounding area since {founded}. Locally owned. Trusted for {years}+ years.</p>
      <p style="margin-top: 12px;">Fully Licensed &amp; Insured</p>
    </div>
    <div>
      <h4>Services</h4>
      {footer_services}
    </div>
    <div>
      <h4>Contact</h4>
      <a href="tel:+1{tel_digits}">{phone}</a>
      <p style="margin-top: 12px;">{city}, {state}</p>
    </div>
  </div>
  <div class="footer-bottom">
    &copy; 2026 {name}. {city}, {state}. All rights reserved.
  </div>
</footer>

<script src="https://app.stillopen.ai/chatbot.js" data-plumber-id="{plumber_id}"></script>

</body>
</html>
"""


# ─── RENDERERS ────────────────────────────────────────────────────────────

def initials_from_name(name):
    words = [w for w in re.split(r"[\s&]+", name) if w and w.lower() not in ("and", "of", "the", "plumbing", "heating", "plumbers")]
    if not words:
        words = name.split()
    initials = "".join(w[0] for w in words[:2]).upper()
    return initials or "SP"


def first_word(name):
    return re.split(r"[\s,&]+", name.strip())[0] or name


def render_services_grid(services):
    """Turn list of service names into HTML service cards."""
    descriptions = {
        "residential plumbing": "Complete residential plumbing. Repairs, installations, and routine maintenance. We treat your home like our own.",
        "commercial plumbing": "Commercial plumbing for businesses and facilities. Code-compliant work from an experienced team.",
        "drain cleaning": "Drain cleaning and clog removal. Snake, hydro-jet, or camera inspection. We clear the problem at the source.",
        "water heater repair": "Water heater repair and installation. Tank and tankless. Most brands.",
        "water heater installation": "Water heater installation and replacement. Tank and tankless. Most brands.",
        "leak detection": "Leak detection and repair. We find the leak, fix the leak, and dry it out right.",
        "sewer line repair": "Sewer line repair and replacement. Camera inspection, trenchless options, and old-school excavation when needed.",
        "new construction": "Full plumbing installation for new homes and commercial buildings. Rough-in through final fixtures.",
        "remodeling": "Kitchen and bathroom remodeling plumbing. Pipes, drains, and fixtures done right.",
        "emergency service": "24/7 emergency plumbing. When water is going where it should not, we are the number to call.",
        "fixture installation": "Faucets, toilets, showers, sinks. New, replacement, or upgrade.",
        "gas line service": "Gas line installation, repair, and leak detection. Licensed and inspected.",
        "well pump service": "Well pump repair, replacement, and maintenance. We keep the water coming.",
        "water softener installation": "Water softener installation and service. Cleaner water, longer-lasting fixtures.",
        "backflow prevention": "Backflow prevention testing and installation. Code compliance and safe water.",
        "electrical service": "Electrical service and repair. Licensed electricians on the team.",
        "hvac service": "HVAC service. Heating and cooling repair, installation, and maintenance.",
    }
    cards = []
    for svc in services:
        key = svc.lower()
        desc = descriptions.get(key, f"{svc}. Professional service from a team with years of experience.")
        cards.append(f'''
          <div class="service-card">
            <h3>{svc}</h3>
            <p>{desc}</p>
            <div class="price">Free quote</div>
          </div>''')
    return "".join(cards)


def render_area_tags(service_area):
    return "".join(f'<span class="area-tag">{area}</span>' for area in service_area)


def render_hero_card_list(shop):
    items = [
        f"Over {shop['years']} years of experience",
        f"Serving {shop['city']}, {shop['state']}",
        "Licensed &amp; insured",
        "Free quotes on every job",
    ]
    return "".join(f"<li>{it}</li>" for it in items[:4])


def render_footer_services(services):
    return "\n      ".join(f'<a href="#services">{s}</a>' for s in services[:5])


def render_shop(shop):
    theme = THEMES[shop.get("theme", "teal")]
    data = {
        **theme,
        "name": shop["name"],
        "slug": shop["slug"],
        "phone": shop["phone"],
        "tel_digits": shop.get("tel_digits") or re.sub(r"\D", "", shop["phone"]),
        "city": shop["city"],
        "state": shop["state"],
        "years": shop["years"],
        "founded": shop["founded"],
        "hook": shop["hook"],
        "specialty": shop.get("specialty", "Residential and commercial plumbing"),
        "owner_note": shop.get("owner_note", "Locally owned. Honest work. Fair prices."),
        "owner_note_long": shop.get("owner_note_long", shop.get("owner_note", "")),
        "initials": initials_from_name(shop["name"]),
        "first_word": first_word(shop["name"]),
        "service_cards": render_services_grid(shop.get("services", ["Residential Plumbing", "Commercial Plumbing", "Drain Cleaning", "Water Heater Repair", "Leak Detection", "Emergency Service"])),
        "area_tags": render_area_tags(shop.get("service_area", [shop["city"], f"{shop['city']} metro", "Surrounding areas"])),
        "hero_card_list": render_hero_card_list(shop),
        "footer_services": render_footer_services(shop.get("services", ["Residential Plumbing", "Commercial Plumbing", "Drain Cleaning", "Water Heater Repair", "Emergency Service"])),
        "plumber_id": shop.get("plumber_id") or f"demo-plumbing-{shop['slug']}",
    }
    html = TEMPLATE.format(**data)
    # Inject founders-offer exit-intent popup just before the chatbot script tag.
    # Done post-format to avoid .format() choking on the JS's curly braces.
    popup_path = Path("/tmp/founders_popup.js")
    if not popup_path.exists():
        popup_path = Path("/Users/faith/Desktop/StillOpen.ai/stillopen/scripts/round-2/founders_popup.js")
    if popup_path.exists():
        popup_js = popup_path.read_text()
        popup_block = f"<!-- StillOpen Founders Popup -->\n<script>\n{popup_js}\n</script>\n"
        chat_tag = '<script src="https://app.stillopen.ai/chatbot.js"'
        html = html.replace(chat_tag, popup_block + chat_tag, 1)
    return html


def write_demo(shop):
    """Write demo/{slug}/index.html for a shop."""
    slug = shop["slug"]
    out_dir = DEMO_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "index.html"
    html = render_shop(shop)
    out_path.write_text(html)
    return out_path


def generate_all(shops_file):
    """Given a JSON file with a list of shop dicts, generate all demos."""
    shops = json.loads(Path(shops_file).read_text())
    # Rotate themes
    for i, shop in enumerate(shops):
        if "theme" not in shop:
            shop["theme"] = THEME_ROTATION[i % len(THEME_ROTATION)]
    paths = []
    for shop in shops:
        p = write_demo(shop)
        paths.append(p)
        print(f"  wrote {p}  (theme: {shop.get('theme')})")
    return paths


if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: demo_generator.py <shops.json>")
        sys.exit(1)
    paths = generate_all(sys.argv[1])
    print(f"\nGenerated {len(paths)} demo pages.")
