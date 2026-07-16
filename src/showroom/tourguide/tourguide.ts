// walkperro tourguide — v2.0.0
// ─────────────────────────────────────────────────────────────────────────────
// Shared demo-mode overlay. COPIED into each demo repo by
// walkperro/scripts/sync-tourguide.mjs — edit it THERE (walkperro), never in a
// consumer repo. Zero dependencies.
//
// v2: HOST-ADAPTIVE styling. Instead of hardcoding walkperro's brand, the guide
// reads the host site's own accent color + font at mount time (from CSS custom
// properties, then a prominent button, then a neutral fallback) so the popups
// look like they belong to whatever site they're running on. Pass
// `theme: { accent, font }` to override the auto-detection.
//
// Consumer contract (each demo repo, only when DEMO_MODE=1):
//   import { mountTourguide } from "<repo>/lib/tourguide";
//   mountTourguide({ steps, siteSlug, adminUrl })
// ─────────────────────────────────────────────────────────────────────────────

export type TourStep = {
  selector: string;        // element to spotlight (first match)
  title: string;
  body: string;            // 1–2 sentences
  route?: string;          // optional path to navigate to before showing
};

export type TourguideTheme = {
  accent?: string;         // brand accent; auto-detected from the host if omitted
  font?: string;           // body font; inherits the host's if omitted
};

export type TourguideConfig = {
  siteSlug: string;        // walkperro.com/websites/<siteSlug>
  steps: TourStep[];
  adminUrl?: string;       // where the "check out the admin" nudge points
  accent?: string;         // shorthand for theme.accent
  theme?: TourguideTheme;
};

const LS_DONE = "wp_tg_done";
const LS_EXIT = "wp_tg_exit_shown";

// ── theme resolution ─────────────────────────────────────────────────────────

const ACCENT_VARS = [
  "--site-accent", "--site-cta", "--accent", "--accent-cta", "--color-accent",
  "--brand", "--brand-color", "--primary", "--color-primary", "--flame", "--gold",
];

function readCssVar(names: string[]): string | null {
  const root = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  for (const n of names) {
    const v = (root.getPropertyValue(n) || body.getPropertyValue(n)).trim();
    if (v) return v;
  }
  return null;
}

// Sample a prominent CTA/button's background as an accent guess.
function sampleButtonAccent(): string | null {
  const cands = document.querySelectorAll<HTMLElement>(
    "a[class*='btn'],button[class*='btn'],a[class*='cta'],button[class*='cta'],[class*='button']"
  );
  for (const el of Array.from(cands).slice(0, 8)) {
    const bg = getComputedStyle(el).backgroundColor;
    const rgb = parseRgb(bg);
    if (rgb && rgb.a > 0.5 && !isNearGrey(rgb) && !isNearWhite(rgb)) {
      return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    }
  }
  return null;
}

