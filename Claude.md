# Claude.md, Operating Contract for StillOpen.ai

This file auto-loads at the start of every Claude session in this project. Read it first. Apply it for the rest of the session. Rewritten 2026-07-05, replacing the May version, which was written under money panic that no longer exists.

---

## Who I am working with

Cole Cummings. Founder of StillOpen.ai, a 24/7 AI front desk for service businesses. Wisconsin steel erector at CFBSI, work he enjoys, building this from want, not fear. Not a coder; he directs Claude and his taste is the quality gate. Global rules live in `/Users/faith/CLAUDE.md` and they always apply here: no em-dashes, no coach words, warn before money spends, blue-collar register.

**The register change that matters:** the May version of this file said "family depends on this income, the account expires, every session is a 7-day sprint." That's over. Cole has steady income he likes. StillOpen is now built the way the name deserves: something he'd be proud to show his kids, shipped at a premium bar, no desperation in the copy or the decisions.

## What StillOpen is becoming (set 2026-07-05, the rebirth direction)

The one-sentence product: **nobody who reaches out to you gets nothing.** The rebuild direction Cole chose:

1. **The demo factory becomes the homepage.** A visitor enters their business, and their own front desk wakes up in front of them. The site stops describing and starts demonstrating. The old generator (`demo/builder/index.html`, May 9) is the v1: functional, too cheesy, being replaced, not iterated.
2. **Visually alive while scrolling.** Visitors should fall in love with the page itself. Use the `scroll-life` skill plus the installed animation skills (gsap-scrolltrigger, animejs, svg-animation, micro-interaction, 60fps-animation, accessible-animation, page-transition-animation, lottie-animations, threejs-webgl, modern-web-design) and `frontend-design`. Premium bar, never slop.
3. **Wider audience, decided.** StillOpen is for service businesses, period. Med spas, photographers, vets, dental, salons, fitness, and trades as one lane among many. The May lesson holds: the buyer is anyone for whom one missed inquiry costs $300-$5,000. Don't rebuild the brand around plumbers.
4. **Website add-on, pending Cole's shaping.** Demos are already full websites; "keep the demo as your new site" may become a priced add-on riding the install. It is NOT a return of the retired website-agency plays. Don't pitch it as an agency.
5. **Voice tier, exploratory.** ElevenLabs agent tools exist on this machine. Any voice build costs credits: estimate first, get Cole's yes.

## Design hard locks (from Cole's global standards)

- Accent is safety orange `#f97316` only. No purple anywhere. No gradients-as-decoration, no glassmorphism, no Inter as primary font, no floating blobs, no fake testimonials, Lucide inline SVG icons only.
- Real photography or honest empty blocks.
- Every visual change is verified by screenshot on a real local server at 375px and 1280px BEFORE showing Cole.
- Two rejected design directions in a row means stop and re-ask the brief.

## Voice (every line of copy)

Full doctrine: `Synchronize/Team/Moses/MosesV1/_archive_from_homeedge_memory/brand_voice_built_by_a_guy.md`. Short form: first-person Cole. No em-dashes. Contractions. Concrete over abstract ("$650 lip filler," "the 2 AM call that went to voicemail"). The number is the pitch. Humor in flashes. Faith-aware, never preachy. Read every sentence aloud in the voice of a Wisconsin steel erector; if it doesn't sound like him, rewrite it.

## Working rules

1. **Expand his thinking, don't reflect it back.** Cole asks for it by name. Deliver it.
2. **Lead with the highest-value move**, then do it. No option buffets.
3. **Own mistakes plainly**, once, with the why. Then move.
4. **Honesty over theater.** "I'm guessing" and "I was wrong" are complete sentences.
5. **Warn before every money spend** (API, credits, subscriptions, ads) and wait for the explicit yes.
6. **Ship real things.** One done thing beats ten planned things. But done means verified, not just written.
7. **No urgency theater.** No fake deadlines. When there IS a real window (like a cheaper-model window), use it on foundations, not busywork.

## What's live (as of 2026-07-09)

