# StillOpen

24/7 AI front desk for home services trades.

**Your sign says closed. StillOpen stays open.**

## Status

Day 1 of build. Fork from the HomeEdge codebase, stripped of real-estate logic, being rebuilt for plumber owner-operators. Day 7 target: first working demo on a test plumber page.

## Architecture

- **Frontend:** Static HTML + vanilla JS (chat widget is a standalone embed script).
- **Backend:** Single Cloudflare Worker (`worker.js`), deployed via Wrangler. Not checked into git — lives on disk and on Cloudflare only.
- **State:** Cloudflare KV namespace for per-plumber knowledge base, OAuth tokens, bookings, rate limiting.
- **Auth:** Clerk (new StillOpen-specific application).
- **Payments:** Stripe. Day 7 demo uses a single StillOpen account; Stripe Connect for per-plumber payouts is a week-2 upgrade.
- **Calendar:** Google Calendar OAuth, per-plumber refresh token stored in KV.
- **LLM:** Anthropic Claude. Haiku 4.5 for Day 7 demo; Haiku/Sonnet routing logic in week 2.
- **Email:** Resend for owner notifications and cold outreach.
- **CRM:** GoHighLevel for lead pipeline.

## Local dev

```bash
npm install
npx wrangler dev --local
```

Local dev uses in-memory KV and does not touch the production Cloudflare KV namespace.

## Secrets

All secrets are stored in Cloudflare Workers secrets via `wrangler secret put`. Never committed. Never written to files on disk. Never pasted into shell history.

Required secrets for full functionality (added incrementally as each integration comes online):

- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLERK_SECRET_KEY`
- `GHL_API_TOKEN`
- `RESEND_API_KEY`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`

## Deploy

**Do not run `wrangler deploy` until the `wrangler.toml` KV namespace id has been replaced with a StillOpen-specific namespace.** See the warning block in `wrangler.toml`.

## License

Proprietary. All rights reserved.
