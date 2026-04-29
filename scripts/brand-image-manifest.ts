// Prompts consumed by scripts/generate-brand-images.ts.
// Aspect ratios are passed via the API (generationConfig.imageConfig.aspectRatio), not via prompt.

export interface BrandImageSpec {
  slug: string;
  /** Output goes to public/brand/<slug>.webp (and .png cached in scripts/.cache/brand). */
  aspectRatio:
    | "1:1"
    | "3:2"
    | "2:3"
    | "4:3"
    | "3:4"
    | "16:9"
    | "9:16"
    | "4:5"
    | "5:4"
    | "21:9"
    | "1:4"
    | "4:1"
    | "1:8"
    | "8:1";
  prompt: string;
  model?: "gemini-3-pro-image-preview" | "gemini-3.1-flash-image-preview";
  postProcess?: {
    /** Final webp width(s) to emit. */
    widths: number[];
    /** Sharp webp quality. */
    quality?: number;
  };
}

const PALETTE_NOTE =
  "Palette: warm bone background (#F2EFE8), warm near-black (#0E0E0C), restrained oxblood accent (#5A0E0E). No neon, no purple gradients, no generic SaaS aesthetic.";

const STYLE_NOTE =
  "Editorial fashion-meets-tech: Yeezy / Fear of God / Off-White meets Linear / Vercel / Arc Browser. Minimalist, confident, slightly raw. High contrast. Generous negative space. Subtle paper-grain texture. Fine-art photography sensibility.";

export const brandImages: BrandImageSpec[] = [
  {
    slug: "logo-primary",
    aspectRatio: "1:1",
    model: "gemini-3-pro-image-preview",
    prompt: `Logo design for a tech-design studio called "WalkPerro". A minimalist, confident wordmark "WalkPerro" set in an elegant editorial serif (Instrument Serif aesthetic), paired with a tiny abstract dog-head silhouette mark to the left — geometric, simple, almost like a single brushstroke or stamp. Black ink on bone-white paper. Single page composition. The mark feels hand-drawn but disciplined, like a fashion-house logotype. Centered. Generous whitespace. Square format. ${PALETTE_NOTE} ${STYLE_NOTE}`,
    postProcess: { widths: [2048, 1024, 512], quality: 90 },
  },
  {
    slug: "logomark",
    aspectRatio: "1:1",
    model: "gemini-3-pro-image-preview",
    prompt: `A minimal abstract logomark of an alert dog's head — simple geometric silhouette, viewed from the side or three-quarter angle, ears up, nose forward. Solid black on bone-white. The shape reads as a single confident stroke, not detailed illustration. Inspired by Aimé Leon Dore's apparel labels and Off-White's stencil work. Centered, square crop, generous whitespace around the mark. No wordmark, no text, just the symbol. ${PALETTE_NOTE} ${STYLE_NOTE}`,
    postProcess: { widths: [1024, 512, 192, 32], quality: 92 },
  },
  {
    slug: "og",
    aspectRatio: "16:9",
    model: "gemini-3-pro-image-preview",
    prompt: `Open Graph social-share image for a design-and-engineering studio called WalkPerro. Composition: warm bone-paper background filling the frame, a small black dog-head mark in the upper-left corner, and a strong oversized editorial serif headline reading "Websites and tools that make money." in warm near-black, with the words "make money" set in italic oxblood. Below the headline, a thin oxblood horizontal rule and the word "WalkPerro" in monospaced lowercase. The whole image feels like a single editorial page — Yeezy season campaign meets Linear product page. Crisp, restrained, generous margins. 16:9 aspect, social-card composition. ${PALETTE_NOTE} ${STYLE_NOTE}`,
    postProcess: { widths: [1200], quality: 88 },
  },
  {
    slug: "hero-accent",
    aspectRatio: "3:2",
    model: "gemini-3.1-flash-image-preview",
    prompt: `Abstract editorial texture image: a close-up macro photograph of warm-bone-toned heavyweight paper with subtle creases, paper-fiber grain, and a single torn edge running across the frame. Soft directional lighting from the upper-left casts a delicate shadow. Almost monochrome. The kind of texture used as a background element on a Fear of God lookbook. No subject, no figure — just material and light. ${PALETTE_NOTE} ${STYLE_NOTE}`,
    postProcess: { widths: [1600, 800], quality: 78 },
  },
  {
    slug: "studio-still",
    aspectRatio: "4:5",
    model: "gemini-3.1-flash-image-preview",
    prompt: `Still life photograph in editorial fashion-magazine style. Subjects on a warm bone tabletop: a folded sheet of architect's paper, a single mechanical pencil, a small section of dark oxblood leather, and an open hardcover book turned face-down. Soft north-window light from the upper-left. Warm shadows. Minimal composition, generous negative space, slight paper grain. Feels like a quiet moment in a small studio. ${PALETTE_NOTE} ${STYLE_NOTE}`,
    postProcess: { widths: [1200, 600], quality: 80 },
  },
  {
    slug: "ict-bot",
    aspectRatio: "3:2",
    model: "gemini-3-pro-image-preview",
    prompt: `Editorial conceptual image representing an autonomous trading system. Composition: a clean abstract dark monochrome chart-like form on a warm bone background — sharp ascending lines, fine vertical tick marks, a single bold oxblood horizontal rule cutting across one third of the frame. Suggests financial markets, institutional flow, precision instruments — without using any actual stock-chart cliché, no candlesticks, no logos. Reads like a piece of conceptual editorial art rather than a dashboard screenshot. Subtle paper grain texture. 3:2 landscape. ${PALETTE_NOTE} ${STYLE_NOTE}`,
    postProcess: { widths: [1600, 800], quality: 80 },
  },
];
