"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* Canvas 2D cannot read CSS custom properties — keep these in sync with
   the tokens in app/globals.css. */
const CANVAS = {
  bg0:        "#08080c",        /* --surface-0 */
  bg1:        "#0d0d13",        /* --surface-1 */
  bg2:        "#131320",        /* --surface-2 */
  accent:     "110, 123, 255",  /* --accent-rgb      */
  accentSoft: "165, 174, 255",  /* --accent-soft-rgb */
  ember:      "255, 138, 76",   /* --ember-rgb       */
} as const;

/* ─── Thumbnail Neural Canvas ────────────────────────────────────────── */
function useThumbnailCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let visible = true;

    /* One radial-gradient blob rendered once into an offscreen canvas, then
       blitted per particle. Replaces a createRadialGradient() per particle
       per frame. */
    const SPRITE_R = 24;
    const makeSprite = (rgb: string) => {
      const s = document.createElement("canvas");
      s.width = s.height = SPRITE_R * 2;
      const sctx = s.getContext("2d")!;
      const g = sctx.createRadialGradient(SPRITE_R, SPRITE_R, 0, SPRITE_R, SPRITE_R, SPRITE_R);
      g.addColorStop(0, `rgba(${rgb}, 0.28)`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SPRITE_R * 2, SPRITE_R * 2);
      return s;
    };
    const sprites = [makeSprite(CANVAS.accent), makeSprite(CANVAS.accentSoft)];
    const cores   = [`rgba(${CANVAS.accent}, 0.92)`, `rgba(${CANVAS.accentSoft}, 0.92)`];

    /* Gradients depend only on canvas size, so they are rebuilt on resize
       rather than on every frame. */
    let bgGrad: CanvasGradient;
    let glowGrad: CanvasGradient;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const W = canvas.width, H = canvas.height;

      bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, CANVAS.bg0);
      bgGrad.addColorStop(0.5, CANVAS.bg1);
      bgGrad.addColorStop(1, CANVAS.bg2);

      glowGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 200);
      glowGrad.addColorStop(0, `rgba(${CANVAS.accent}, 0.07)`);
      glowGrad.addColorStop(1, `rgba(${CANVAS.accent}, 0)`);
    };
    resize();

    type Pt = { x: number; y: number; vx: number; vy: number; size: number; pulse: number; tint: number };
    const pts: Pt[] = [];

    const buildPts = () => {
      pts.length = 0;
      const n = window.innerWidth < 768 ? 50 : 100; // fewer particles on mobile
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.38,
          size: 1.4 + Math.random() * 2.2,
          pulse: Math.random() * Math.PI * 2,
          tint: Math.random() < 0.5 ? 0 : 1,
        });
      }
    };
    buildPts();

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* bg gradient */
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      /* grid */
      ctx.strokeStyle = `rgba(${CANVAS.accent}, 0.035)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 44) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 44) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      /* move + draw connections */
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.035;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${CANVAS.accent}, ${(1 - d / 115) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      /* particles — pre-rendered sprite blit + solid core */
      pts.forEach(p => {
        const bright = 0.5 + 0.5 * Math.sin(p.pulse);
        const r = p.size * 5;
        ctx.globalAlpha = bright;
        ctx.drawImage(sprites[p.tint], p.x - r, p.y - r, r * 2, r * 2);
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * bright, 0, Math.PI * 2);
        ctx.fillStyle = cores[p.tint];
        ctx.fill();
      });

      /* centre glow */
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, H);

      if (visible && !reducedMotion) animId = requestAnimationFrame(draw);
    };

    draw();

    // pause the loop when the thumbnail scrolls out of view (battery/CPU)
    const io = new IntersectionObserver(([entry]) => {
      const nowVisible = entry.isIntersecting;
      if (nowVisible && !visible && !reducedMotion) {
        visible = true;
        animId = requestAnimationFrame(draw);
      } else {
        visible = nowVisible;
      }
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => { resize(); buildPts(); });
    ro.observe(canvas);

    return () => { cancelAnimationFrame(animId); io.disconnect(); ro.disconnect(); };
  }, [canvasRef]);
}

/* ─── Web Audio helpers ──────────────────────────────────────────────── */
function useAudio() {
  const acRef = useRef<AudioContext | null>(null);
  const getAC = useCallback((): AudioContext => {
    if (!acRef.current) {
      acRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (acRef.current.state === "suspended") acRef.current.resume();
    return acRef.current;
  }, []);

  const playOpen = useCallback(() => {
    const a = getAC(), t = a.currentTime;
    const out = a.createGain(); out.gain.value = 0.32; out.connect(a.destination);

    const o = a.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(320, t);
    o.frequency.exponentialRampToValueAtTime(760, t + 0.16);
    const g = a.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.14, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 0.3);
  }, [getAC]);

  const playClose = useCallback(() => {
    const a = getAC(), t = a.currentTime;
    const out = a.createGain(); out.gain.value = 0.3; out.connect(a.destination);

    const o = a.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(620, t);
    o.frequency.exponentialRampToValueAtTime(240, t + 0.2);
    const g = a.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 0.28);
  }, [getAC]);

  return { playOpen, playClose };
}

/* ─── VideoIntro Section ─────────────────────────────────────────────── */
export default function VideoIntro({ videoSrc }: { videoSrc?: string }) {
  const resolvedSrc = videoSrc ?? "/videos/intro.mp4"; // admin upload wins, bundled fallback
  const thumbRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [open,    setOpen]    = useState(false);
  const [closing, setClosing] = useState(false);

  const { playOpen, playClose } = useAudio();

  /* thumbnail canvas */
  useThumbnailCanvas(thumbRef);

  /* open */
  const openModal = useCallback(() => {
    if (open) return;
    playOpen();
    setClosing(false);
    setOpen(true);
  }, [open, playOpen]);

  /* close */
  const closeModal = useCallback(() => {
    if (!open) return;
    playClose();
    setClosing(true);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setTimeout(() => { setOpen(false); setClosing(false); }, 240);
  }, [open, playClose]);

  /* start playback as soon as the video mounts — preload="none" means the
     9.6 MB file is only requested from here, never on page load */
  useEffect(() => {
    if (!open) return;
    videoRef.current?.play().catch(() => { /* autoplay blocked — controls remain */ });
  }, [open]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeModal]);

  /* portal-style: prevent body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Scoped keyframes ── */}
      <style>{`
        @keyframes vi-pingRing { 0%{transform:scale(.9);opacity:.6} 100%{transform:scale(1.75);opacity:0} }
        @keyframes vi-fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes vi-fadeOut  { from{opacity:1} to{opacity:0} }

        .vi-play-ring-1 { animation: vi-pingRing 2.6s ease-out infinite; }
        .vi-play-ring-2 { animation: vi-pingRing 2.6s 1.3s ease-out infinite; }

        .group:hover .vi-play-btn {
          border-color: var(--accent);
          box-shadow: 0 0 40px rgb(var(--accent-rgb) / 0.45),
                      inset 0 0 20px rgb(var(--accent-rgb) / 0.1);
          transform: scale(1.05);
        }
      `}</style>

      {/* ════════════════════════════════
          SECTION
      ════════════════════════════════ */}
      <section id="intro-video" className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span style={{ display: "block", width: "30px", height: "1px", background: "rgb(var(--accent-rgb) / 0.35)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-soft)" }}>
              Introduction Video
            </span>
            <span style={{ display: "block", width: "30px", height: "1px", background: "rgb(var(--accent-rgb) / 0.35)" }} />
          </div>

          <h2 className="section-title text-center mb-3">Meet The Engineer</h2>
          <div className="section-divider mx-auto" />

          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.08em", textAlign: "center", marginBottom: "48px" }}>
            A brief walkthrough of who I am, what I build, and the problems I solve with AI.
          </p>

          {/* ── THUMBNAIL CARD ── */}
          <div
            role="button"
            tabIndex={0}
            onClick={openModal}
            onKeyDown={(e) => e.key === "Enter" && openModal()}
            style={{
              position: "relative", cursor: "pointer", overflow: "hidden",
              border: "1px solid rgb(var(--accent-rgb) / 0.14)",
              background: "var(--surface-2)",
              transition: "border-color .3s, box-shadow .3s",
            }}
            className="group"
          >
            {/* neural canvas bg */}
            <canvas
              ref={thumbRef}
              style={{ display: "block", width: "100%", height: "360px" }}
            />

            {/* overlay */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgb(var(--surface-0-rgb) / 0.72) 0%, rgb(var(--surface-0-rgb) / 0.55) 100%)",
              transition: "background .3s",
            }}>
              {/* play button */}
              <div
                style={{
                  width: "90px", height: "90px", borderRadius: "50%",
                  border: "2px solid rgb(var(--accent-rgb) / 0.55)",
                  background: "rgb(var(--accent-rgb) / 0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", marginBottom: "24px",
                  transition: "all .3s",
                }}
                className="vi-play-btn"
              >
                {/* ping rings */}
                <div className="vi-play-ring-1" style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "1px solid rgb(var(--accent-rgb) / 0.22)", pointerEvents: "none" }} />
                <div className="vi-play-ring-2" style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "1px solid rgb(var(--accent-rgb) / 0.22)", pointerEvents: "none" }} />
                {/* play triangle */}
                <div style={{
                  width: 0, height: 0,
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  borderLeft: "24px solid var(--accent)",
                  marginLeft: "6px",
                  filter: "drop-shadow(0 0 8px rgb(var(--accent-rgb) / 0.8))",
                }} />
              </div>

              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px", color: "var(--text-1)", letterSpacing: "0.02em", marginBottom: "6px" }}>
                My Story · Who I Am
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Click to play · Introduction
              </div>
            </div>

            {/* bottom-right badge */}
            <div style={{
              position: "absolute", bottom: "18px", right: "18px",
              padding: "5px 12px",
              background: "rgb(var(--accent-rgb) / 0.08)", border: "1px solid rgb(var(--accent-rgb) / 0.22)",
              fontFamily: "var(--font-mono)", fontSize: "12px",
              color: "var(--accent-soft)", letterSpacing: "0.08em",
            }}>
              INTRO REEL
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          MODAL OVERLAY
      ════════════════════════════════ */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Introduction video"
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
            animation: closing ? "vi-fadeOut .24s ease-in forwards" : "vi-fadeIn .24s ease-out",
          }}
        >
          {/* backdrop */}
          <div
            onClick={closeModal}
            style={{
              position: "absolute", inset: 0,
              background: "rgb(var(--surface-0-rgb) / 0.92)",
              backdropFilter: "blur(14px)",
            }}
          />

          {/* panel */}
          <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "900px" }}>
            <div style={{
              border: "1px solid var(--hairline-strong)",
              background: "var(--surface-2)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              position: "relative",
            }}>

              {/* ── HEADER ── */}
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 18px",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px", color: "var(--text-1)", letterSpacing: "-0.01em" }}>
                  My Story · Who I Am
                </div>

                <button
                  onClick={closeModal}
                  aria-label="Close video"
                  style={{
                    width: "32px", height: "32px",
                    border: "1px solid var(--hairline-strong)",
                    background: "rgb(var(--accent-rgb) / 0.04)",
                    borderRadius: "var(--r-sm)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "var(--text-2)",
                    fontSize: "16px", lineHeight: 1, flexShrink: 0,
                    transition: "all .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgb(var(--ember-rgb) / 0.6)"; e.currentTarget.style.color = "var(--ember)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--hairline-strong)"; e.currentTarget.style.color = "var(--text-2)"; }}
                >
                  ✕
                </button>
              </div>

              {/* ── VIDEO AREA ── */}
              <div style={{ position: "relative", background: "var(--surface-0)", aspectRatio: "16/9", overflow: "hidden" }}>
                <video
                  ref={videoRef}
                  src={resolvedSrc}
                  poster="/images/intro-poster.jpg"
                  preload="none"
                  controls
                  playsInline
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                />
              </div>
            </div>{/* end panel */}
          </div>
        </div>
      )}
    </>
  );
}