function parseRgb(s: string): { r: number; g: number; b: number; a: number } | null {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(",").map((x) => parseFloat(x));
  return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
}
function isNearGrey(c: { r: number; g: number; b: number }): boolean {
  const mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b);
  return mx - mn < 16;
}
function isNearWhite(c: { r: number; g: number; b: number }): boolean {
  return c.r > 235 && c.g > 235 && c.b > 235;
}
function luminance(hexOrRgb: string): number {
  let r = 0, g = 0, b = 0;
  const rgb = parseRgb(hexOrRgb);
  if (rgb) { r = rgb.r; g = rgb.g; b = rgb.b; }
  else {
    const h = hexOrRgb.replace("#", "");
    const s = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    r = parseInt(s.slice(0, 2), 16); g = parseInt(s.slice(2, 4), 16); b = parseInt(s.slice(4, 6), 16);
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function contrastText(accent: string): string {
  return luminance(accent) > 0.6 ? "#141414" : "#ffffff";
}

function resolveTheme(cfg: TourguideConfig): { accent: string; onAccent: string; font: string } {
  const accent =
    cfg.theme?.accent || cfg.accent ||
    readCssVar(ACCENT_VARS) || sampleButtonAccent() || "#141414";
  const font =
    cfg.theme?.font ||
    getComputedStyle(document.body).fontFamily ||
    "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  return { accent, onAccent: contrastText(accent), font };
}

function buildCSS(t: { accent: string; onAccent: string; font: string }): string {
  return `
.wp-tg-banner{position:fixed;top:0;left:0;right:0;z-index:99990;background:#141414f2;color:#fff;font-family:${t.font};font-size:13px;letter-spacing:.01em;display:flex;align-items:center;justify-content:center;gap:18px;padding:9px 14px;border-bottom:2px solid ${t.accent};backdrop-filter:saturate(1.2) blur(2px)}
.wp-tg-banner .wp-tg-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:${t.accent};margin-right:7px;vertical-align:middle}
.wp-tg-banner a{color:${t.accent};text-decoration:none;font-weight:600;border-bottom:1.5px solid ${t.accent}}
.wp-tg-banner button{all:unset;cursor:pointer;color:#fff;border:1px solid #ffffff88;border-radius:999px;padding:3px 12px;font-family:${t.font};font-size:12px}
.wp-tg-banner button:hover{background:${t.accent};border-color:${t.accent};color:${t.onAccent}}
.wp-tg-mask{position:fixed;inset:0;z-index:99991;pointer-events:none}
.wp-tg-hole{position:absolute;border-radius:8px;box-shadow:0 0 0 99999px rgba(15,17,21,.66);outline:3px solid ${t.accent};outline-offset:2px;transition:all .28s cubic-bezier(.2,0,0,1)}
.wp-tg-card{position:fixed;z-index:99993;max-width:330px;background:#fff;color:#1a1a1a;border-radius:14px;box-shadow:0 18px 50px -12px rgba(0,0,0,.4),0 0 0 1px rgba(0,0,0,.05);padding:18px 18px 16px;font-family:${t.font}}
.wp-tg-card h4{margin:0 0 7px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:${t.accent}}
.wp-tg-card p{margin:0 0 14px;font-size:14px;line-height:1.55;color:#333}
.wp-tg-row{display:flex;justify-content:space-between;align-items:center;gap:10px}
.wp-tg-count{font-size:12px;color:#9a9a9a;font-variant-numeric:tabular-nums}
.wp-tg-btn{all:unset;cursor:pointer;background:${t.accent};color:${t.onAccent};padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;font-family:${t.font}}
.wp-tg-btn:hover{filter:brightness(.92)}
.wp-tg-skip{all:unset;cursor:pointer;font-size:13px;color:#9a9a9a}
.wp-tg-skip:hover{color:#555}
.wp-tg-exit{position:fixed;inset:0;z-index:99995;background:rgba(15,17,21,.74);display:flex;align-items:center;justify-content:center;padding:24px}
.wp-tg-exit-card{background:#fff;border-radius:18px;box-shadow:0 30px 70px -20px rgba(0,0,0,.5);max-width:430px;padding:32px;font-family:${t.font}}
.wp-tg-exit-card h3{margin:0 0 12px;font-size:23px;font-weight:700;letter-spacing:-.01em;color:#1a1a1a}
.wp-tg-exit-card p{margin:0 0 20px;font-size:14px;line-height:1.6;color:#444}
body.wp-tg-active{padding-top:40px}
`;
}

export function mountTourguide(cfg: TourguideConfig): void {
  if (typeof window === "undefined") return;
  if (document.getElementById("wp-tg-style")) return; // once

  const theme = resolveTheme(cfg);
  const style = document.createElement("style");
  style.id = "wp-tg-style";
  style.textContent = buildCSS(theme);
  document.head.appendChild(style);

  const inquireUrl = `https://www.walkperro.com/websites/${cfg.siteSlug}`;

  // ── banner ────────────────────────────────────────────────────────────────
  const banner = document.createElement("div");
  banner.className = "wp-tg-banner";
  banner.innerHTML =
    `<span><span class="wp-tg-dot"></span>demo — resets nightly. explore anything.</span>` +
    (cfg.adminUrl ? `<a href="${cfg.adminUrl}">open the admin →</a>` : "") +
    `<a href="${inquireUrl}">want one like this? →</a>` +
    `<button type="button" data-tg-restart>tour</button>`;
  document.body.appendChild(banner);
  document.body.classList.add("wp-tg-active");
  banner.querySelector("[data-tg-restart]")!.addEventListener("click", () => {
    localStorage.removeItem(LS_DONE);
    stepIdx = 0;
    runTour();
  });

  // ── spotlight tour ──────────────────────────────────────────────────────────
  let stepIdx = 0;
  let mask: HTMLElement | null = null;
  let card: HTMLElement | null = null;

  function cleanupStep() {
    mask?.remove();
    card?.remove();
    mask = card = null;
  }

  function endTour(markDone = true) {
    cleanupStep();
    if (markDone) localStorage.setItem(LS_DONE, "1");
  }

  function showStep(i: number) {
    cleanupStep();
    const step = cfg.steps[i];
    if (!step) return endTour();
    if (step.route && window.location.pathname !== step.route) {
      sessionStorage.setItem("wp_tg_resume", String(i));
      window.location.href = step.route;
      return;
    }
    const el = document.querySelector(step.selector);
    if (!el) return showStep(i + 1); // selector missing → skip gracefully
    el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });

    const r = el.getBoundingClientRect();
    mask = document.createElement("div");
    mask.className = "wp-tg-mask";
    const hole = document.createElement("div");
    hole.className = "wp-tg-hole";
    Object.assign(hole.style, {
      top: `${r.top - 6}px`,
      left: `${r.left - 6}px`,
      width: `${r.width + 12}px`,
      height: `${r.height + 12}px`,
    });
    mask.appendChild(hole);
    document.body.appendChild(mask);

    card = document.createElement("div");
    card.className = "wp-tg-card";
    const isLast = i === cfg.steps.length - 1;
    card.innerHTML =
      `<h4>${step.title}</h4><p>${step.body}</p>` +
      `<div class="wp-tg-row"><span class="wp-tg-count">${i + 1} / ${cfg.steps.length}</span>` +
      `<span style="display:flex;gap:14px;align-items:center"><button class="wp-tg-skip" data-tg-skip>skip</button> ` +
      `<button class="wp-tg-btn" data-tg-next>${
        isLast ? (cfg.adminUrl ? "open the admin →" : "done") : "next →"
      }</button></span></div>`;
    document.body.appendChild(card);

    const cw = 330;
    const below = r.bottom + 12 + 170 < window.innerHeight;
    Object.assign(card.style, {
      top: below ? `${r.bottom + 14}px` : `${Math.max(52, r.top - 182)}px`,
      left: `${Math.min(Math.max(12, r.left), window.innerWidth - cw - 12)}px`,
    });

    card.querySelector("[data-tg-skip]")!.addEventListener("click", () => endTour());
    card.querySelector("[data-tg-next]")!.addEventListener("click", () => {
      if (isLast) {
        endTour();
        if (cfg.adminUrl) window.location.href = cfg.adminUrl;
      } else {
        showStep(i + 1);
      }
    });
    stepIdx = i;
  }

  function runTour() {
    showStep(stepIdx);
  }

  const resume = sessionStorage.getItem("wp_tg_resume");
  if (resume !== null) {
    sessionStorage.removeItem("wp_tg_resume");
    stepIdx = parseInt(resume, 10) || 0;
    setTimeout(runTour, 450);
  } else if (!localStorage.getItem(LS_DONE)) {
    setTimeout(runTour, 950);
  }

  // ── exit intent (desktop only, once) ─────────────────────────────────────
  document.addEventListener("mouseout", (e) => {
    if (e.relatedTarget || (e as MouseEvent).clientY > 8) return;
    if (localStorage.getItem(LS_EXIT)) return;
    localStorage.setItem(LS_EXIT, "1");
    const wrap = document.createElement("div");
    wrap.className = "wp-tg-exit";
    wrap.innerHTML =
      `<div class="wp-tg-exit-card"><h3>Want a site like this?</h3>` +
      `<p>Everything you just clicked — the site, the admin, the whole thing — can be built and branded for your business.</p>` +
      `<div class="wp-tg-row"><button class="wp-tg-skip" data-tg-close>keep looking</button>` +
      `<a class="wp-tg-btn" style="text-decoration:none" href="${inquireUrl}">Get this built →</a></div></div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener("click", (ev) => {
      if (ev.target === wrap || (ev.target as HTMLElement).dataset.tgClose !== undefined) {
        wrap.remove();
      }
    });
  });
}
