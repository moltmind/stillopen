# QA report: trade pages, 404, homepage round 2

Checked 2026-11-02 on branch remodel-2026-11 against http://127.0.0.1:8765/. Read only; no page or CSS was changed. Screenshots in this folder: `for-plumbers-*.png`, `for-hvac-*.png`, `404-*.png`, `index-*.png` at 375, 768, 1280 and 1440 (full page). I looked at every one, cut into sections so nothing got shrunk past reading.

Foreman decisions not failed: the chatbot.js include stays, no founder photo, footer-legal runs full width.

## Verdicts

| Page | Result |
|---|---|
| /for-plumbers/ | FAIL (2 copy truths, 1 voice) |
| /for-hvac/ | FAIL (3 copy truths, 1 voice) |
| /404.html | FAIL (1 layout, 1 small) |
| / (round 2) | FAIL (2 copy truths). All nine round 1 fixes landed. |

## Failures, with the fix

1. **Trade page transcripts don't use the demo greeting word for word.** Same failure round 1 caught on the homepage, now on the new pages. All four greet with "Hollow Creek Plumbing and Heating, after-hours answering service. What's going on?" The desk never says "What's going on?" after the name, and anyone who calls (715) 665-5255 hears the demo heads-up. Lines: `for-plumbers/index.html:170`, `:204`; `for-hvac/index.html:171`, `:205`.
   **Fix:** on the hero transcript (plumbers 170, hvac 171) use the full greeting: "Hollow Creek Plumbing and Heating, after-hours answering service. Quick heads-up: this is a demo. Hollow Creek isn't a real shop, but the desk you're talking to is. Try me like you've got a real problem." On the second transcript (plumbers 204, hvac 205) cut it to "Hollow Creek Plumbing and Heating, after-hours answering service." with nothing added. That's what the homepage does now (index.html:183, :217).

2. **The Spanish gas line is advertised, and the worker says not yet.** `~/Code/stillopen-worker/worker.js` line 33, right above `GAS_SAFETY_LINE_ES`: "Spanish wording needs a native speaker's read before it's advertised." The pages advertise it anyway:
   - `index.html:207` "That line is built in, so it goes first every time, in English or Spanish."
   - `for-hvac/index.html:195` same sentence.
   - `for-hvac/index.html:315` and JSON-LD `:71` "Yes. It answers in English or Spanish, and the gas line goes first in both."
   **Fix:** index 207 and hvac 195: end the sentence at "so it goes first every time." HVAC FAQ, visible and JSON-LD both: "Yes. It answers in English or Spanish." The general "English or Spanish" in Step 3 is a FACTS truth and stays. Put "in both" back once a native speaker has read the Spanish line and Cole says so.

3. **Gas FAQ paraphrases the safety line and writes "911".** All three pages, visible and JSON-LD: "it tells them to get everyone out, not to flip any switches, and to call the gas company or 911 once they're outside." It drops "or use anything electric" and isn't the line. The brief says any gas line is word for word with "nine one one". Lines: `index.html:57`, `:348`; `for-plumbers/index.html:70`, `:310`; `for-hvac/index.html:68`, `:303`.
   **Fix:** replace the first sentence of that answer, in the `<p>` and the JSON-LD `text` both, with: `Before anything else, it says: "Get everyone out of the house right now. Don't flip any switches or use anything electric on the way out. Once you're outside, call the gas company or nine one one."` Keep the rest ("That line is built in ... only transfers on a yes."). Rerun the FAQ match script after.

4. **404 page jams into the footer.** Main content ends 8px above the steel band at 375, 768 and 1280 (measured: last element bottom to `.site-footer` top = 8px). Round 1 took the footer's top margin out, and `.lost` isn't a `.section`, so it never gets the bottom gap. Visible in `404-375.png`, `404-768.png`, `404-1280.png`.
   **Fix:** `404.html:20` change `.lost { padding-top: var(--s7); padding-bottom: var(--s2); }` to `padding-bottom: var(--section-gap);`.

5. **Voice, plumbers.** `for-plumbers/index.html:194` "and the first shop that answers usually gets the job." That's a claim with nothing behind it, said like a fact.
   **Rewrite:** "That guy isn't leaving a voicemail. He's going down the list on his phone until somebody picks up, and I'd bet the first one that does gets the job."

6. **Voice, HVAC hero.** `for-hvac/index.html:154` "No heat, it gets the name, number and address and puts them first in line. Gas smell, it tells them to get out before it asks anything else." Reads like shorthand on a form, not a guy talking.
   **Rewrite:** "After four rings, the desk I built picks up as your shop. No heat? It gets the name, number and address and puts them first in line. Smell gas? It tells them to get out before it asks anything else. You get the details by email."

7. **404 footer has no Home link.** Trade pages list Home first under Pages; the 404 (`404.html:120-125`) doesn't, and it's the one page where somebody's lost.
   **Fix:** add `<li><a href="/">Home</a></li>` as the first item in that list.

## Round 1 recheck (homepage)

| Round 1 item | Now |
|---|---|
| 1. Chat widget | Kept, foreman decision. Not failed. |
| 2. Morning report "fills in" | Fixed, index.html:277. |
| 3. Demo greeting | Fixed, :183 full greeting, :217 first sentence only. |
| 4. Footer legal rule | Fixed, `max-width: none`, runs full width at 768/1280/1440. |
| 5. Double gap above footer | Fixed. Gap now 48 / 64 / 96px at 375 / 768 / 1280. |
| 6. Report zeros at 768 | Fixed, all three zeros on one baseline in index-768.png. |
| 7. Safety line weight | Fixed, 600. |
| 8. Inline phone links | Fixed, `p .link-call { display: inline }`. |
| 9. Footer notes double spaced | Fixed. |
| Optional nit, meta description "gets the job on the books" | Still there, index.html:7. Still optional: "puts the job first in line". |

