# Portfolio Website — Phase-wise Execution Plan
**Scope:** `frontend/website` only. Admin panel untouched.
**Companion doc:** `DESIGN_UPGRADE_PLAN.md` (design rationale, tokens, colour/type system)
**Goal:** not "nice portfolio" — a site people screenshot, record, and send to a friend.

---

## 0. What actually makes someone stop and stare

Before phases, the target. "Dekhta hi reh jaye" is not made by *more effects* — it's made by
**a few precisely-built moments** with silence around them. Every memorable site has 4–6.
Ours, ranked by impact-per-hour:

| # | Moment | What the visitor experiences | Phase |
|---|---|---|---|
| **M1** | **The Arrival** | Page opens as a field of drifting light-points. Over ~1.6s they converge and *resolve into your face*. Noise → a person. | 1 |
| **M2** | **The portrait is alive** | It parallaxes with the cursor — real depth, not a CSS tilt. Move the mouse across it and points push away and spring back. On phone it responds to how you hold the device. | 1 |
| **M3** | **One continuous mind** | The background field never resets. As you scroll it *re-organises* — nebula → clusters → timeline current → lattice → a single converging point. People scroll back up to watch it again. | 2 |
| **M4** | **Scroll has weight** | Fast scroll smears the field into trails; it settles when you stop. The page feels physical, not like a document. | 2 |
| **M5** | **The name assembles** | At Contact, every point in the field converges and spells your name, then relaxes. The site's closing shot. | 2 |
| **M6** | **Case studies with living architecture** | Click a project → shared-element transition → a full case study whose architecture diagram draws itself as you scroll through it. | 4 |
| **M7** | **"Paste a job description"** | A recruiter pastes a JD. The site re-orders itself for that role in real time and writes a 3-line pitch. Nobody has seen this. | 5 |
| **M8** | **The field thinks with the AI** | While the concierge answers, the background converges on the topic it's discussing. 3D and AI stop being two features and become one idea. | 5 |

Rule that protects all of them: **restraint everywhere else.** These 8 land only if the rest
of the page is quiet, confident and fast.

---

# PHASE 0 — Foundation ✅ SHIPPED
**Effort:** ~4–6 hours · **Risk:** none · **New deps:** none (one removal)
**Visible payoff:** medium — but it is the reason every later phase looks expensive.

> **Status:** complete on branch `feat/website-redesign`.
> Build passes, First Load JS 143 kB, all nine text tokens ≥ 4.5:1 on `--surface-0`,
> zero external font requests. Two deviations from the plan as written — see
> "Deviations" at the end of this phase.

### Goal
Give the site a real design system, fix what's broken, and make it fast — so the wow moments
land on a premium surface instead of a template.

### Tasks

**0.1 — Token layer** → `app/globals.css`
- Add a `:root` block with the full variable set from `DESIGN_UPGRADE_PLAN.md §3.1`
  (surfaces 0–3, hairlines, `--accent` iris, `--ember`, semantics, `--text-1/2/3`).
- Mirror them into `tailwind.config.ts` so `bg-surface-2`, `text-accent` etc. work.
- Sweep every component and replace hard-coded `#00f5ff`, `#a855f7`, `rgba(255,255,255,0.x)`
  with `var(--…)`. This is the bulk of the phase — ~9 section files + 4 layout + 4 ui.

**0.2 — Typography** → `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`
- Delete the Google Fonts `@import` at `globals.css:2`.
- Load via `next/font/google`: Geist (display+body), Geist Mono, Instrument Serif (italic only).
- **Remove Orbitron entirely.** Replace every `font-orbitron` usage.
- Add the fluid `clamp()` type scale; hero headline `clamp(2.75rem, 8.5vw, 8rem)` / `lh 0.92` / `tracking -0.035em`.
- Restrict mono to real data only — dates, credential IDs, metrics, code.

**0.3 — Contrast to WCAG AA**
- Every `rgba(255,255,255,0.3)` / `0.4)` body text → `var(--text-2)` / `var(--text-3)`.
- Known offenders: `Hero.tsx:442,511`, `Projects.tsx:150`, all `.section-label` uses.
- Minimum body 16px, minimum meta 12px. Kill 9–11px text.

**0.4 — Assets**
- `public/images/photo.jpg` 2.87 MB → AVIF + WebP responsive set, target ≤ 60 KB.
- `public/videos/intro.mp4` 9.6 MB → re-encode ≤ 2 MB, add `preload="none"` + poster frame.
- Delete unreferenced `public/images/azure-cert.png` if truly unused.
- Add `app/icon.tsx` + `apple-icon` (site currently has no favicon).

