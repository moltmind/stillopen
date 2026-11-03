# Remodel tasks, night of 2026-11-02

Branch: `remodel-2026-11`. Never pushed to main tonight. Resume from the first unchecked box.
Preview: https://remodel.stillopen-preview.pages.dev (rebuild + deploy: `bash scripts/build-preview.sh`)

## Setup
- [x] 1. Brain start, read Claude.md, copy brief to REMODEL-BRIEF.md, read competitor-brief.md
- [x] 2. Branch remodel-2026-11
- [x] 3. This task file
- [ ] 4. Preview pipeline: scripts/build-preview.sh, Pages project stillopen-preview created (free), first deploy done, curl 200 confirmed

## Research
- [ ] 5. Competitor homepages (avoca, goodcall, heyrosie, dialzara), palette and type decision in REMODEL-DESIGN.md

## Build
- [ ] 6. index.html (phone + desktop, sections in brief order)
- [ ] 7a. for-plumbers/index.html
- [ ] 7b. for-hvac/index.html (leads with no heat and the gas rule)
- [ ] 8a. 404.html in the new system
- [x] 8b. noindex on the 20 chat-era vertical pages: for-appliance-repair, for-auto-repair, for-cleaning, for-dental, for-electricians, for-garage-door, for-handyman, for-lawn-care, for-locksmith, for-medspas, for-movers, for-painters, for-pest-control, for-photographers, for-pool-service, for-restoration, for-roofers, for-towing, for-tree-service, for-veterinary
- [x] 8c. chatbot.js: no bubble label said Paul; sales-mode greeting dropped "I'm Paul", sales-mode header now "Ask the desk". Shop and demo modes untouched.
- [ ] 9. Copy truths sweep on every touched page (no text promises, no arrival windows, no testimonials, no fake numbers, no em-dashes)

## QA
- [ ] 10a. QA index (screens 375/768/1280/1440 in remodel-qa/)
- [ ] 10b. QA for-plumbers
- [ ] 10c. QA for-hvac
- [ ] 10d. QA 404
- [ ] 11. Lighthouse mobile on index (target 90 perf / 95 a11y)

## Finish
- [ ] 12. Final preview deploy, REMODEL-MORNING-NOTE.md, push branch to origin
- [ ] 13. Brain: decide lines, card next_move, index, check
