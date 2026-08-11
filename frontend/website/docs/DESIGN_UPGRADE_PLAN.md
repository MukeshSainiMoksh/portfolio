# Portfolio Website — Design Upgrade Plan
**Scope:** `frontend/website` only (public site). Admin panel untouched.
**Date:** 2026-08-08

---

## 1. Where we are today (honest audit)

**Stack:** Next.js 15.2.3 / React 19 / Tailwind 3.4 / zero animation or 3D libraries.
Every effect is hand-rolled — Canvas 2D, CSS keyframes, `requestAnimationFrame`, inline SVG,
plus a 305-line Web Audio synth for sound effects. That is genuinely impressive engineering.

**Theme:** cyberpunk HUD — `#00f5ff` cyan + `#a855f7` purple on `#000308`, Orbitron display font,
hexagons, scan lines, glitch text, boot sequences, terminal, command palette.

### What's genuinely good — keep it
- Server-side ISR data fetch (`revalidate: 300`), JSON-LD, sitemap, robots, OG image at edge.
- `prefers-reduced-motion` respected in 5 places. Skip link, `:focus-visible` ring.
- Command palette (Ctrl+K), Terminal easter egg, procedural Web Audio sfx — real personality.
- Video is conditionally mounted, thumbnail canvas is IntersectionObserver-gated.

### What is actively hurting the site
| Problem | Where | Why it matters |
|---|---|---|
| Cyan-neon-on-black + Orbitron | everywhere | The single most-used dev-portfolio trope of 2021–24. Reads "template", not "senior AI engineer". |
| Body text at `rgba(255,255,255,0.3–0.4)` | `Hero.tsx:442,511`, `Projects.tsx:150` | ~3.5:1 contrast — fails WCAG AA. A recruiter on a laptop in daylight literally cannot read your project descriptions. |
| 9–11px mono, 4px letter-spacing, used as decoration | all sections | Style over communication. Mono should mark *real data*, not every label. |
| Too many novelty layers at once | cursor glow + terminal + palette + chat + sfx + tilt + glitch + HUD | Nothing feels premium because everything shouts. No hierarchy. |
| Desktop-only identity | hex portrait & HUD are `hidden lg:*` | Most recruiters open portfolios on a phone. They see a plain page. |
| Zero CSS variables | `globals.css` (471 lines, not one `--var`) | `#00f5ff` is string-duplicated hundreds of times across inline styles. Any re-theme = mass find-replace. |
| Skill percentage bars | `Skills.tsx` | "React 87%" is meaningless and widely mocked. Says nothing about capability. |
| Projects are cards only | `Projects.tsx` | No depth. Credibility comes from case studies, not card count. |
| `photo.jpg` = **2.87 MB** rendered at 178×178 | `public/images/` | Enormous LCP hit. |
| `intro.mp4` = **9.6 MB**, no `preload="none"`, no poster | `public/videos/` | |
| Every section is `"use client"` | incl. `Experience.tsx`, `Education.tsx` which have zero hooks | Whole page tree ships to the browser. |
| `VideoIntro.tsx` = 757 lines, two canvas engines, eagerly bundled | | Prime `next/dynamic` candidate. |
| Navbar scroll-spy: 8 × `getElementById` + `getBoundingClientRect` per raw scroll event | `Navbar.tsx:28-38` | Forced layout thrash, unthrottled. |
| `lucide-react` installed, never imported | `package.json` | Dead dependency. |
| Google Fonts via CSS `@import` | `globals.css:2` | Render-blocking, not self-hosted, no `next/font`. |
| Dead CSS | `.skill-bar-fill`, `.card-glass/glow/dark`, `countUp`, `neural-pulse`, `scan` | |

---

## 2. Direction: **"Latent Space"**

> The AI-ness should come from **material and behaviour**, not from stickers.

Current site *says* "AI" with fonts and hexagons. The 2026 move is to make the site
*behave* like an intelligence: one continuous field of light that reorganises itself as
you scroll, and an assistant that actually knows your work.

Reference vector (2025–26 real-world): Anthropic, Linear, Vercel, Cursor, Runway, Luma,
Apple's Liquid Glass. Common threads: **near-black with a temperature**, **one signature
accent**, **huge editorial type**, **real WebGL depth used sparingly**, **film grain**,
**spring physics instead of duration curves**.

Three pillars:
1. **Depth is earned, not sprayed.** One WebGL layer for the whole page, not eight canvases.
2. **One accent, many elevations.** Colour hierarchy through surface lightness, not hue count.
3. **Type does the heavy lifting.** Big, tight, confident. Effects support it.

