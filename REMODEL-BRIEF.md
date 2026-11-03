# Website remodel brief

Written 2026-11-02 by the architect. Read `Claude.md` in this repo first. This doc says what the site must become to match the product as it exists tonight.

## Ground truth the site must match (worker `d92cf67`, deployed Nov 2 11:20 PM)
- Product: the phone. Answers as the shop after four rings, English and Spanish, 24/7.
- Gas smell: safety line first, in code, every channel, both languages, says "nine one one" out loud. True claim.
- Booking: takes name, number, address; books a place in line; the owner confirms the time. No arrival windows until calendar availability is wired.
- Texting: OFF until A2P. No deposit links by text. Owner alerts by email. Chat visitors see the deposit link in the chat. The word "text" does not appear as a promise anywhere.
- Disclosure: asked if it's a person, the desk says "No, you've got [shop]'s after-hours answering service. It's automated, not a person." It never names StillOpen to a shop's customer.
- Demo line is live: (715) 665-5255. Answers as Hollow Creek Plumbing & Heating and says in the greeting that it's a demo: "Hollow Creek isn't a real shop, but the desk you're talking to is. Try me like you've got a real problem." Real callers get sent to 9-1-1 or a real shop. The sales line (920) 332-6113 stays.
- Price: $497 to go live, $197/mo, cancel any time, 30-day "caught you a job or the $497 comes back."
- Niche: plumbing and heating shops, 1 to 5 trucks, Dunn/Chippewa/Eau Claire first, 60 miles max. Winter message: no heat.
- Customers: 0. Real calls: 0. The call log stays an honest empty block until a real customer's real call.
- Founder: Cole Cummings, steel erector, Menomonie WI. First person. Real portrait exists (cole-founder-portrait.jpg).

## What is wrong on the live site today
1. Phone product page promises deposit links "by text." False until A2P.
2. "Books the job" language implies a time. Change to "gets them on the books; you confirm the time."
3. Hero CTA is the sales line, not the demo. Should be "Call (715) 665-5255" with "It answers as a plumbing shop. The shop's made up. The desk isn't."
4. Hero sample is a water heater; it's heating season. Lead with no heat at 10 PM; a short gas-smell transcript as the proof of care.
5. 20 non-plumbing vertical pages (for-dental/, for-medspas/, etc.) are chat-era. Out of nav, still indexed. Add noindex meta to each. Don't rewrite them.
6. trades-audit/ sells a $297 audit; leave it, Cole decides later.
7. chatbot.js bubble label "Paul": rename to "Ask the desk" if the label lives in this repo.

## Design hard locks (from the operating contract)
Safety orange #f97316 is the only accent. No purple, no decorative gradients, no glassmorphism, no Inter as primary font, no floating blobs, Lucide inline SVG icons only. Real photography or honest empty blocks: no stock headsets, no smiling call-center photos, no AI-generated people. If a photo's provenance is unknown (assets/trade-heroes/*_hf.jpg), do not use it. Every page screenshot at 375 and 1280 on a real local server before Cole sees it. Two rejected directions in a row means stop and re-ask.

## Positioning (April competitor research, still true)
All ten competitors (Avoca, Smith.ai, Podium, ServiceTitan, Housecall Pro, Ruby, Signpost, Jobber, Goodcall, Numa) run blue and white, hide pricing, and push "book a demo." StillOpen's open lanes: price on the page, a number to call instead of a demo to book, the founder named with his trade, the 2 AM (now 10 PM no-heat) scene, honesty as the trust badge. Visual direction: work-site palette (steel gray, bone white, safety orange), one condensed utilitarian sans for headlines plus a plain humanist sans for body. Do not look like SaaS.

## Voice (every line)
First-person Cole. No em-dashes. Contractions. Concrete numbers. "Sends you," not "texts you." Humor in flashes. Read aloud as a Wisconsin steel erector; if it doesn't sound like him, rewrite it.

## Pages in scope
index.html (hero with the demo number, no-heat sample transcript, gas sample, how it works, morning report with honest zeros, pricing and guarantee, founder, FAQ with matching JSON-LD, footer), for-plumbers/, for-hvac/, 404.html. Noindex on the 20 chat-era vertical pages. Leave privacy, terms, data-deletion, vs/, trades-audit/, embed-guide/, partners/, the demo/ folders, and all prospect clone folders untouched.

## How the site deploys
GitHub Pages from main. Preview: Cloudflare Pages project `stillopen-preview` via `npx wrangler pages deploy . --project-name stillopen-preview --branch remodel` from the repo root (exclude node_modules via .wranglerignore or deploy a dist/ copy). Old homepage preserved at index-v2-night.html; keep it.

## What this work does not do
No new vertical pages. No agency tier. No worker changes. No money. No redesign for its own sake: the site's job this month is to let a plumber call a number and then pay $497 without a sales call.
