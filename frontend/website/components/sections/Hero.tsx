"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sfx } from "@/services/sounds";

const ROLES = [
  "Software Engineer",
  "AI / ML Engineer",
  "Full-Stack Developer",
  "Azure AI Engineer",
];

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [text, setText]         = useState("");
  const [wordIndex, setWord]    = useState(0);
  const [charIndex, setChar]    = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) setTimeout(() => setDeleting(true), pause);
          else setChar((c) => c + 1);
        } else {
          setText(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) { setDeleting(false); setWord((w) => w + 1); setChar(0); }
          else setChar((c) => c - 1);
        }
      },
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return text;
}

/* ─── Hex Scanner Profile Photo ─────────────────────────────────────── */
function HexProfile() {
  return (
    <div
      className="hidden lg:flex flex-col items-center gap-8 animate-fade-in-up"
      style={{ opacity: 0, animationDelay: "0.5s" }}
    >
      {/* keyframes scoped to this component */}
      <style>{`
        @keyframes hexBorderSpin  { from { transform: rotate(0deg)  } to { transform: rotate(360deg)  } }
        @keyframes hexRingReverse { from { transform: rotate(0deg)  } to { transform: rotate(-360deg) } }
        @keyframes hexScanLine    { 0%{top:-2px;opacity:0} 8%{opacity:1} 92%{opacity:.7} 100%{top:100%;opacity:0} }
        @keyframes hexPing        { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.2;transform:scale(.5)} }
        @keyframes hexPingX       { 0%,100%{opacity:1;transform:translateX(-50%) scale(1)} 50%{opacity:.2;transform:translateX(-50%) scale(.5)} }
        @keyframes tagDrift1      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-5px)} }
        @keyframes tagDrift2      { 0%,100%{transform:translateY(0)}   50%{transform:translateY( 5px)} }
        @keyframes tagDrift3      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-4px)} }
        @keyframes statusBlink    { 0%,100%{opacity:1} 50%{opacity:.25} }

        .hex-svg-spin   { animation: hexBorderSpin  10s linear infinite; transform-origin: center; }
        .hex-ring-rev   { animation: hexRingReverse 18s linear infinite; }
        .hex-scan-line  { animation: hexScanLine    3.2s ease-in-out infinite; }
        .hex-dot-top    { animation: hexPingX       1.8s ease-in-out infinite; }
        .hex-dot-bot    { animation: hexPingX       1.8s ease-in-out infinite .65s; }
        .hex-dot-l      { animation: hexPing        1.8s ease-in-out infinite .32s; }
        .hex-dot-r      { animation: hexPing        1.8s ease-in-out infinite .97s; }
        .hex-tag-1      { animation: tagDrift1      3.3s ease-in-out infinite; }
        .hex-tag-2      { animation: tagDrift2      3.9s ease-in-out infinite; }
        .hex-tag-3      { animation: tagDrift3      4.2s ease-in-out infinite; }
        .hex-status-dot { animation: statusBlink    1.4s ease-in-out infinite; }
      `}</style>

      {/* ── outer positioning shell (tags need to overflow) ── */}
      <div style={{ position: "relative", width: "270px", height: "270px", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* dashed revolving ring */}
        <div className="hex-ring-rev" style={{
          position: "absolute", inset: "-22px", borderRadius: "50%",
          border: "1px dashed rgba(0,245,255,0.18)",
          pointerEvents: "none",
        }} />

        {/* rotating SVG hex border */}
        <div className="hex-svg-spin" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
          <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%" }}>
            {/* outer dashed hex */}
            <polygon points="100,6 190,53 190,147 100,194 10,147 10,53"
              stroke="rgba(0,245,255,0.42)" strokeWidth="1.2" strokeDasharray="6 5" fill="none" />
            {/* inner subtle hex */}
            <polygon points="100,18 178,62 178,138 100,182 22,138 22,62"
              stroke="rgba(0,245,255,0.1)" strokeWidth="1" fill="none" />
            {/* vertex tick marks */}
            <line x1="100" y1="2"   x2="100" y2="13"  stroke="#00f5ff" strokeWidth="2.2" opacity=".85"/>
            <line x1="100" y1="187" x2="100" y2="198" stroke="#00f5ff" strokeWidth="2.2" opacity=".85"/>
            <line x1="7"   y1="50"  x2="15"  y2="54"  stroke="#00f5ff" strokeWidth="2.2" opacity=".85"/>
            <line x1="185" y1="50"  x2="193" y2="54"  stroke="#00f5ff" strokeWidth="2.2" opacity=".85"/>
            <line x1="7"   y1="150" x2="15"  y2="146" stroke="#00f5ff" strokeWidth="2.2" opacity=".85"/>
            <line x1="185" y1="150" x2="193" y2="146" stroke="#00f5ff" strokeWidth="2.2" opacity=".85"/>
            {/* subtle arc accents at top/bottom */}
            <path d="M 78 12 A 30 30 0 0 1 122 12" stroke="rgba(0,245,255,0.25)" strokeWidth="1" fill="none"/>
            <path d="M 78 188 A 30 30 0 0 0 122 188" stroke="rgba(0,245,255,0.25)" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        {/* ambient glow behind photo */}
        <div style={{
          position: "absolute", width: "190px", height: "190px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(0,245,255,0.08) 60%, transparent 80%)",
          zIndex: 1, filter: "blur(12px)",
        }} />

        {/* ── photo clipped to hexagon ── */}
        <div style={{
          width: "178px", height: "178px", position: "relative", zIndex: 3,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          overflow: "hidden", background: "#07010f",
        }}>
          <Image
            src="/images/photo.jpg"
            alt="Mukesh Kumar"
            width={178} height={178}
            priority
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top",
              filter: "saturate(0.72) contrast(1.12) brightness(0.92)",
              display: "block",
            }}
          />
          {/* cyan-purple colour-grade overlay */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: "linear-gradient(170deg, rgba(0,245,255,0.07) 0%, rgba(168,85,247,0.1) 100%)",
            mixBlendMode: "screen",
          }} />
          {/* biometric scan line */}
          <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", overflow: "hidden" }}>
            <div className="hex-scan-line" style={{
              position: "absolute", left: 0, right: 0, height: "2px",
              background: "linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.8) 40%, rgba(168,85,247,0.6) 60%, transparent 100%)",
            }} />
          </div>
          {/* subtle scanlines texture */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)",
          }} />
        </div>

        {/* corner ping dots — top */}
        <div className="hex-dot-top" style={{
          position: "absolute", top: "7px", left: "50%",
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#00f5ff", boxShadow: "0 0 10px #00f5ff, 0 0 20px rgba(0,245,255,0.4)",
          zIndex: 6,
        }} />
        {/* bottom */}
        <div className="hex-dot-bot" style={{
          position: "absolute", bottom: "7px", left: "50%",
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#00f5ff", boxShadow: "0 0 10px #00f5ff, 0 0 20px rgba(0,245,255,0.4)",
          zIndex: 6,
        }} />
        {/* left */}
        <div className="hex-dot-l" style={{
          position: "absolute", top: "50%", left: "9px",
          width: "6px", height: "6px", borderRadius: "50%",
          background: "#a855f7", boxShadow: "0 0 9px #a855f7, 0 0 18px rgba(168,85,247,0.4)",
          zIndex: 6, transform: "translateY(-50%)",
        }} />
        {/* right */}
        <div className="hex-dot-r" style={{
          position: "absolute", top: "50%", right: "9px",
          width: "6px", height: "6px", borderRadius: "50%",
          background: "#a855f7", boxShadow: "0 0 9px #a855f7, 0 0 18px rgba(168,85,247,0.4)",
          zIndex: 6, transform: "translateY(-50%)",
        }} />

        {/* ── floating data tags ── */}

        {/* tag right-top: AI / ML */}
        <div className="hex-tag-1" style={{
          position: "absolute", top: "14px", right: "-118px", zIndex: 7,
          display: "flex", alignItems: "center", gap: "6px",
          padding: "5px 11px",
          background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.22)",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "8px",
          letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,245,255,0.75)",
          whiteSpace: "nowrap",
        }}>
          {/* connector */}
          <span style={{ position: "absolute", width: "20px", height: "1px", background: "rgba(0,245,255,0.18)", top: "50%", right: "100%", transform: "translateY(-50%)" }} />
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 5px #00f5ff", flexShrink: 0, display: "inline-block" }} />
          AI / ML
        </div>

        {/* tag right-bottom: AZURE CERT */}
        <div className="hex-tag-2" style={{
          position: "absolute", bottom: "30px", right: "-130px", zIndex: 7,
          display: "flex", alignItems: "center", gap: "6px",
          padding: "5px 11px",
          background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.22)",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "8px",
          letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,245,255,0.75)",
          whiteSpace: "nowrap",
        }}>
          <span style={{ position: "absolute", width: "16px", height: "1px", background: "rgba(0,245,255,0.18)", top: "50%", right: "100%", transform: "translateY(-50%)" }} />
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 5px #00ff88", flexShrink: 0, display: "inline-block" }} />
          VERIFIED
        </div>

        {/* tag left: ACTIVE */}
        <div className="hex-tag-3" style={{
          position: "absolute", top: "42%", left: "-108px", zIndex: 7,
          display: "flex", alignItems: "center", gap: "6px",
          padding: "5px 11px",
          background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.22)",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "8px",
          letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,245,255,0.75)",
          whiteSpace: "nowrap",
        }}>
          {/* connector (points right → toward hex) */}
          <span style={{ position: "absolute", width: "14px", height: "1px", background: "rgba(0,245,255,0.18)", top: "50%", left: "100%", transform: "translateY(-50%)" }} />
          <span className="hex-status-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 5px #00ff88", flexShrink: 0, display: "inline-block" }} />
          ACTIVE
        </div>
      </div>

      {/* ── name + status below ── */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 900,
          fontSize: "13px", color: "#fff", letterSpacing: "3px", lineHeight: 1.4,
        }}>
          MUKESH KUMAR
          <span style={{ display: "block", color: "#00f5ff", letterSpacing: "5px", fontSize: "11px", opacity: 0.85 }}>
            SAINI
          </span>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
          color: "#00f5ff", letterSpacing: "3px", textTransform: "uppercase", marginTop: "5px",
        }}>
          Software Engineer
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────── */
export default function Hero({
  profile,
  about,
  resumeUrl: resumeUrlProp,
}: {
  profile: Record<string, string>;
  about: Record<string, string>;
  resumeUrl?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const role = useTypewriter(ROLES);

  /* neural network canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Node = { x: number; y: number; vx: number; vy: number; size: number; pulse: number };
    let animId: number;
    const nodes: Node[] = [];

    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodes.length  = 0;
      // lower particle density on small screens (CPU/battery)
      const density = window.innerWidth < 768 ? 28000 : 14000;
      const count   = Math.floor((canvas.width * canvas.height) / density);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          vx:    (Math.random() - 0.5) * 0.35,
          vy:    (Math.random() - 0.5) * 0.35,
          size:  1 + Math.random() * 1.8,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.025;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height)  n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,245,255,${(1 - dist / 140) * 0.12})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const alpha = 0.35 + 0.45 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * (0.85 + 0.15 * Math.sin(n.pulse)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,255,${alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  const availability = profile.availability ?? "Available for opportunities";
  const name        = profile.name       ?? "Mukesh Kumar Saini";
  const subtitle    = profile.subtitle   ?? "Building intelligent, scalable AI systems and full-stack applications with modern technologies";
  const githubUrl   = about.github_url   ?? "#";
  const linkedinUrl = about.linkedin_url ?? "#";
  const resumeUrl   = resumeUrlProp ?? about.resume_url ?? "#";

  const nameParts   = name.split(" ");
  const firstName   = nameParts[0] ?? "";
  const middleName  = nameParts[1] ?? "";
  const lastName    = nameParts.slice(2).join(" ");

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#000308" }}>
      {/* Neural canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid opacity-60" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] animate-float"
           style={{ background: "rgba(0,245,255,0.05)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] animate-float"
           style={{ background: "rgba(168,85,247,0.06)", animationDelay: "2.5s" }} />

      {/* Status badge — top right (admin-managed via hero.availability; set "off" to hide) */}
      {availability !== "off" && (
        <div
          className="absolute top-24 right-8 border border-[rgba(0,245,255,0.15)] px-4 py-2.5 hidden md:block animate-fade-in"
          style={{ opacity: 0, animationDelay: "0.8s", background: "rgba(0,245,255,0.03)" }}
        >
          <span className="text-[rgba(0,245,255,0.6)] uppercase tracking-[2px]"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88] mr-2 animate-pulse" />
            {availability}
          </span>
        </div>
      )}

      {/* Main two-column layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32 w-full">
        <div className="flex items-center justify-between gap-8">

          {/* ── LEFT: text content ── */}
          <div className="flex-1 min-w-0">
            {/* Eyebrow — word-by-word reveal */}
            <div
              className="mb-6 flex flex-wrap gap-x-[0.55em]"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#00f5ff", letterSpacing: "4px", textTransform: "uppercase" }}
            >
              {["Building", "the", "AI", "layer", "between", "ideas", "and", "reality."].map((word, i) => (
                <span
                  key={i}
                  className="animate-fade-in"
                  style={{ opacity: 0, animationDelay: `${i * 0.12}s` }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Name */}
            <h1
              className="mb-4 leading-[1.05] animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "0.1s", fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "clamp(40px, 6.5vw, 82px)", letterSpacing: "-2px" }}
            >
              <span className="text-white block">{firstName}</span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
              >
                {middleName}
              </span>
              {lastName && (
                <span
                  className="block"
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 46px)",
                    color: "#00f5ff",
                    letterSpacing: "8px",
                    opacity: 0.85,
                    fontWeight: 700,
                  }}
                >
                  {lastName}
                </span>
              )}
            </h1>

            {/* Typewriter role */}
            <div
              className="flex items-center gap-2 mb-6 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "0.2s", height: "36px" }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(13px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)" }}>{"< "}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(13px, 1.8vw, 18px)", color: "#00f5ff" }}>{role}</span>
              <span className="inline-block w-0.5 bg-[#00f5ff] animate-blink" style={{ height: "1.2em" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(13px, 1.8vw, 18px)", color: "rgba(255,255,255,0.5)" }}>{" />"}</span>
            </div>

            {/* Subtitle */}
            <p
              className="max-w-xl leading-relaxed mb-10 animate-fade-in-up"
              style={{ opacity: 0, animationDelay: "0.3s", color: "rgba(255,255,255,0.4)", fontSize: "16px", fontFamily: "'Syne', sans-serif" }}
            >
              {subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12 animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.4s" }}>
              <a href="#projects" className="btn-neural" onClick={() => sfx.scan()}>
                View My Work
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href={resumeUrl !== "#" ? resumeUrl : "/Mukesh_Saini_CV.pdf"} download="Mukesh_Saini_CV.pdf" className="btn-neural"
                 onClick={() => sfx.dataTransfer()}
                 style={{ color: "rgba(168,85,247,0.85)", borderColor: "rgba(168,85,247,0.35)", background: "rgba(168,85,247,0.05)" }}>
                Download CV
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-4 ml-2">
                {[
                  { href: githubUrl, label: "GitHub", icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  )},
                  { href: linkedinUrl, label: "LinkedIn", icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )},
                  { href: "#contact", label: "Email", icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )},
                ].map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    onClick={() => sfx.softClick()}
                    className="text-[rgba(255,255,255,0.3)] hover:text-[#00f5ff] transition-colors duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: "0.5s" }}>
              {[
                { value: "2+",  label: "Years Experience" },
                { value: "10+", label: "Projects Built" },
                { value: "1",   label: "Azure Certification" },
              ].map(({ value, label }) => (
                <div key={label} className="border-l border-[rgba(0,245,255,0.2)] pl-4">
                  <div className="text-white leading-none mb-1"
                       style={{ fontFamily: "'Orbitron', monospace", fontWeight: 800, fontSize: "clamp(20px, 2.5vw, 28px)" }}>
                    {value.replace(/\+$/, "")}
                    {value.includes("+") && <span className="text-[#00f5ff]">+</span>}
                  </div>
                  <div className="text-[rgba(255,255,255,0.3)] uppercase tracking-[2px]"
                       style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: hex profile photo ── */}
          <div className="shrink-0 flex items-center justify-center pr-16">
            <HexProfile />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
        style={{ opacity: 0, animationDelay: "1s" }}
      >
        <span className="text-[rgba(255,255,255,0.2)] uppercase tracking-[3px]"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px" }}>
          scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[rgba(0,245,255,0.4)] to-transparent" />
      </div>
    </section>
  );
}