**0.5 — Structural cleanup**
- `Experience.tsx`, `Education.tsx`, `Certifications.tsx` → drop `"use client"` (zero hooks in the first two).
- `next/dynamic` for `VideoIntro`, `Terminal`, `CommandPalette`, `ChatWidget`.
- rAF-throttle the Navbar scroll-spy (`Navbar.tsx:28-38` — currently 8 × `getBoundingClientRect` per raw scroll event).
- `npm rm lucide-react` (installed, never imported).
- Delete dead CSS: `.skill-bar-fill`, `.card-glass/.card-glow/.card-dark`, `countUp`, and the
  unused `neural-pulse` / `scan` animations in `tailwind.config.ts`.
- Centralise types: sections currently redeclare their own interfaces — import from `services/api.ts`.

### Acceptance
- [x] Zero hard-coded colour literals in `components/` — all `var(--…)`.
      (Two deliberate exceptions, both documented in-file: Canvas 2D and Satori
      cannot resolve CSS custom properties.)
- [x] Orbitron gone; no external font request in the network tab — 13 self-hosted
      woff2 files, zero requests to `fonts.googleapis.com` / `fonts.gstatic.com`.
- [x] Every text/background pair ≥ 4.5:1. Measured on `--surface-0` (#08080c):
      text-1 17.6:1 · text-2 10.3:1 · text-3 6.5:1 · accent 5.7:1 ·
      accent-soft 9.6:1 · ember 8.6:1 · success 10.7:1 · danger 7.2:1 · warning 12.3:1.
- [x] LCP image < 100 KB — `photo.jpg` 2 806 KB → **77 KB** (3120px → 1000px wide).
- [x] Initial JS 143 kB, under the 200 kB budget.
- [x] Site still looks *the same shape* — just sharper. No layout regressions.

### Deviations from the plan as written

**1. `intro.mp4` was NOT re-encoded.** The plan called for 9.6 MB → < 2 MB. On
inspection the source is 640×360 at 277 kb/s — already an efficient encode; its
size comes entirely from a 3 min 24 s duration. Reaching 2 MB would mean ~78 kb/s,
which is visibly worse, and re-encoding an already-compressed source only adds
generation loss. The file is not on the critical path: it is conditionally mounted,
now carries `preload="none"`, and has a real 12 KB poster frame. Shortening the
video is the only real fix, and that is a content decision, not an engineering one.

**2. Favicon is a static PNG, not a generated route.** `app/icon.tsx` using
`ImageResponse` crashed the build — `@vercel/og` on the Node runtime fails on
Windows (`fileURLToPath` / Invalid URL). Runtime image generation is the wrong
tool for a favicon anyway, so `app/icon.png` (512px) and `app/apple-icon.png`
(180px) are generated once and committed.

**Also pulled forward from later phases** (all cheap, all low-risk):
- Film grain overlay (was 1.5) — ~1 KB, and it kills gradient banding site-wide.
- Liquid glass on nav / overlays and `TiltCard` 6° → 3.5° (was 3.2, 3.3).
- Sound effects default to **off** (was 3.5) — unexpected audio on a first visit
  is the fastest way to lose a visitor, and it was a two-line change.
- ARIA dialog semantics on all four overlays (was 6). Focus traps still pending.

**Pre-existing issues found, not fixed** (out of scope, flagging only):
- `backend/website/routes/chat.py` imports `openai`, which is not installed —
  the backend will not start locally.
- `frontend/website/.env.production` still contains the literal placeholder
  `NEXT_PUBLIC_SITE_URL=https://<REPLACE-yourdomain.com>`, which fails `next build`.
  The file is gitignored, so this is a local/deploy-environment fix.
- `app/blog/[slug]/` exists but is empty.

---

# PHASE 1 — The Arrival
**Effort:** 2–2.5 days · **Risk:** medium · **New deps:** `three`, `@react-three/fiber`, `@react-three/drei`
**Visible payoff:** ★★★★★ — this is the phase that changes how the site is perceived.
**Delivers:** M1, M2

### Goal
Rebuild the hero around one unforgettable 8-second experience.

### Tasks

**1.1 — WebGL foundation** → new `components/three/Stage.tsx`
- One `<Canvas>`, `frameloop="demand"`, `dpr={[1, 1.5]}`, dynamically imported after first paint
  via `next/dynamic({ ssr: false })` + `requestIdleCallback`.
- Global quality tier hook `useQualityTier()` reading `hardwareConcurrency`, `deviceMemory`,
  `prefers-reduced-motion`, and a WebGL-support probe → returns `high | mid | low | off`.
- `off` renders a static CSS mesh-gradient poster. Same for context-loss.
- Pause on `visibilitychange` and when off-screen.

**1.2 — Depth map** (offline, one-time)
- Run `photo.jpg` through Depth Anything V2 / MiDaS → grayscale depth PNG.
- Ship as `public/images/photo-depth.webp` (~40 KB). Commit both.

**1.3 — Point-cloud portrait** → `components/three/Portrait.tsx`
- Instanced points (high 120k / mid 50k / low 18k) sampled on a grid over the photo.
- Vertex shader: XY from grid, **Z displaced by the depth texture**, colour from the photo texture.
- **Resolve animation:** points start at random positions in a spherical noise cloud, lerp to
  their portrait position over 1.6s with per-point stagger driven by a noise seed
  (so it resolves in organic waves, not a uniform sweep). Ease: `expo.out`.
- **Cursor repulsion:** points within radius push away along the surface normal, spring back
  (`stiffness 120, damping 14`). Radius ~18% of viewport width.
- **Parallax:** camera (not the mesh) offsets ±1.5° from cursor. On touch devices,
  `deviceorientation` with permission-gated fallback to none.
- Idle: a very slow breathing noise so it's never frozen.

**1.4 — Hero rewrite** → `components/sections/Hero.tsx` (540 → target ~180 lines)
- **Delete:** the Canvas 2D neural net, `.hero-grid`, both blurred orbs, the entire
  `HexProfile()` sub-component (207 lines + 8 injected keyframes), HUD tag drifts, glitch text.
- **Keep:** the typewriter, but slow it and use it on *one* line only.
- New composition: eyebrow → one large claim in display type with **one word in
  Instrument Serif italic** → one sentence of substance → 3 proof metrics → 2 CTAs.
- Portrait now full-bleed on the right at `lg+`, and **behind the type at ≤ `md`** at low
  opacity — mobile finally gets the identity.
- Entrance choreography: portrait resolves (0–1.6s) → headline mask-reveals (0.4s) →
  metrics count up (0.9s) → CTAs fade (1.3s). Overlapping, not sequential.

**1.5 — Grain + light** → `app/layout.tsx`
- Fixed `pointer-events:none` SVG `feTurbulence` grain at 3.5% opacity over everything.
- One large, slow-breathing `--accent-glow` radial behind the hero (replaces the two
  `blur-[140px]` orbs, which cost real compositing).

### Acceptance
- [ ] Resolve animation holds 60fps on a mid-tier laptop; ≥ 30fps on a 2021 mid-range phone.
- [ ] LCP unaffected — the WebGL bundle loads *after* first paint. Verify in Lighthouse.
- [ ] `prefers-reduced-motion` → static portrait image, no canvas mounted at all.
- [ ] No-WebGL browser → gradient poster, zero console errors.
- [ ] Hero renders correctly at 390px.

---

# PHASE 2 — The Field
**Effort:** 2–2.5 days · **Risk:** medium · **New deps:** `lenis`
**Visible payoff:** ★★★★★ — turns 8 good seconds into a 60-second experience.
**Delivers:** M3, M4, M5

### Goal
Extend the hero's WebGL layer into one persistent background field for the entire page that
re-organises as you scroll. This replaces the two remaining Canvas 2D engines.

### Tasks

**2.1 — Latent field** → `components/three/Field.tsx`
- Instanced points (high 25k / mid 12k / low 5k) advected through a **curl-noise flow field**
  in the vertex shader. Additive blending, `--accent` → `--ember` colour ramp by depth.
- Lives in the same `<Stage>` canvas as the portrait. **One WebGL context for the whole site.**

**2.2 — Scroll-linked formations**
- Each section registers a target formation; the field morphs between them (GPU-side lerp,
  ~1.2s, `power2.inOut`):

  | Section | Formation |
  |---|---|
  | Hero | diffuse nebula, slow drift |
  | About | converging toward a soft centroid |
  | Skills | discrete clusters, one per skill category |
  | Experience | a flowing directional current |
  | Projects | ordered lattice / grid |
  | Contact | **converges into the letters of your name**, then relaxes ← M5 |

- Drive with a single IntersectionObserver registry, not per-section scroll listeners.

**2.3 — Scroll physics** → `lenis`
- Smooth scroll, hard-disabled under `prefers-reduced-motion`.
- Feed scroll *velocity* into the field shader: high velocity stretches points into trails,
  settles on stop. This is M4 and it's ~15 lines of shader for an outsized effect.

**2.4 — Ambient colour temperature**
- Interpolate the page's accent from cool iris (hero) to warm ember (contact) across total
  scroll progress, via a CSS variable updated once per rAF. Subtle enough that nobody notices
  consciously — everyone feels the page "warming up" toward the CTA.

**2.5 — Retire the old canvases**
- Delete `useThumbnailCanvas` and `useModalCanvas` from `VideoIntro.tsx` (757 → ~200 lines).
  Thumbnail becomes a poster frame; the boot sequence goes.

### Acceptance
- [ ] Exactly one WebGL context site-wide (verify in Spector.js / devtools).
- [ ] Full-page scroll holds 60fps desktop, ≥ 30fps mid phone.
- [ ] Total GPU memory < 120 MB.
- [ ] Reduced-motion: no lenis, no field, static gradient — page fully usable.
- [ ] Formations transition smoothly when scrolling *fast* in both directions (no popping).

---

# PHASE 3 — Motion & Material
**Effort:** 1.5 days · **Risk:** low · **New deps:** `motion`
**Visible payoff:** ★★★★ — the difference between "has animations" and "feels designed".

### Goal
Replace every hand-rolled CSS entrance with spring physics, and give surfaces real material.

### Tasks

**3.1 — Motion system** → all section components
- Install `motion` (Framer Motion v11+). Central variants file `lib/motion.ts`.
- Replace all `animate-fade-in-up` + inline `animationDelay` staggering with
  `whileInView` + `staggerChildren`.
- Spring default `{ stiffness: 260, damping: 30 }`. **Entrances travel 16–24px, never 40+** —
  small movement reads confident, large movement reads cheap.
- Rule: nothing animates more than once unless the user caused it.

**3.2 — Liquid glass**
- Navbar, modals, and the command palette get real refraction, not just blur:
  `backdrop-filter: blur(24px) saturate(1.8)` + a 1px chromatic-tinted top edge +
  inner highlight + `--surface-2` at 60%. Pure CSS, no library.

**3.3 — Magnetic interactions**
- CTAs and social icons get magnetic hover (element springs ~6px toward cursor within 60px).
- `TiltCard` tilt reduced 6° → 3.5° and moved to spring — currently it's snappy in a cheap way.
- Cursor glow: shrink and desaturate. It should be a hint, not a headlight.

**3.4 — View Transitions**
- Projects filter (all ↔ featured) via the View Transitions API instead of a re-render.
- Prepares the shared-element transition Phase 4 needs.

**3.5 — Sound design pass**
- Default sfx to **off** with a discoverable, animated toggle (currently on by default —
  unexpected audio is the fastest way to lose a visitor).
- Cut the click volume ~40%; retune to soft, low-frequency ticks.
- Fix `Skills.tsx:58-65` — the observer never disconnects, so `sfx.startup()` retriggers.

### Acceptance
- [ ] Zero `animationDelay` inline styles left in `components/`.
- [ ] Audio silent on first visit; preference persists in `localStorage`.
- [ ] INP < 200ms on all interactions.

---

# PHASE 4 — Depth
**Effort:** 2 days · **Risk:** low · **New deps:** none
**Visible payoff:** ★★★★ — this is what converts "cool site" into "hire this person".
**Delivers:** M6

### Goal
Right now projects are cards. Credibility comes from depth, not card count.

### Tasks

**4.1 — Case study routes** → new `app/work/[slug]/page.tsx`
- Server-rendered, ISR, generated from existing project data + new admin fields.
- Structure: hero image → **Problem** → **Approach** → **Architecture** → **Outcome (metrics)** →
  stack → next-project link.
- Shared-element transition from the card (View Transitions API, `view-transition-name` on
  the card image + title).

**4.2 — Self-drawing architecture diagram** → `components/work/ArchDiagram.tsx`
- Per-project SVG node graph. On scroll into view, nodes fade in in dependency order and the
  connectors **draw themselves** via `stroke-dasharray` animation. Data packets pulse along
  the edges on loop.
- Defined as data (`nodes[]`, `edges[]`), so each project just supplies JSON.

**4.3 — Skills rework** → `components/sections/Skills.tsx`
- **Delete the percentage bars.** "React 87%" is meaningless and widely mocked.
- Replace with a **capability constellation**: nodes clustered by domain, node size = depth,
  edges = technologies used together on the same project. Hovering a node dims everything
  else and surfaces "used in: 3 projects" with links.
- Falls back to grouped chips-with-proof-links under reduced motion.

**4.4 — "Now" section** → new `components/sections/Now.tsx`
- What you're building this month, currently learning, latest writing.
- Single admin-editable field. Makes the site feel alive instead of archived.

**4.5 — Certifications / Education compaction**
- Both demote to compact strips. They're credentials, not the story.

### Acceptance
- [ ] Every featured project has a case study with real metrics — no lorem, no placeholder diagrams.
- [ ] Card → case study transition is seamless in Chrome/Edge, graceful fallback in Firefox/Safari.
- [ ] Constellation is keyboard-navigable.

---

# PHASE 5 — The Intelligence
**Effort:** 2.5–3 days · **Risk:** medium · **Touches `backend/`** (out of website-only scope)
**Visible payoff:** ★★★★★ — the most defensible differentiator on the whole site.
**Delivers:** M7, M8

### Goal
The site currently signals "AI" through fonts. For an AI engineer that is the weakest possible
claim. Make the site *demonstrate* the skill.

### Tasks

**5.1 — Grounded concierge** → `components/ui/ChatWidget.tsx` + `backend/`
- Streaming responses (SSE), grounded strictly on CV/project content — refuses to invent.
- **Citations that work:** each claim carries a chip; clicking it scrolls to and highlights the
  exact section it came from.
- Seeded openers: *"What did he build at X?"* · *"Is he a fit for a RAG-heavy role?"* ·
  *"Show me his hardest debugging story."*
- Promote from a small bubble to a proper glass panel with a real conversation feel.

**5.2 — Field reacts to thinking** ← M8
- While streaming, the background field converges on the topic cluster being discussed
  (map answer → nearest skill category → that category's formation), then releases.
- This is the unification. It's ~40 lines once Phase 2 exists, and it's the thing people record.

**5.3 — "Tailor this portfolio"** ← M7
- Recruiter pastes a job description. Site:
  1. embeds the JD, scores every project + skill against it,
  2. **re-orders the Projects grid live** with a layout animation,
  3. highlights overlapping stack,
  4. generates a 3-line "why he fits" pitch,
  5. offers a shareable permalink of that tailored view.
- Backend: one endpoint, embeddings + one short LLM call.

**5.4 — Semantic command palette** → `components/ui/CommandPalette.tsx`
- Swap substring matching for embeddings over site content, so
  *"who has done vector database work"* finds the right project.

### Acceptance
- [ ] Concierge never states a fact absent from source content (adversarial prompt test set).
- [ ] Every citation chip scrolls to a real, correct section.
- [ ] JD tailoring returns in < 3s, with a skeleton state.
- [ ] Rate limiting + abuse guards on all AI endpoints (this is a public URL).
- [ ] Site is fully functional with AI endpoints down.

---

# PHASE 6 — Polish
**Effort:** 1–1.5 days · **Risk:** none

- Full Lighthouse pass — target **≥ 95 mobile**, LCP < 2.0s, INP < 200ms, CLS < 0.05,
  initial JS < 200 KB gzip.
- axe + manual keyboard sweep. Focus trap, `role="dialog"`, `aria-modal`, focus restore on
  **all four** overlays (Terminal, CommandPalette, Certifications lightbox, VideoIntro).
- 390px pass on every section — the identity must survive on a phone.
- Cross-browser: Safari (backdrop-filter + View Transitions), Firefox (no VT — verify fallback).
- Reduced-motion full run-through: the site must still feel *designed*, not stripped.
- Re-shoot the OG image against the new design; add per-case-study OG cards.
- Real-device test on a low-end Android. If the field stutters there, drop the low tier further.

---

## Summary

| Phase | Name | Effort | Wow | Ships |
|---|---|---|---|---|
| 0 | Foundation | 0.5 d | ★★ | Tokens, type, AA contrast, perf |
| 1 | The Arrival | 2–2.5 d | ★★★★★ | M1, M2 |
| 2 | The Field | 2–2.5 d | ★★★★★ | M3, M4, M5 |
| 3 | Motion & Material | 1.5 d | ★★★★ | springs, glass, magnetics |
| 4 | Depth | 2 d | ★★★★ | M6 |
| 5 | The Intelligence | 2.5–3 d | ★★★★★ | M7, M8 |
| 6 | Polish | 1–1.5 d | — | ship quality |

**Total ≈ 12–14 focused days.** Every phase is independently deployable.

**If time is short:** 0 → 1 → 3 → 6 (≈ 5.5 days) already gets a site that stops people,
because M1 and M2 alone carry most of the impact.

**Non-negotiables across all phases**
1. If it costs LCP, it has failed — regardless of how it looks.
2. Reduced-motion and no-WebGL paths ship *in the same commit* as the effect, never later.
3. Mobile parity. The identity cannot be `hidden lg:*`.
4. Restraint. The 8 moments land only because everything around them is quiet.
