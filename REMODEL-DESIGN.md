# Remodel design decision

Written 2026-11-02, overnight, by the design research step. Nobody was awake to ask, so this decides and says why. Hard locks in `Claude.md` win over anything here.

## What four competitors show tonight

Fetched live 2026-11-02 with the local crawler (markdown plus a 1366px screenshot of each homepage). Colors are described as seen in the screenshots; no hex values were measured, so none are given.

| Site | Palette as seen | Headline | Primary CTA | Price on homepage |
|---|---|---|---|---|
| avoca.ai | Pale blue-gray page, white panels, mid blue accent on buttons and headline words, black all-caps headline, faint blueprint grid | "The AI Front Office for Service Businesses" | Book a Demo (second: Talk to our AI) | No |
| goodcall.com | Dark navy hero, white type, aqua/teal buttons, off-white sections below | "Your AI voice agent answers every call." | Talk to Gabi | Yes, lower down: "Plans start at $79 a month." |
| heyrosie.com | White fading to pale lavender, purple buttons and links, dark purple headline, blue-to-purple gradient hero panel | "The easiest AI answering service for small business" | Start My Free Trial | Yes, in the hero: "Starting at $49/month." Full table $49 / $149 / $299 |
| dialzara.com | Off-white with faint ruled lines, near-black headline, violet buttons and demo number | "The AI Receptionist Who Never Misses A Call" | Start Free Trial (also Book a Demo) | Yes, table: $29 / $99 / $199 / $349 a month |

What changed since April: three of these four now show price on the homepage, and Dialzara puts a live demo number (866-545-ZARA) in its hero. "Price on the page" and "a number you can call" are no longer ours alone. What's still open: nobody is local, nobody is plumbing and heating only, nobody names a founder with a trade, nobody charges one flat price with no minute caps, and nobody leads with what happens when somebody smells gas. Nobody runs a work-site palette either: it's blue, navy, teal, purple and violet across the board.

## The decision

**Base: bone and steel, light.** Bone page, white cards, steel-black type, safety orange as the one accent. A dark steel band is allowed for the footer only.

Why light, when the current site is dark: the guy reading this is 50, on a phone, in a truck, often in daylight. Dark type on a light page holds up in glare; a dark page with thin light type turns into a mirror. Light also lets the orange read like what it is on a job site: a warning color on a plain background, not neon on black. And it gets us off Goodcall's dark navy look.

**Headline face: Barlow Condensed** (600, 700). Narrow, flat, built off highway-sign lettering. It fits a big phone number on one line at 375px and looks like it belongs stenciled on a truck door.

**Body face: Source Sans 3** (400, 600, 700). Humanist, open letters, plain. Easy at 18px on a cracked phone. Tabular numbers for times and prices.

No third font. Transcript labels use Barlow Condensed in caps. Manrope and JetBrains Mono retire with the old homepage.

**Orange rules, computed (WCAG 2.x relative luminance):**
- `#f97316` on bone `#f5f3ee` is 2.53:1. Fails for any text. Orange is for fills, bars and icons, never for words on the light base.
- Small orange text uses `#ad3a0a`: 5.59:1 on bone, 6.20:1 on white. Passes AA for normal text with room to spare.
- Primary button: orange fill with ink `#1c1f22` text is 5.91:1. Passes AA at any size. White text on orange is 2.80:1 and fails even large-text AA, so never white on orange.
- Hover fill `#ea580c` with ink text is 4.65:1. Still passes.
- The orange fill against bone is only 2.53:1, so the primary button carries a 2px ink border (14.93:1) to meet the 3:1 rule for component edges.
- Orange `#f97316` on the steel footer `#2b3036` is 4.75:1, so orange words are allowed there.

## Token sheet

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

```css
:root {
  /* color: contrast vs --base noted */
  --base: #f5f3ee;          /* bone page */
  --surface: #ffffff;       /* cards, transcript */
  --ink: #1c1f22;           /* 14.93:1 */
  --ink-muted: #4a5259;     /* 7.17:1, 7.95:1 on white */
  --rule: #d6d2c8;          /* dividers only, decorative */
  --rule-strong: #7d838a;   /* input and card borders, 3.45:1 */
  --orange: #f97316;        /* fills, bars, icons. Never text on light */
  --orange-hover: #ea580c;
  --orange-text: #ad3a0a;   /* small orange text, 5.59:1 */
  --steel: #2b3036;         /* footer band only */
  --on-steel: #f5f3ee;      /* 12.00:1 on steel */
  --on-steel-muted: #b8bec4;/* 7.09:1 on steel */
  --focus: #1c1f22;         /* ring on light; use --on-steel in footer */

  /* type */
  --font-head: "Barlow Condensed", "Arial Narrow", sans-serif;
  --font-body: "Source Sans 3", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  /* space: 4px steps */
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 24px;
  --s6: 32px; --s7: 48px; --s8: 64px; --s9: 96px; --s10: 128px;

  --measure: 65ch;
  --content-max: 1200px;
  --radius-sm: 2px;         /* tags, inputs */
  --radius: 4px;            /* buttons, cards. Nothing rounder */
  --tap: 52px;              /* min button height, gloves and thumbs */
}
```

