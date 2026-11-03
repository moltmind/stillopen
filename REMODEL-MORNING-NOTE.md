# Morning, Cole

1. Preview on your phone: https://remodel.stillopen-preview.pages.dev (homepage first, then /for-hvac/, /for-plumbers/).
2. Look first at the top screen: the demo number (715) 665-5255 is the big button. Then the no-heat and gas sample calls.
3. Light bone and steel now, not dark. Safety orange on buttons only. Fonts: Barlow Condensed headlines, Source Sans 3 body. Competitors went blue, navy, purple.
4. I left your portrait off. cole-founder-portrait.jpg is byte for byte the same file as one in drafts/leonardo-downloads (AI image tool). If it's a real photo of you, say so and it goes back in with one line.
5. Morning report sample labels ("Calls caught", "On the list, waiting on you", "Sent to on-call") are my guess. Check them against the real report.
6. The chat bubble still says "Hi, I'm Paul" because pages load it from app.stillopen.ai (the worker). The repo copy is fixed. The live one changes only on a worker deploy, your call.
7. Sample callers, addresses and Cole-voice lines are made up for the samples. Read the founder block out loud and fix anything you wouldn't say.
8. Also decided without you: 20 chat-era pages noindexed and out of the sitemap; old on-page chat demo on the trade pages dropped for the phone number.
9. Lighthouse mobile, homepage: performance 90, accessibility 100.
10. QA: a separate checker failed every page once, mostly exact wording (greeting, gas line). All fixed; the final fixes got a mechanical check (no dashes, no "911" digits, both numbers on every page) but no last full QA pass. Reports in remodel-qa/.
11. Spanish: pages say it answers in English or Spanish (per the brief), but the Spanish gas line isn't advertised until a native speaker reads it.
12. Put it live: cd ~/Code/stillopen && git checkout main && git merge remodel-2026-11 && git push origin main  (the REMODEL-*.md notes and remodel-qa/ ride along to the public site; say the word and I strip them first)
