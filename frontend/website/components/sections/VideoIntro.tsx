"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Types ──────────────────────────────────────────────────────────── */
type GlowPulse = { active: boolean; r: number; alpha: number };

/* ─── Thumbnail Neural Canvas ────────────────────────────────────────── */
function useThumbnailCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ctx = canvas.getContext("2d")!;
    let animId: number;

    type Pt = { x: number; y: number; vx: number; vy: number; size: number; pulse: number; hue: number };
    const pts: Pt[] = [];

    const buildPts = () => {
      pts.length = 0;
      const n = 100;
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.38,
          size: 1.4 + Math.random() * 2.2,
          pulse: Math.random() * Math.PI * 2,
          hue: 175 + Math.random() * 55,
        });
      }
    };
    buildPts();

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* bg gradient */
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#020610");
      bg.addColorStop(0.5, "#040a1a");
      bg.addColorStop(1, "#060312");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* grid */
      ctx.strokeStyle = "rgba(0,245,255,0.035)";
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
            ctx.strokeStyle = `rgba(0,205,255,${(1 - d / 115) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      /* particles */
      pts.forEach(p => {
        const bright = 0.5 + 0.5 * Math.sin(p.pulse);
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        gr.addColorStop(0, `hsla(${p.hue},100%,70%,${0.28 * bright})`);
        gr.addColorStop(1, `hsla(${p.hue},100%,70%,0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = gr; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * bright, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,82%,0.92)`;
        ctx.fill();
      });

      /* centre glow */
      const cg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 200);
      cg.addColorStop(0, "rgba(0,100,200,0.07)");
      cg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

      /* watermark labels */
      ctx.font = "700 9px JetBrains Mono";
      ctx.fillStyle = "rgba(0,245,255,0.1)";
      ctx.textAlign = "left";
      ["NEURAL·NET", "AI·ENGINE·v4", "COMPUTE·READY", "MODEL·LOADED"].forEach((l, i) => {
        ctx.fillText(l, 16 + i * 190, 20 + (i % 2) * (H - 40));
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const ro = new ResizeObserver(() => { resize(); buildPts(); });
    ro.observe(canvas);

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [canvasRef]);
}

/* ─── Modal Loading Canvas ───────────────────────────────────────────── */
function useModalCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean,
  onComplete: () => void,
) {
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth  || 800;
    canvas.height = canvas.offsetHeight || 450;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const CHARS = "01ABF39E7C2D";
    const cols  = Math.floor(W / 16);
    const dropY = Array.from({ length: cols }, () => Math.random() * -H);
    let t = 0, progress = 0;
    const pulse: GlowPulse = { active: false, r: 0, alpha: 0 };

    const draw = () => {
      ctx.fillStyle = "rgba(2,4,10,0.18)";
      ctx.fillRect(0, 0, W, H);

      /* matrix rain */
      ctx.font = "11px JetBrains Mono";
      for (let c = 0; c < cols; c++) {
        dropY[c] += 1.5 + Math.random();
        if (dropY[c] > H) dropY[c] = Math.random() * -60;
        ctx.fillStyle = `rgba(0,255,136,${0.28 + 0.35 * Math.random()})`;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], c * 16 + 2, dropY[c]);
      }

      /* horizontal scan beam */
      const scanY = (t * 2.6) % H;
      const sg = ctx.createLinearGradient(0, scanY - 3, 0, scanY + 3);
      sg.addColorStop(0, "transparent");
      sg.addColorStop(0.5, "rgba(0,245,255,0.22)");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg; ctx.fillRect(0, scanY - 3, W, 6);

      /* pulse ring */
      if (t % 55 === 0) { pulse.active = true; pulse.r = 50; pulse.alpha = 0.5; }
      if (pulse.active) {
        pulse.r += 2.2; pulse.alpha -= 0.014;
        if (pulse.alpha <= 0) { pulse.active = false; }
        else {
          ctx.beginPath(); ctx.arc(cx, cy, pulse.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,245,255,${pulse.alpha})`;
          ctx.lineWidth = 1.5; ctx.stroke();
        }
      }

      /* loading ring */
      ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.arc(0, 0, 58, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,245,255,0.07)"; ctx.lineWidth = 2; ctx.stroke();

      const pct = Math.min(progress / 100, 1);
      ctx.beginPath();
      ctx.arc(0, 0, 58, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2);
      ctx.strokeStyle = "#00f5ff"; ctx.lineWidth = 2;
      ctx.shadowColor = "#00f5ff"; ctx.shadowBlur = 14;
      ctx.stroke(); ctx.shadowBlur = 0;

      /* rotating dashed outer ring */
      ctx.rotate(t * 0.038);
      ctx.beginPath(); ctx.arc(0, 0, 72, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,245,255,0.18)"; ctx.lineWidth = 1;
      ctx.setLineDash([4, 9]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();

      /* centre text */
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "700 10px JetBrains Mono";
      ctx.fillStyle = "rgba(0,245,255,0.75)";
      ctx.fillText("INITIALIZING", cx, cy - 9);
      ctx.font = "900 15px Orbitron";
      ctx.fillStyle = "#fff";
      ctx.fillText(Math.floor(progress) + "%", cx, cy + 10);
      ctx.font = "400 9px JetBrains Mono";
      ctx.fillStyle = "rgba(0,245,255,0.38)";
      ctx.fillText("AI · STREAM · ENGINE", cx, cy + 27);
      ctx.restore();

      /* footer readout */
      ctx.save();
      ctx.font = "700 9px JetBrains Mono";
      ctx.fillStyle = "rgba(0,245,255,0.28)";
      ctx.textAlign = "left";
      ctx.fillText(`FRAME:${String(t).padStart(5, "0")}`, 14, H - 18);
      ctx.textAlign = "right";
      ctx.fillText("NEURAL · DECODE · ACTIVE", W - 14, H - 18);
      ctx.restore();

      progress += 2.2;
      t++;

      if (progress < 100) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        animRef.current = 0;
        onComplete();
      }
    };
    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [active, canvasRef, onComplete]);
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
    const out = a.createGain(); out.gain.value = 0.45; out.connect(a.destination);

    /* sweep */
    const sw = a.createOscillator(); sw.type = "sawtooth";
    sw.frequency.setValueAtTime(80, t);
    sw.frequency.exponentialRampToValueAtTime(1800, t + 0.35);
    const sg = a.createGain();
    sg.gain.setValueAtTime(0.001, t);
    sg.gain.linearRampToValueAtTime(0.22, t + 0.12);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1200;
    sw.connect(lp); lp.connect(sg); sg.connect(out);
    sw.start(t); sw.stop(t + 0.4);

    /* tri-tone confirm */
    [660, 880, 1100].forEach((f, i) => {
      const o = a.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const g = a.createGain();
      g.gain.setValueAtTime(0.12, t + 0.5 + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.75 + i * 0.07);
      o.connect(g); g.connect(out);
      o.start(t + 0.5 + i * 0.07); o.stop(t + 0.82 + i * 0.07);
    });

    /* beep */
    const bp = a.createOscillator(); bp.type = "sine"; bp.frequency.value = 1400;
    const bg = a.createGain();
    bg.gain.setValueAtTime(0.1, t + 0.82);
    bg.gain.exponentialRampToValueAtTime(0.001, t + 1.05);
    bp.connect(bg); bg.connect(out);
    bp.start(t + 0.82); bp.stop(t + 1.1);
  }, [getAC]);

  const playClose = useCallback(() => {
    const a = getAC(), t = a.currentTime;
    const out = a.createGain(); out.gain.value = 0.4; out.connect(a.destination);

    const o = a.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(1200, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    const g = a.createGain();
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1500;
    o.connect(lp); lp.connect(g); g.connect(out);
    o.start(t); o.stop(t + 0.6);
  }, [getAC]);

  return { playOpen, playClose };
}