**Type scale** (phone 375 / desktop 1280+; interpolate with `clamp()` between):

| Role | Font, weight | Phone | Desktop | Line height |
|---|---|---|---|---|
| h1 | Barlow Condensed 700 | 40px | 72px | 1.0 |
| Demo number | Barlow Condensed 700, tabular | 44px | 64px | 1.0 |
| h2 | Barlow Condensed 700 | 32px | 48px | 1.05 |
| h3 | Barlow Condensed 600 | 24px | 28px | 1.15 |
| body | Source Sans 3 400 | 18px | 20px | 1.55 |
| small | Source Sans 3 400 | 16px | 16px | 1.5 |
| label (transcript, eyebrow) | Barlow Condensed 600, caps, 0.08em tracking | 16px | 16px | 1.2 |

Nothing under 16px except the legal line in the footer (15px). Headlines in sentence case; caps only for labels. Body text never wider than `--measure`.

**Buttons.** Both: `min-height: var(--tap)`, padding 14px 24px, Barlow Condensed 700 22px, `border-radius: var(--radius)`, Lucide `phone` icon 20px left of the label on call buttons, full width under 768px.
- Primary: `background: var(--orange); color: var(--ink); border: 2px solid var(--ink)`. Hover `--orange-hover`. Label is a verb plus the number: "Call (715) 665-5255". It is a `tel:` link.
- Secondary: `background: transparent; color: var(--ink); border: 2px solid var(--ink)`. Hover: ink fill, bone text.
- Focus, everything: `outline: 3px solid var(--focus); outline-offset: 3px`. Never remove it.

**Transcript block.** The proof, so it has to read like a call slip, not a chat app.
- Box: `--surface` fill, 1px `--rule-strong` border, 4px solid `--orange` left edge, `--radius`, padding 20px phone / 28px desktop. No bubbles, no avatars, no shadows.
- Header row: a "Sample" tag (label style, ink on bone, 1px `--rule-strong` border, `--radius-sm`), then the scene in small muted text: "Tue, 10:12 PM. No heat." A real call later swaps the tag to "Real call" plus the date, and nothing else.
- Rows: CSS grid, label column 64px phone / 80px desktop, then the line. "Caller" label in `--ink-muted`, "Desk" label in `--orange-text`. Line text is body size, `--ink`. 1px `--rule` between rows, 12px padding.
- The gas sample uses the same block. The safety line ("nine one one") is set in 600 weight, not colored.

**Icons.** Lucide inline SVG only, `stroke="currentColor"`, stroke-width 2, 20 or 24px. Orange only as a fill bar or icon, never as decoration.

## Layout

- **375:** one column, 16px side gutters. Hero order: h1, one line of plain claim, primary call button full width, the line "It answers as a plumbing shop. The shop's made up. The desk isn't.", then the no-heat transcript. Sections 48px apart. No horizontal scroll at any width.
- **768:** one column, 24px gutters, text held to `--measure`, transcript max 600px wide, buttons sit side by side at natural width. Sections 64px apart.
- **1280:** hero is two columns inside `--content-max`: claim, number and buttons left (7 of 12), transcript right (5 of 12), tops aligned. 32px gutters, 48px column gap. Sections 96px apart. Price block is a single card, not a three-tier table: one price, one guarantee.
- **1440:** same as 1280. Content stays capped at 1200px and centered; bone fills the sides. Nothing stretches, type does not grow past the desktop sizes.
- Photo: only `cole-founder-portrait.jpg`, in the founder section, no filters, `--radius`. Empty honest blocks everywhere else (the call log stays "Call #1, not yet").
- Provenance flag on that portrait: a byte-identical copy sits in `drafts/leonardo-downloads/`, next to `medspa-hero.jpg` and `photographer-hero.jpg`. Leonardo is an AI image tool. The brief calls it a real photo, but Cole confirms before it ships. If he can't, the founder section goes text-only.
- Footer: `--steel` band, `--on-steel` text, orange allowed for links there.

## Not allowed (restating the locks)

Purple or violet anywhere. Gradients as decoration. Glassmorphism, blur panels, floating blobs, glow. Inter as primary. Stock headsets, call-center smiles, AI people, or the `assets/trade-heroes/*_hf.jpg` photos. White text on orange. Orange text on bone or white at `#f97316`.