### Alternates (if you want a different flavour)
- **B — Editorial Light.** Warm off-white, near-black serif display, near-zero effects,
  enormous whitespace. Stands out *because* every other dev portfolio is dark neon.
  Highest risk / highest distinctiveness.
- **C — Refined Cyberpunk.** Keep the HUD language but fix contrast, cut the accent count
  from 4 to 2, replace Orbitron, add real WebGL. Lowest risk, smallest payoff.

---

## 3. Design system

### 3.1 Colour — kill the neon rainbow

Move from 4 competing neons to **one signature accent + elevation ladder**, all as CSS
variables in `:root` (currently there are none).

```css
:root {
  /* Base — near-black with a cool temperature, NOT pure black.
     Pure black + neon is the amateur tell. Layered near-black reads premium. */
  --surface-0: #08080C;   /* page */
  --surface-1: #0D0D13;   /* section alt */
  --surface-2: #131320;   /* card */
  --surface-3: #1B1B2B;   /* raised / hover */
  --hairline:  rgba(255,255,255,0.07);
  --hairline-strong: rgba(255,255,255,0.12);

  /* Signature accent — electric iris. Replaces cyan.
     Cyan is the most-used accent in dev portfolios; iris/violet reads current. */
  --accent:      #6E7BFF;
  --accent-soft: #A5AEFF;
  --accent-deep: #3A44C9;
  --accent-glow: rgba(110,123,255,0.22);

  /* Warm counterpoint — used ONLY for emphasis moments (hero highlight, active CTA).
     Violet + ember is the duotone that makes the palette feel designed, not defaulted. */
  --ember: #FF8A4C;

  /* Semantic only — never decorative */
  --success: #3DD68C;   /* "current role" dot, form success */
  --warning: #F5C451;

  /* Text — every value here passes WCAG AA on --surface-0 */
  --text-1: rgba(255,255,255,0.94);  /* headings */
  --text-2: rgba(255,255,255,0.72);  /* body        (was 0.4 → AA fail) */
  --text-3: rgba(255,255,255,0.56);  /* meta/labels (was 0.3 → AA fail) */
}
```

Rules:
- Green/pink are **retired as decoration**. Green survives only as `--success`.
- Every card = `--surface-2` + 1px `--hairline`. Hover = `--surface-3` + `--hairline-strong`.
- Glow is `--accent-glow` only, and only on interactive/focal elements.
- Because everything is a variable, a **light mode** becomes a ~40-line addition later.

### 3.2 Typography — the single biggest upgrade

**Drop Orbitron.** It is the #1 "sci-fi template" signal and it is doing more damage to
perceived seniority than anything else on the page.

| Role | Font | Notes |
|---|---|---|
| Display / headlines | **Geist** or **General Sans**, weight 700–800, tracking `-0.035em` | Modern grotesk with actual character |
| Body / UI | **Inter Tight** or **Geist** | |
| Contrast moment | **Instrument Serif Italic** — for one or two words in the hero only | Serif-italic against a grotesk is the 2025–26 editorial signature. Costs nothing, reads expensive. |
| Mono | **Geist Mono** | Used **only** for real data: dates, credential IDs, code, metrics. Not for labels. |

- Load via **`next/font`** (self-hosted, preloaded) — removes the render-blocking `@import`.
- Fluid scale: `clamp()` throughout. Hero headline `clamp(2.75rem, 8.5vw, 8rem)`, line-height `0.92`.
- Minimum body size 16px, minimum meta size 12px. No more 9px.
- Big type is free premium. Use it.

### 3.3 Spacing, radius, elevation
- 4px base scale. Section rhythm `clamp(6rem, 12vw, 11rem)` vertical.
- Radius: `4 / 10 / 18 / 28`. Cards at 18. Consistency here alone reads "designed".
- Elevation = surface lightness + hairline + a very soft accent-tinted shadow. No hard drop shadows.
- **Global film grain**: fixed, `pointer-events:none`, 3–4% opacity SVG feTurbulence overlay.
  Kills gradient banding and ties every surface together. Very 2026, costs ~1KB.

### 3.4 Motion — physics, not durations
- Add **`motion`** (Framer Motion v11+). Replace all `animate-fade-in-up` + inline
  `animationDelay` staggering with `whileInView` + `staggerChildren`.
- Spring defaults: `{ type: "spring", stiffness: 260, damping: 30 }`. Entrances travel
  16–24px, never 40+. Small movement reads confident; large movement reads cheap.
- Add **`lenis`** for smooth scroll, gated on `prefers-reduced-motion`.
- **View Transitions API** for the Projects filter and card → case-study navigation.
- One global rule: *nothing animates on the page more than once unless the user caused it.*