/* ─── VideoIntro Section ─────────────────────────────────────────────── */
export default function VideoIntro() {
  const thumbRef   = useRef<HTMLCanvasElement>(null);
  const loadRef    = useRef<HTMLCanvasElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  const [open,       setOpen]       = useState(false);
  const [phase,      setPhase]      = useState<"idle" | "building" | "loading" | "playing" | "closing">("idle");
  const [bufPct,     setBufPct]     = useState(0);
  const [sysTime,    setSysTime]    = useState("00:00:00");
  const [showCanvas, setShowCanvas] = useState(true);

  const { playOpen, playClose } = useAudio();

  /* system clock */
  useEffect(() => {
    const iv = setInterval(() => {
      const n = new Date();
      setSysTime(`${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  /* thumbnail canvas */
  useThumbnailCanvas(thumbRef);

  /* loading canvas → fires when loading phase is active */
  const handleLoadComplete = useCallback(() => {
    setShowCanvas(false);
    setPhase("playing");
    videoRef.current?.play();
  }, []);
  useModalCanvas(loadRef, phase === "loading", handleLoadComplete);

  /* open */
  const openModal = useCallback(() => {
    if (open) return;
    playOpen();
    setOpen(true);
    setShowCanvas(true);
    setBufPct(0);
    setPhase("building");

    /* buffer animation */
    let v = 0;
    const iv = setInterval(() => {
      v = Math.min(v + 3, 100);
      setBufPct(v);
      if (v >= 100) clearInterval(iv);
    }, 30);

    /* start loading canvas after HUD-reveal */
    setTimeout(() => setPhase("loading"), 380);
  }, [open, playOpen]);

  /* close */
  const closeModal = useCallback(() => {
    if (!open) return;
    playClose();
    setPhase("closing");
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setTimeout(() => {
      setOpen(false);
      setPhase("idle");
      setShowCanvas(true);
    }, 480);
  }, [open, playClose]);

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
        @keyframes vi-ping     { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes vi-pingRing { 0%{transform:scale(.9);opacity:.6} 100%{transform:scale(1.75);opacity:0} }
        @keyframes vi-thumbScan{ 0%{top:-2px;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes vi-hudReveal{
          0%{opacity:0;clip-path:inset(50% 0 50% 0)}
          30%{opacity:1;clip-path:inset(18% 0 18% 0)}
          65%{clip-path:inset(2% 0 2% 0)}
          82%{clip-path:inset(0% 0 0% 0);filter:brightness(2.2)}
          100%{clip-path:inset(0% 0 0% 0);filter:brightness(1)}
        }
        @keyframes vi-hudClose{
          0%{opacity:1;clip-path:inset(0% 0 0% 0);filter:brightness(1)}
          18%{filter:brightness(2)}
          55%{clip-path:inset(22% 0 22% 0);opacity:.7}
          100%{clip-path:inset(50% 0 50% 0);opacity:0}
        }
        @keyframes vi-scanH{ 0%{opacity:1;transform:scaleX(0)} 60%{opacity:1;transform:scaleX(1)} 100%{opacity:0;transform:scaleX(1)} }
        @keyframes vi-scanV{ 0%{opacity:1;transform:scaleY(0)} 60%{opacity:1;transform:scaleY(1)} 100%{opacity:0;transform:scaleY(1)} }
        @keyframes vi-hdrPulse{ 0%,100%{opacity:.18} 50%{opacity:.65} }
        @keyframes vi-mfFill  { to{width:100%} }
        @keyframes vi-glitch  { 0%,94%,98%,100%{clip-path:none;transform:none} 95%{clip-path:inset(20% 0 60% 0);transform:translateX(4px)} 96%{clip-path:inset(60% 0 10% 0);transform:translateX(-3px)} 97%{clip-path:none} }

        .vi-hud-reveal  { animation: vi-hudReveal .62s ease-out forwards; }
        .vi-hud-close   { animation: vi-hudClose  .45s ease-in  forwards; }
        .vi-scan-h-top  { animation: vi-scanH .4s       ease-out forwards; transform-origin: left; }
        .vi-scan-h-bot  { animation: vi-scanH .4s .08s  ease-out forwards; transform-origin: left; }
        .vi-scan-v-l    { animation: vi-scanV .35s .2s  ease-out forwards; transform-origin: top; }
        .vi-scan-v-r    { animation: vi-scanV .35s .28s ease-out forwards; transform-origin: top; }
        .vi-thumb-scan  { animation: vi-thumbScan 4s ease-in-out infinite; }
        .vi-play-ring-1 { animation: vi-pingRing 2.6s ease-out infinite; }
        .vi-play-ring-2 { animation: vi-pingRing 2.6s 1.3s ease-out infinite; }
        .vi-led-blink   { animation: vi-ping 1.4s ease-in-out infinite; }
        .vi-hdr-pulse::after{ animation: vi-hdrPulse 3s infinite; }
        .vi-mf-fill::after  { animation: vi-mfFill 1.2s .7s forwards; }
        .vi-glitch      { animation: vi-glitch 6s infinite; }
      `}</style>

      {/* ════════════════════════════════
          SECTION
      ════════════════════════════════ */}
      <section id="intro-video" className="py-24" style={{ background: "#000510" }}>
        <div className="max-w-5xl mx-auto px-6">

          {/* header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span style={{ display: "block", width: "30px", height: "1px", background: "rgba(0,245,255,0.35)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", color: "rgba(0,245,255,0.55)" }}>
              Introduction Video
            </span>
            <span style={{ display: "block", width: "30px", height: "1px", background: "rgba(0,245,255,0.35)" }} />
          </div>

          <h2 className="section-title text-center mb-3">Meet The Engineer</h2>
          <div className="section-divider mx-auto" style={{ background: "linear-gradient(90deg, transparent, #00f5ff, transparent)" }} />

          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px", textAlign: "center", marginBottom: "48px" }}>
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
              border: "1px solid rgba(0,245,255,0.14)",
              background: "#080c18",
              transition: "border-color .3s, box-shadow .3s",
            }}
            className="group"
          >
            {/* neural canvas bg */}
            <canvas
              ref={thumbRef}
              style={{ display: "block", width: "100%", height: "360px" }}
            />

            {/* scan line */}
            <div className="vi-thumb-scan" style={{
              position: "absolute", left: 0, right: 0, height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)",
              pointerEvents: "none",
            }} />

            {/* overlay */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgba(2,4,14,0.72) 0%, rgba(6,10,24,0.55) 100%)",
              transition: "background .3s",
            }}>
              {/* play button */}
              <div
                style={{
                  width: "90px", height: "90px", borderRadius: "50%",
                  border: "2px solid rgba(0,245,255,0.55)",
                  background: "rgba(0,245,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", marginBottom: "24px",
                  transition: "all .3s",
                }}
                className="group-hover:[border-color:rgba(0,245,255,1)] group-hover:[box-shadow:0_0_40px_rgba(0,245,255,0.45),inset_0_0_20px_rgba(0,245,255,0.1)] group-hover:scale-105"
              >
                {/* ping rings */}
                <div className="vi-play-ring-1" style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "1px solid rgba(0,245,255,0.22)", pointerEvents: "none" }} />
                <div className="vi-play-ring-2" style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "1px solid rgba(0,245,255,0.22)", pointerEvents: "none" }} />
                {/* play triangle */}
                <div style={{
                  width: 0, height: 0,
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  borderLeft: "24px solid #00f5ff",
                  marginLeft: "6px",
                  filter: "drop-shadow(0 0 8px #00f5ff)",
                }} />
              </div>

              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "14px", color: "#fff", letterSpacing: "1px", marginBottom: "6px" }}>
                My Story · Who I Am
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "2px", textTransform: "uppercase" }}>
                Click to play · Introduction
              </div>
            </div>

            {/* corner brackets */}
            {(["tl","tr","bl","br"] as const).map(pos => (
              <div key={pos} style={{
                position: "absolute", width: "16px", height: "16px",
                ...(pos === "tl" ? { top: "14px", left: "14px", borderTop: "2px solid rgba(0,245,255,0.6)", borderLeft: "2px solid rgba(0,245,255,0.6)" } : {}),
                ...(pos === "tr" ? { top: "14px", right: "14px", borderTop: "2px solid rgba(0,245,255,0.6)", borderRight: "2px solid rgba(0,245,255,0.6)" } : {}),
                ...(pos === "bl" ? { bottom: "14px", left: "14px", borderBottom: "2px solid rgba(0,245,255,0.6)", borderLeft: "2px solid rgba(0,245,255,0.6)" } : {}),
                ...(pos === "br" ? { bottom: "14px", right: "14px", borderBottom: "2px solid rgba(0,245,255,0.6)", borderRight: "2px solid rgba(0,245,255,0.6)" } : {}),
                pointerEvents: "none",
              }} />
            ))}

            {/* bottom-right badge */}
            <div style={{
              position: "absolute", bottom: "18px", right: "18px",
              padding: "5px 12px",
              background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.22)",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
              color: "#00f5ff", letterSpacing: "1px",
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
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
            animation: phase === "closing" ? "none" : "vi-fadeIn .08s forwards",
          }}
        >
          <style>{`
            @keyframes vi-fadeIn { from{opacity:0} to{opacity:1} }
          `}</style>

          {/* backdrop */}
          <div
            onClick={closeModal}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(2,3,10,0.92)",
              backdropFilter: "blur(14px)",
            }}
          />

          {/* HUD frame */}
          <div
            style={{
              position: "relative", zIndex: 10,
              width: "100%", maxWidth: "900px",
            }}
          >
            <div
              className={phase === "building" ? "vi-hud-reveal" : phase === "closing" ? "vi-hud-close vi-glitch" : ""}
              style={{
                border: "1px solid rgba(0,245,255,0.28)",
                background: "rgba(3,5,14,0.97)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* scan beam lines (building phase) */}
              {phase === "building" && (
                <>
                  <div className="vi-scan-h-top" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#00f5ff,transparent)", zIndex: 20 }} />
                  <div className="vi-scan-h-bot" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#00f5ff,transparent)", zIndex: 20 }} />
                  <div className="vi-scan-v-l"   style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "2px", background: "linear-gradient(180deg,transparent,#00f5ff,transparent)", zIndex: 20 }} />
                  <div className="vi-scan-v-r"   style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "2px", background: "linear-gradient(180deg,transparent,#00f5ff,transparent)", zIndex: 20 }} />
                </>
              )}

              {/* corner decorations */}
              {(["tl","tr","bl","br"] as const).map(pos => (
                <div key={pos} style={{
                  position: "absolute", width: "20px", height: "20px", zIndex: 15,
                  ...(pos === "tl" ? { top: 0, left: 0, borderTop: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff" } : {}),
                  ...(pos === "tr" ? { top: 0, right: 0, borderTop: "2px solid #00f5ff", borderRight: "2px solid #00f5ff" } : {}),
                  ...(pos === "bl" ? { bottom: 0, left: 0, borderBottom: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff" } : {}),
                  ...(pos === "br" ? { bottom: 0, right: 0, borderBottom: "2px solid #00f5ff", borderRight: "2px solid #00f5ff" } : {}),
                  pointerEvents: "none",
                }} />
              ))}

              {/* ── HEADER ── */}
              <div
                className="vi-hdr-pulse"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 18px",
                  borderBottom: "1px solid rgba(0,245,255,0.1)",
                  background: "rgba(0,245,255,0.025)",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* header line pulse */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
                  background: "linear-gradient(90deg,transparent,#00f5ff,transparent)",
                  animation: "vi-hdrPulse 3s infinite",
                }} />

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="vi-led-blink" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", flexShrink: 0, display: "inline-block" }} />
                  <div>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "11px", fontWeight: 700, color: "#00f5ff", letterSpacing: "2px", textTransform: "uppercase" }}>
                      Intro Reel · Playback Active
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "rgba(0,245,255,0.32)", letterSpacing: "1px", marginTop: "2px" }}>
                      SYS://MEDIA-STREAM · NEURAL-RENDER-ENGINE · MK-2025
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  style={{
                    width: "32px", height: "32px",
                    border: "1px solid rgba(0,245,255,0.2)",
                    background: "rgba(0,245,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "rgba(255,255,255,0.38)",
                    fontSize: "16px", lineHeight: 1, flexShrink: 0,
                    transition: "all .2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,50,100,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "#ff4466"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,245,255,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.38)"; }}
                >
                  ✕
                </button>
              </div>

              {/* ── VIDEO AREA ── */}
              <div style={{ position: "relative", background: "#000", aspectRatio: "16/9", overflow: "hidden" }}>

                {/* loading canvas */}
                <canvas
                  ref={loadRef}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    zIndex: 5,
                    opacity: showCanvas ? 1 : 0,
                    transition: "opacity .5s",
                    pointerEvents: "none",
                  }}
                />

                {/* actual video */}
                <video
                  ref={videoRef}
                  src="/videos/intro.mp4"
                  controls
                  playsInline
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    zIndex: 4,
                    opacity: phase === "playing" ? 1 : 0,
                    transition: "opacity .5s",
                  }}
                />

                {/* glitch stripes during build */}
                {(phase === "building" || phase === "loading") && (
                  <>
                    {[{ top: "30%", h: "2px" }, { top: "62%", h: "1px" }, { top: "80%", h: "3px" }].map((s, i) => (
                      <div key={i} style={{
                        position: "absolute", left: 0, right: 0,
                        top: s.top, height: s.h,
                        background: "#00f5ff", mixBlendMode: "screen",
                        zIndex: 6, pointerEvents: "none",
                        opacity: 0,
                        animation: `vi-glitchStripe .18s ${i * 60}ms forwards`,
                      }} />
                    ))}
                    <style>{`@keyframes vi-glitchStripe{0%{opacity:0}30%{opacity:.8}80%{opacity:.3}100%{opacity:0}}`}</style>
                  </>
                )}
              </div>

              {/* ── FOOTER ── */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 18px",
                borderTop: "1px solid rgba(0,245,255,0.1)",
                background: "rgba(0,245,255,0.015)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {/* buffer stat */}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "rgba(0,245,255,0.28)", letterSpacing: "1px", textTransform: "uppercase" }}>
                    BUFFER{" "}
                    <span style={{ color: "rgba(0,245,255,0.6)" }}>{bufPct}%</span>
                  </span>
                  {/* progress bar */}
                  <div className="vi-mf-fill" style={{
                    width: "80px", height: "1px", background: "rgba(0,245,255,0.1)", position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", inset: 0, width: `${bufPct}%`,
                      background: "#00f5ff", transition: "width .1s linear",
                    }} />
                  </div>
                  {[{ label: "CODEC", val: "H.265·AI" }, { label: "RES", val: "FULL·HD" }].map(s => (
                    <span key={s.label} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "rgba(0,245,255,0.28)", letterSpacing: "1px", textTransform: "uppercase" }}>
                      {s.label} <span style={{ color: "rgba(0,245,255,0.6)" }}>{s.val}</span>
                    </span>
                  ))}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "rgba(0,245,255,0.28)", letterSpacing: "1px" }}>
                  SYS {sysTime}
                </span>
              </div>

            </div>{/* end hud */}
          </div>
        </div>
      )}
    </>
  );
}
