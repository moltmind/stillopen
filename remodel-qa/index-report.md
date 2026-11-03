# QA report: homepage (index.html)

Checked 2026-11-02 on branch remodel-2026-11 against http://127.0.0.1:8765/. Read only; nothing in index.html or assets/site.css was changed.

**Overall: FAIL.** The page itself is close. Two copy truths and the chat widget it loads fail; the rest are small layout fixes.

Screenshots: `index-375.png`, `index-768.png`, `index-1280.png`, `index-1440.png` (full page, this folder).

## Failures, with the fix

1. **Chat widget contradicts the page and breaks the locks.** index.html line 408 loads `https://app.stillopen.ai/chatbot.js` with `data-plumber-id="stillopen"`, which puts it in sales mode (`IS_SALES_MODE`, chatbot.js line 90). Its opening line (line 100) is "Hi, I'm Paul, the AI front desk on this site ... I can also book you a 10 minute demo with Cole". The page says "No tiers, no demo to book." It also sets white text on orange user bubbles (`userText: #FFFFFF` on `#f97316`), an orange glow shadow on the bubble (`rgba(249,115,22,0.35)`), and a near-black chat panel. This is Claude.md blocker 6, still open. **Fix:** delete index.html line 408 (the widget script and its comment on line 407) until chatbot.js is fixed in the worker repo and deployed on Cole's yes.
2. **Morning report promises something the page can't do.** Line 276: "The first night it catches a call, this fills in." It's static HTML; it will never fill in. "Not a mockup" is also shaky, since it is a mockup of the report, just with honest zeros. **Fix:** replace the `.report-empty` text with: "Nothing yet. No shop's live, so there's nothing to count, and I'm not putting made-up numbers in here."
3. **Demo greeting is not quoted word for word.** Lines 182 and 216 say "Hollow Creek Plumbing and Heating, after-hours answering service. What's going on?" REMODEL-FACTS.md says to quote the greeting word for word when a transcript uses it, and anyone who calls (715) 665-5255 after reading this will hear the demo heads-up instead. **Fix:** on line 182 (the no-heat sample, right next to the number) use the full greeting: "Hollow Creek Plumbing and Heating, after-hours answering service. Quick heads-up: this is a demo. Hollow Creek isn't a real shop, but the desk you're talking to is. Try me like you've got a real problem." On line 216, use the same, or cut it to the first sentence with no added "What's going on?".
4. **Footer legal rule stops partway across.** `p { max-width: var(--measure) }` caps `.footer-legal`, so its border-top ends around 525px at 1280 and 1440, and around 510px at 768. **Fix:** in site.css add `max-width: none;` to `.footer-legal`.
5. **Double gap above the footer.** `.section:last-of-type { padding-bottom: var(--section-gap) }` plus `.site-footer { margin-top: var(--section-gap) }` leaves about 190px of empty bone at 1280 and about 96px at 375. **Fix:** remove `margin-top: var(--section-gap);` from `.site-footer`.
6. **Morning report zeros don't line up at 768.** "On the list, waiting on you" wraps to two lines, so its 0 sits one line lower than the other two. **Fix:** above 480px give `.report-stat` `display: flex; flex-direction: column; justify-content: space-between;`, or set `.report-stat dt { min-height: 2.6em; }`.
7. **Safety line weight.** `.line-safety { font-weight: 700 }` (site.css line 254). Design file says 600. **Fix:** change to `font-weight: 600`.
8. **Inline phone links stretch their lines.** `.link-call` is `inline-flex` with `min-height: 44px`, so a paragraph line holding one is visibly taller than the others (founder paragraph 4 at line 324, the FAQ lead at line 334). **Fix:** add `p .link-call { display: inline; min-height: 0; }`. The footer and hero-alt links can keep the 44px target.
9. **Footer notes are double spaced.** The `.footer-note` span under each footer number inherits the li's 20px * 1.55 line box, so "Me, by day. My desk, by night." wraps with a gap at 768. **Fix:** `.footer-list .footer-note { display: block; line-height: 1.5; }`.

## Passes, with evidence

