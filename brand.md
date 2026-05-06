# WalkPerro — Brand System v1

> The operator's hub for the AI/vibe-coding era.
> Brutalist-tech. Bone, charcoal, signal yellow. Faceless beacon.

## Color tokens

--bone:      #F5F1E8   /* primary background */
--charcoal:  #0E0E0E   /* primary text, dark surfaces */
--signal:    #EBFF00   /* accent — use sparingly, ONCE per viewport */
--ink:       #1A1A1A   /* secondary dark surface */
--smoke:     #6B6B6B   /* muted text, metadata */
--line:      #E5E0D2   /* hairlines on bone */
--line-dark: #2A2A2A   /* hairlines on charcoal */

Rules: No gradients (except mask-image edge fades). No drop shadows. No rounded corners over 2px. Use hairline borders for hierarchy.

## Type
- Display + body serif: Instrument Serif (Google Fonts)
- Mono / UI: JetBrains Mono (Google Fonts)
- Display tracking: -0.04em on display-xl (Instrument runs wide, needs squeeze)
- Headings: Instrument Serif, tight leading, negative tracking
- Labels/timestamps: JetBrains Mono uppercase, 0.08em tracking

## Scale

display-xl   4.5rem   / 0.95  / -0.04em   serif
display-lg   3rem     / 1.0   / -0.02em   serif
heading      1.5rem   / 1.15  / -0.01em   serif
body         1rem     / 1.6   /  0        serif
mono-sm      0.8125rem/ 1.4   /  0        mono uppercase
label        0.75rem  / 1.2   /  0.08em   mono uppercase

## Voice
First person. Specific over clever. No hype words ("game-changer", "unlock", "10x", "leverage"). No emojis. One opinion per piece, defended.

## Brand checklist (must pass before commit)
1. Signal yellow used in exactly ONE place per viewport
2. All section headers use `// 0X — LABEL` mono pattern
3. Asymmetric layouts (not lazily centered)
4. No drop shadows, gradients, or rounded corners over 2px
5. All labels mono uppercase, all headings Instrument Serif
6. Marquee fade goes to bone (#F5F1E8) via mask-image