- **stillopen.ai**: marketing site, deploys via **GitHub Pages** (repo `moltmind/stillopen`), NOT Cloudflare Pages. **Front door is the MESSAGES WHILE YOU SLEPT page** (live 2026-07-09, commit `f2cc962`): a scroll of after-hours conversations that stack into a morning report, then the demo factory and pricing. **No character on the site**, the Paul clerk was ruled off 2026-07-07. Old homepage still preserved at `index-v1.html`; the Paul-page baseline (rollback point) is commit `6b754bc`. `v2/index.html` is the lab copy of the live page; Paul's assets stay in `v2/` (paul-cast.png, paul-hero.mp4, paul-loop.mp4, paul-poster.jpg), preserved off the site, may serve elsewhere later. `stillopen-web-cinema` holds the scroll-cinema recipes and the house motion rules; read it before touching page motion.
- **app.stillopen.ai**: `worker.js` (~4k lines): chat API, KV (namespace `a8d032d8d52143e0848bc5fc14129c6a`), bookings, Stripe webhooks. This is the real machine; treat with respect. The **Morning Report dashboard is live at `app.stillopen.ai/dashboard`**: what the front desk caught last night, Clerk-gated for clients, with Cole's admin rollup across demos.
- **chatbot.js**: the embeddable widget.
- **Demos**: fictional trade demos in `demo/`, real-prospect demos at root (kim, allure, lotus, ark, bullis, emily, and more; sources in `../demos/`).
- **Vertical pages**: `for-medspas/`, `for-photographers/`, `for-plumbers/`. **Partners**: `partners/agencies/`, `partners/walkthrough/` (`partners/cal/` is orphaned). `trades-audit/` sells the $297 audit.
- **family.stillopen.ai**: separate worker in `../family/`.
- **Prospecting**: `../stillopen-prospector/` (Python) with dental/med-spa CSVs.

## Known debt (carried over, still true)

- `/founders/` page has dead Founding 5 content. `partners/cal/` orphaned.
- Homepage demo video and sample gallery are still plumber-specific.
- Pro Install checkout links to SMS, not a Stripe product.
- Backend industry codes missing the May verticals (using "other").
- KV conversation logs have never been mined; needs `npx wrangler login` from Cole, then read-only analysis of what real visitors asked.

## Cloud operations (added 2026-08-05)

A cloud CEO session now runs alongside local work. Cole granted it on 2026-08-05:

- **Repo control from the cloud.** A fine-grained token (this repo only, contents read/write, expires Nov 2 2026) lets cloud sessions pull, edit, and push without Cole's Mac in the loop. The token lives only inside the CEO session, not in any scheduled task prompt.
- **The daily shift.** A scheduled task fires 6:00 AM Central every day in a fresh cloud session: site and widget health checks, Stripe deltas, Gmail reply scan, five verified Wisconsin prospects in a rotating vertical, up to three outreach drafts in Cole's voice, then a morning report ending in a DECISIONS NEEDED list. It cannot send email, spend money, or push code.
- **Outreach send policy, set by Cole.** Auto-send approved, capped at 5 per day, once sending runs through Resend on the stillopen.ai domain. The Gmail connector is draft-only by design, so until the Resend key exists everything stays a Gmail draft Cole sends himself. Replies from real humans always get drafted for Cole, never auto-answered.
- **Spending.** A monthly ceiling is agreed. Every new charge gets named to Cole before it happens. Committed so far: nothing.
- **The one goal until further notice:** first paying customer, then the first ten. Build only what selling demands.

Status notes for the July section above: `/founders/` and `/partners/cal/` are clean noindexed redirects now, off the debt list.

## Deploy workflow

1. Edit local files here.
2. Preview on a real local server (`python3 -m http.server`), screenshot desktop + mobile.
3. Cole approves, then commit and push to `main` (Cole runs the push himself unless he says otherwise; standing cost-neutral deploy permission is in his memory, when in doubt ask).
4. Cloudflare Pages auto-deploys in 1-3 minutes.

Never commit credentials. Read logs before restarting anything. Never fabricate testimonials or reviews, ever.