---

## 4. The 3D layer

### 4.1 The core idea — one persistent latent field

Replace the three separate Canvas 2D engines (`Hero`, `VideoIntro` thumbnail, `VideoIntro`
modal) with **a single fixed WebGL canvas behind the entire page**.

It renders an instanced point cloud (~15–25k points) flowing through a **curl-noise field**.
As you scroll, the field *re-embeds* — points morph between formations, one per section:

| Section | Formation | Meaning |
|---|---|---|
| Hero | diffuse nebula, slow drift | unstructured latent space |
| About | points converge toward a soft centroid | identity forming |
| Skills | discrete clusters, one per skill category | clustering / embeddings |
| Experience | a flowing timeline current | sequence |
| Projects | ordered lattice / grid | structured output |
| Contact | everything converges to a single point | the CTA |

One canvas → **one WebGL context**, one rAF loop, GPU-side morphing. Cheaper than the three
CPU-bound Canvas 2D loops it replaces (the `VideoIntro` thumbnail currently allocates a
`createRadialGradient` *per particle per frame*).

Narratively it means the whole page is one continuous intelligence thinking — which is the
concept, not a decoration.

**Stack:** `three` + `@react-three/fiber` + `@react-three/drei`, dynamically imported after
first paint. If bundle size is a concern, `ogl` (~10KB) does this too with more manual work —
recommend R3F for maintainability.

### 4.2 The hero moment — 3D point-cloud portrait

Replace the hex-clipped photo with a **depth-displaced point cloud of your face**:
- Generate a depth map for `photo.jpg` once (offline — Depth Anything / MiDaS), ship as a
  second texture (~40KB).
- Vertex shader displaces points along Z by depth → **real parallax on cursor move / device tilt**.
- On load: points start scattered in the latent field and **resolve into the portrait** over
  ~1.4s. That is the single "wow" moment of the site, and it is thematically exact —
  noise resolving into a person.
- Hover: cursor repels points locally, they spring back.
- **Must work on mobile** (device-orientation parallax instead of cursor). This fixes the
  desktop-only-identity problem.

### 4.3 Glass & light
- Nav and modals get **refractive glass**, not just `backdrop-blur`: backdrop-filter +
  saturate + a 1px chromatic-tinted top edge + inner highlight. Apple's 2025 Liquid Glass
  direction, achievable in pure CSS.
- Soft volumetric light: one large, very low-opacity accent radial behind the hero, slowly
  breathing. Replaces the two `blur-[140px]` orbs (which currently cost real compositing).

### 4.4 3D performance budget — non-negotiable
- Dynamic import, mounted **after** `requestIdleCallback` / first paint. LCP never waits on WebGL.
- `frameloop="demand"` + IntersectionObserver; **paused when tab hidden** (`visibilitychange`).
- DPR clamped to `min(devicePixelRatio, 1.5)`.
- Point count tiered by `navigator.hardwareConcurrency` and `deviceMemory`:
  desktop 25k / mid 12k / low-end 5k / reduced-motion **0 — static gradient poster instead**.
- If the WebGL context fails or is lost → CSS mesh-gradient fallback, no error state.

---

## 5. AI features that are actually AI

The site currently signals "AI" through fonts. For an AI engineer's portfolio, that's the
weakest possible claim. These four make the site *demonstrate* the skill:

1. **Grounded concierge (upgrade the existing `ChatWidget`).**
   Streaming responses, grounded strictly on your CV/projects, with **citations that scroll
   to and highlight the exact section**. Suggested openers: "What did he build at X?",
   "Is he a fit for a RAG-heavy role?", "Show me his hardest debugging story."
   This is the highest-impact single feature on the list.

2. **"Tailor this portfolio" — paste a job description.**
   The site re-ranks and re-orders projects and skills against that JD, highlights the
   overlapping stack, and generates a 3-line pitch. Recruiters have never seen this.
   Backend: one endpoint, embeddings + a short LLM call.

3. **Semantic command palette.**
   Ctrl+K already exists — swap substring matching for embeddings over your content, so
   *"who has done vector database work"* surfaces the right project. Small change, big signal.

4. **The unification: the field reacts to the AI.**
   While the concierge is thinking, the background latent field **converges on the topic
   cluster** it's answering about. The 3D and the AI stop being two separate features and
   become one idea. This is the thing people will screenshot.

---

## 6. Section-by-section

