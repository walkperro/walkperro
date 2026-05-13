# WalkPerro Social Slide Format

Format reverse-engineered from the existing post #1 ("What a time to be alive") and post #2 ("No pain, no profit") slide carousels in `Google Drive → WalkPerro → Social Posts`.

## Canvas

- **Dimensions**: 1080 × 1350 px (4:5 vertical — Instagram feed-native, also works for LinkedIn)
- **Color palette**:
  - `signal` `#EBFF00` — primary background on cover / CTA / header / footer bands
  - `charcoal` `#0E0E0E` — primary body band background; primary text color on signal
  - `bone` `#F5F1E8` — body text color on charcoal
- **Typography**:
  - **Mono labels**: JetBrains Mono — `walkperro` header (lowercase), slide counter (`01 / 08`), `// FIELD NOTE` / `// BUILD LOG`, `FOR THE ONES WHO DO.` footer, `@WALKPERRO` handle, `walkperro.com / log`
  - **Display serif**: Instrument Serif (or close equivalent) — all hook lines, quotes, big text. Used in both regular and italic.
- **Hairline rules**: 1–2px solid charcoal underline below the header band, and above the closing block on CTA slides.

## Slide types

### 1. Cover slide
Full-bleed signal yellow. Big serif hook. Used as slide 01 of every carousel.

```
┌───────────────────────────────────────┐
│ walkperro                    01 / 08  │  ← mono header
│ ───────────────────────────────────── │  ← hairline
│ // FIELD NOTE                         │  ← category label
│                                       │
│                                       │
│   You don't need a degree.            │  ← serif hook, large (~120pt)
│   You need a prompt.                  │
│                                       │
│                                       │
│                                       │
│         FOR THE ONES WHO DO.          │  ← mono footer, centered
└───────────────────────────────────────┘
```

Background: signal yellow. Text: charcoal.

### 2. Body slide (banded)
Three horizontal bands. Used for slides 02 → N-1.

```
┌───────────────────────────────────────┐ ← SIGNAL band (~20%)
│ walkperro                    02 / 08  │
│ ───────────────────────────────────── │
│ // FIELD NOTE                         │
├───────────────────────────────────────┤ ← CHARCOAL band (~65%)
│                                       │
│   It used to be that by a certain     │  ← serif body in bone, ~58pt
│   age, you had to choose what you     │
│   wanted to be for the rest of your   │
│   life.                               │
│                                       │
│   Now you don't.                      │  ← serif punchline
│                                       │
├───────────────────────────────────────┤ ← SIGNAL band (~15%)
│         FOR THE ONES WHO DO.          │
└───────────────────────────────────────┘
```

Variant: include a sub-section label inside the charcoal band, e.g.:

```
   // THE PROMPT
   "Hey Claude, go scrape data from Reddit
   and find an opportunity..."
```

### 3. CTA slide (final)
Full-bleed signal yellow again. Hook + italic sub-line + handle/URL block + footer.

```
┌───────────────────────────────────────┐
│ walkperro                    07 / 07  │
│ ───────────────────────────────────── │
│ // BUILD LOG                          │
│                                       │
│   Want the bot?                       │  ← serif hook
│                                       │
│   Drop a comment.                     │  ← italic serif sub
│   I'll share the link.                │
│                                       │
│ ───────────────────────────────────── │  ← bottom hairline
│ @WALKPERRO                            │  ← mono handle (bold)
│ walkperro.com / log                   │  ← mono URL
│         FOR THE ONES WHO DO.          │
└───────────────────────────────────────┘
```

## Anatomy invariants (must match every slide)

1. **Header row** (top): `walkperro` (left, mono lowercase, ~28pt) + `NN / TOTAL` (right, mono, ~28pt)
2. **Hairline** under header (1.5px solid charcoal on signal bg; bone on charcoal bg)
3. **Category label** under hairline: `// FIELD NOTE` or `// BUILD LOG` or `// ESSAY` (mono uppercase bold, ~22pt)
4. **Footer**: `FOR THE ONES WHO DO.` (mono uppercase bold, ~24pt, centered)
5. **Margins**: ~60–80px outer padding all sides

## Carousel composition rules

- **Slide 1**: cover (hook line — punchier than any body slide; not a verbatim quote)
- **Slides 2 → N-1**: body slides, each pulling ONE idea from the post (quote or paraphrase). Mix in 1–2 sub-section labels (`// THE PROMPT`, `// WHAT CLAUDE BUILT`) for visual rhythm.
- **Slide N (CTA)**: yellow cover variant with handle + URL block
- **Total per carousel**: 7–8 slides has been the standard

## Voice rules (carried from brand.md)

- First person where it fits.
- One idea per slide.
- Specific over clever. No hype words ("game-changer", "unlock", "10x", "leverage").
- No emojis.
- Pull quotes are 1–3 short sentences max — Instagram-readable at thumbnail size.

## Input schema (for generator)

```json
{
  "category": "FIELD NOTE",
  "slug": "what-a-time-to-be-alive",
  "slides": [
    { "type": "cover", "hook": "You don't need a degree.\nYou need a prompt." },
    { "type": "body",  "text": "It used to be that by a certain age, you had to choose what you wanted to be for the rest of your life.\n\nNow you don't." },
    { "type": "body",  "text": "...", "sublabel": "// THE PROMPT" },
    { "type": "cta",   "hook": "Want the bot?", "sub": "Drop a comment.\nI'll share the link.", "handle": "@WALKPERRO", "url": "walkperro.com / log" }
  ]
}
```

## Generator implementation notes

Two viable paths:

1. **SVG + sharp** (lightweight, no browser). Build SVG strings from a template, render with `sharp().resize(1080, 1350).png()`. Fonts loaded via `@font-face` data-URLs (Instrument Serif Regular/Italic + JetBrains Mono Regular/Bold). Fast, deterministic.

2. **Satori + sharp** (JSX-style). Vercel's `satori` library renders React-like nodes to SVG. Better for complex auto-layout. Same downstream PNG path via sharp.

Pick (1) for control + simplicity. The slide templates are simple enough that hand-rolled SVG is the right level.

## Pipeline (end-to-end)

```
post markdown
     │
     ▼
 [draft hook + 6-8 pull-quotes]
     │
     ▼
 slides.json  ◄── reviewed/edited by hand
     │
     ▼
 node scripts/make-slides.mjs slides.json
     │
     ▼
 out/<slug>/slide-01.png … slide-NN.png
     │
     ▼
 node scripts/send-telegram.mjs --photos-dir out/<slug>  (review on phone)
     │
     ▼
 IG post (manual upload or future API integration)
```