**Hard locks**
- Accent: every hex in site.css and index.html is a design token: #f5f3ee, #ffffff, #1c1f22, #4a5259, #d6d2c8, #7d838a, #f97316, #ea580c, #ad3a0a, #2b3036, #b8bec4. No rgb(), rgba(), hsl(). Only orange hue is #f97316 / #ea580c hover / #ad3a0a for small text. PASS (page). The widget fails, see 1.
- No `gradient`, `backdrop-filter`, `blur`, `filter`, `box-shadow`, `text-shadow` in index.html or site.css. PASS.
- Fonts: Barlow Condensed and Source Sans 3 only. No Inter. PASS.
- Icons: all eight are inline SVG `<symbol>`s with Lucide paths (phone, phone-forwarded, mail, sunrise, check, chevron-down, image, clock), all referenced ids defined. No icon font, no icon CDN. PASS.
- Images: no `<img>` at all, no `background-image`, no `_hf`, no `cole-founder-portrait.jpg`. Only image refs are `/app-icon.png` (favicon, logo in JSON-LD). Founder block is an honest empty frame. PASS.

**Copy truths**
- No "text" or "texts you" anywhere visible (only the JSON-LD `"text"` key). PASS.
- No arrival window or time promise. "arrival window" appears only as "It never gives an arrival window." PASS.
- "the owner will call to confirm the time" present (line 190), matches FACTS booking close word for word. PASS.
- No testimonials, no reviews, no stats. The only numbers are price, 48 hours, 30 days, 1 to 5 trucks, 60 miles, four rings, and honest zeros. PASS.
- Both transcripts carry a "Sample" tag (2 tags, 2 transcripts). PASS.
- Gas safety line matches FACTS exactly with "nine one one" (string check: True). Transfer offer "Want me to connect you to the on-call tech?" matches. PASS.
- Hero line "It answers as a plumbing shop. The shop's made up. The desk isn't." present (line 170), directly under the "Call (715) 665-5255" button, which is the layout the design file calls for. PASS.
- Price and guarantee: $497 to go live, $197 a month, cancel any time, live in 48 hours, $497 back if no job in 30 days, pay online, no sales call. Matches FACTS. Stripe link resolves (200). PASS.
- "Call #1, not yet." present (line 370). PASS.
- No em-dashes or en-dashes: `grep -nP "\x{2014}|\x{2013}"` on both files returns nothing. PASS.
- Side note, not a page failure: "That line is built in, so it goes first every time" is backed by the private worker source (`GAS_SAFETY_LINE` and `gasOpen()` in worker.js lines 28 and 88). Claude.md still lists the hard-coded gas rule as blocker 3, so either that list is stale or the code isn't deployed. Worth one check before this ships.

**Voice**
- Grep for seamless, leverage, solution, empower, unlock, streamline, elevate, robust, 24/7, standalone "AI": none in visible copy. PASS.
- Every line reads like Cole. The only flags are the two in failures 2 and 3. One optional nit: the meta description says "gets the job on the books", which reads like a booked slot. Suggest "puts the job first in line" to match the transcript.

**Numbers**
- `tel:+17156655255` and `tel:+19203326113` present at all four widths. Demo number on the first screen at 375 (header and the big button, button top at about 410px). PASS.

**FAQ JSON-LD**
- Script extracted all 6 questions and answers from the FAQPage JSON-LD and the visible `<details>`. Result: 6 and 6, ALL MATCH, character for character. PASS.

**Layout**
- Horizontal overflow: 0px at 375, 768, 1280, 1440. PASS.
- 768: nothing overlaps or clips. Only issues are 4, 6, 8, 9 above.
- 1280 and 1440: two-column hero (7/5), transcript tops aligned with the h1; gas copy and gas transcript side by side; steps in three columns; price is one card; content capped at 1200px and centered at 1440. Widest text measured 65ch at 1280 and 1440, 68ch at 768 (`.step` at 40rem). Under 70. PASS.

**Console and requests**
- Console errors: none at any width. Failed requests: none.
- Internal links and assets, curled against the local server: `/`, `/app-icon.png`, `/assets/site.css`, `/for-plumbers/`, `/for-hvac/`, `/privacy.html`, `/terms.html` all 200. Anchors `#main`, `#how`, `#price`, `#founder`, `#faq` all exist. PASS.