| Section | Change |
|---|---|
| **Hero** | Kill the HUD brackets, tag drifts, glitch. One confident claim in `clamp()` display type with one serif-italic word, 3 proof metrics, 2 CTAs. 3D point-cloud portrait, **visible on mobile**. |
| **About** | Keep count-up stats (good). Tighten bio to ~50 words. Tech pills → grouped, linked to the projects that prove them. |
| **Skills** | **Delete the percentage bars.** Replace with a capability constellation (nodes clustered by domain, sized by depth) or grouped chips where each chip links to a project that used it. Proof > self-assigned numbers. |
| **Experience** | Keep the timeline; make it scroll-linked with a sticky year marker. Move to a **server component** (it has zero hooks today). |
| **Projects** | Biggest structural add: **`/work/[slug]` case-study routes** — problem → approach → architecture diagram → outcome/metrics. Shared-element transition from card to page via View Transitions. Filter via View Transitions too. |
| **Certifications** | Demote from big cards to a compact credential strip. Server component. |
| **Education** | Compact, two-line entries. Server component. |
| **Contact** | Keep the split layout. Real inline validation, optimistic success state, honeypot + rate limit. |
| **NEW — "Now"** | What you're building this month, latest writing, currently-learning. Makes the site feel alive rather than archived. Single admin-editable field. |
| **Navbar** | rAF-throttle the scroll-spy (or swap to IntersectionObserver). Glass refraction. |
| **VideoIntro** | `next/dynamic`, drop the second boot-sequence canvas, compress the video, add a poster. |
| **Terminal / Palette / sfx** | Keep — they're the personality. But make sfx **default-off** with a discoverable toggle, and add focus traps + `role="dialog"` to all four overlays. |

---

## 7. Performance & accessibility guardrails

**Budgets:** LCP < 2.0s · INP < 200ms · CLS < 0.05 · initial JS < 200KB gzip · Lighthouse ≥ 95 mobile.

- `photo.jpg` 2.87 MB → responsive AVIF/WebP, ~60 KB.
- `intro.mp4` 9.6 MB → re-encode to < 2 MB + `preload="none"` + poster frame.
- `Experience`, `Education`, `Certifications`, `Footer` → server components.
- `next/dynamic` for `VideoIntro`, `Terminal`, `CommandPalette`, `ChatWidget`, WebGL layer.
- `next/font` replaces the CSS `@import`.
- Remove `lucide-react` (unused) and the dead CSS listed in §1.
- Move the ~hundreds of duplicated inline hex strings into the CSS variables from §3.1.

**Accessibility:**
- Every text colour re-checked to AA (§3.1 values already pass).
- Focus trap + `role="dialog"` + `aria-modal` + focus restore on all four overlays.
- Full `prefers-reduced-motion` path: no WebGL, no lenis, no springs — static gradient poster.
- Keyboard path through the entire page verified, including the 3D portrait (skippable).
- Test at 390px width — the identity must survive on a phone.

---

## 8. Phases

| Phase | Work | Effort | Risk |
|---|---|---|---|
| **0 — Foundation** | CSS variable token layer, `next/font` + new type stack, contrast fix to AA, image/video compression, delete dead code, server-component conversions | ~0.5 day | none |
| **1 — Motion** | `motion` + `lenis`, re-choreograph every section entrance, View Transitions on filter | 1–2 days | low |
| **2 — 3D** | R3F latent field + scroll-linked formations + point-cloud portrait + perf tiering + fallbacks | 2–3 days | medium |
| **3 — Content depth** | `/work/[slug]` case studies, Skills rework, "Now" section, shared-element transitions | 2 days | low |
| **4 — AI** | Grounded streaming concierge with citations, JD-tailoring, semantic palette, field-reacts-to-AI | 2–3 days | medium (needs backend) |
| **5 — Polish** | Lighthouse pass, a11y audit, focus traps, 390px pass, cross-browser | 1 day | none |

**Phase 0 alone** — half a day, zero new dependencies — will make the site look meaningfully
more senior, because contrast + typography + a coherent palette *are* most of what "premium"
means. Everything after that is amplitude.

---

## 9. Risks

- **Losing personality.** The terminal, palette and sfx are genuinely charming — the goal is
  to make them feel like rewards for exploring, not competing noise on arrival.
- **3D as a tax.** If Phase 2 costs LCP, it has failed regardless of how it looks. Budgets in
  §4.4 are hard limits, not aspirations.
- **AI features need backend work.** Phase 4 touches `backend/` — out of the "website only"
  scope. Sequence it last, or scope it to the concierge alone.
- **Taste is personal.** The palette and font choices in §3 are my recommendation, not
  gospel. They're all one-variable changes now that tokens exist.