## Passes, with evidence

**Hard locks (all four pages and assets/site.css)**
- Every hex in the files: #f5f3ee, #ffffff, #1c1f22, #4a5259, #d6d2c8, #7d838a, #f97316, #ea580c, #ad3a0a, #2b3036, #b8bec4. No rgb(), rgba(), hsl(). Orange is only #f97316, hover #ea580c, and #ad3a0a for small text (404 `.lost-code`, transcript Desk labels, step labels). PASS.
- No gradient, backdrop-filter, blur, filter, box-shadow, text-shadow, Inter, purple or violet. PASS.
- Icons: every `<use href>` id is a defined inline `<symbol>` with a Lucide path on every page, none missing, none unused. 404 adds arrow-right and construction. PASS.
- No `<img>`, no background-image, no `_hf`, no cole-founder-portrait.jpg. No photos of people. PASS.

**Copy truths**
- "text" as a promise: none. Only hits are CSS properties, comments and the JSON-LD `"text"` key. PASS.
- Arrival window or time promise: none. Every booking close is "You're first in line for the next opening, and the owner will call to confirm the time." word for word (index 191, plumbers 178 and 212, hvac 179). PASS.
- Testimonials, reviews, invented stats: none. Numbers on the pages are price, 48 hours, 30 days, four rings, 1 to 5 trucks, 60 miles, honest zeros, and caller details inside labeled samples (555 numbers). PASS, except the "usually gets the job" line in failure 5.
- Samples labeled: 2 transcripts and 2 "Sample" tags on each of index, plumbers, hvac. PASS.
- Gas transcript line on hvac (207) and index (219) matches FACTS exactly with "nine one one", 600 weight; transfer offer "Want me to connect you to the on-call tech?" matches; transfer only after a yes. PASS. The FAQ paraphrase fails, see 3.
- Price: $497 to go live, $197 a month, cancel any time, live in 48 hours, 30-day money back, pay online, no sales call. Same on all three selling pages. Trade pay links carry `?client_reference_id=for-plumbers` and `=for-hvac`. Stripe link answers 200. PASS.
- "Call #1, not yet." present on index (371), plumbers (329), hvac (330). PASS.
- HVAC hero line "It answers as a plumbing and heating shop, so tell it your furnace quit. The shop's made up. The desk isn't." is a variant of the FACTS line, but true to what the demo says. PASS.

**Dashes**
- U+2014 and U+2013, plus `&mdash;` `&ndash;` `&#8212;` `&#8211;`, across all four pages and site.css: zero hits. PASS.

**Voice**
- No seamless, leverage, solution, empower, unlock, streamline, elevate, robust, 24/7, standalone AI, effortless, hassle in visible copy on any page. Everything else reads like Cole. Only flags are 5 and 6.

**Numbers**
- `tel:+17156655255` and `tel:+19203326113` on every page at every width. PASS.
- Demo number on the first screen at 375 (812 tall): header button, plus the big button at top 409 / bottom 515 on index, 436 / 542 on both trade pages, 416 / 522 on the 404. PASS.

**FAQ JSON-LD vs visible text (scripted)**
- index 6 / 6, plumbers 6 / 6, hvac 6 / 6, character for character, zero mismatches. 404 has no FAQ. PASS. Any copy fix to an FAQ answer (failures 2 and 3) has to land in both places.

**Layout**
- Horizontal overflow: 0px on all four pages at 375, 768, 1280, 1440. PASS.
- 768: scripted check for intersecting text boxes (p, h1-h3, a, spans, summary, tags), FAQ closed and all open, on index, plumbers, hvac at 375, 768, 1280: zero overlaps. Nothing with overflow hidden is clipping. Open FAQ chevrons rotate clean. PASS (404 bottom gap is failure 4).
- 1280 and 1440: two-column hero on all four pages, h1 and transcript tops aligned at 129px on index and both trade pages; second section is copy left, transcript right; steps three across; price is one card; content capped at 1200px and centered at 1440. Widest reading text inside main is 65ch at 1280 (`.hero-alt`). PASS.
- Fixed chat bubble sits over the right end of a line at 375 and 768 (hero-who on the trade pages, the Home row arrow on the 404). Widget is a foreman keep, so noted, not failed.

**Console and requests**
- Console errors: none on any page at any width. Failed requests: none.

**Links (curl and fetch against 127.0.0.1:8765)**
- Every internal href and src on all four pages answers 200: `/`, `/app-icon.png`, `/assets/site.css`, `/for-plumbers/`, `/for-hvac/`, `/privacy.html`, `/terms.html`. 404's legacy redirect target `/demo/builder/` answers 200.
- Anchors: same-page `#main`, `#how`, `#price`, `#faq` exist on each page that uses them; `/#how`, `/#price`, `/#founder`, `/#faq` (404 header, trade "Who built it" and "More about me") all exist on the homepage. PASS.

## Side note, not a page failure

"That line is built in, so it goes first every time" is backed by the local worker source (`GAS_SAFETY_LINE`, `gasOpen()`). Claude.md still lists the hard-coded gas rule as blocker 3 and says the last deploy was 2026-10-14, while the worker repo's latest commit (2026-11-02 23:17) talks about a live main. Somebody should confirm what's actually deployed before these pages ship.
