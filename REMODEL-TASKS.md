# Remodel tasks, night of 2026-11-02

Branch: `remodel-2026-11`. Never pushed to main tonight. Resume from the first unchecked box.
Preview: https://remodel.stillopen-preview.pages.dev (rebuild + deploy: `bash scripts/build-preview.sh`)

## Setup
- [x] 1. Brain start, read Claude.md, copy brief to REMODEL-BRIEF.md, read competitor-brief.md
- [x] 2. Branch remodel-2026-11
- [x] 3. This task file
- [x] 4. Preview pipeline: scripts/build-preview.sh, Pages project stillopen-preview created (free), first deploy done, curl 200 confirmed

## Research
- [x] 5. Competitor homepages (avoca, goodcall, heyrosie, dialzara), palette and type decision in REMODEL-DESIGN.md

## Build
- [x] 6. index.html (phone + desktop, sections in brief order)
- [x] 7a. for-plumbers/index.html
- [x] 7b. for-hvac/index.html (leads with no heat and the gas rule)
- [x] 8a. 404.html in the new system
- [x] 8b. noindex on the 20 chat-era vertical pages: for-appliance-repair, for-auto-repair, for-cleaning, for-dental, for-electricians, for-garage-door, for-handyman, for-lawn-care, for-locksmith, for-medspas, for-movers, for-painters, for-pest-control, for-photographers, for-pool-service, for-restoration, for-roofers, for-towing, for-tree-service, for-veterinary
- [x] 8c. chatbot.js: no bubble label said Paul; sales-mode greeting dropped "I'm Paul", sales-mode header now "Ask the desk". Shop and demo modes untouched.
- [x] 9. Copy truths sweep on every touched page (no text promises, no arrival windows, no testimonials, no fake numbers, no em-dashes)

## QA
- [x] 10a. QA index: round 1 FAIL (9 fixes, a90ddfc), round 2 FAIL (gas FAQ wording, 066c4eb). Fixes not re-verified by a third pass.
- [x] 10b. QA for-plumbers: round 1 FAIL, fixed ab56fdd, not re-verified
- [x] 10c. QA for-hvac: round 1 FAIL, fixed ab56fdd, not re-verified
- [x] 10d. QA 404: round 1 FAIL, fixed 0da9ee5, not re-verified
- [x] 11. Lighthouse mobile on index (preview, a90ddfc): performance 90, accessibility 100, best practices 100, SEO 66 only from the preview noindex header. LCP 3.0 s, TBT 0 ms, CLS 0.001.

## Finish
- [x] 12. Final preview deploy, REMODEL-MORNING-NOTE.md, push branch to origin
- [x] 13. Brain: decide lines, card next_move, index, check
