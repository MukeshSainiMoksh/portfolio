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

function useTypewriter(words: string[], speed = 95, pause = 2200) {
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

/* ─── Portrait ────────────────────────────────────────────────────────
   Interim treatment. Phase 1 replaces this with the depth-displaced
   point cloud; the surrounding layout slot stays the same.            */
function Portrait() {
  return (
    <div
      className="relative shrink-0 animate-fade-in-up"
      style={{ opacity: 0, animationDelay: "0.35s" }}
    >
      {/* soft accent bloom behind the photo */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 animate-float"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgb(var(--accent-rgb) / 0.22), transparent 68%)",
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="relative overflow-hidden"
        style={{
          width: "clamp(160px, 34vw, 320px)",
          aspectRatio: "1 / 1.08",
          borderRadius: "var(--r-xl)",
          border: "1px solid var(--hairline-strong)",
          background: "var(--surface-2)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <Image
          src="/images/photo.jpg"
          alt="Mukesh Kumar Saini"
          fill
          priority
          sizes="(max-width: 1024px) 40vw, 320px"
          style={{ objectFit: "cover", objectPosition: "center 18%" }}
        />
        {/* bottom scrim so the surface reads as one material with the page */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(var(--surface-0-rgb) / 0.55), transparent 42%)",
          }}
        />
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

  /* Ambient particle field. Phase 2 replaces this with the WebGL latent
     field; kept deliberately sparse so it costs almost nothing. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Node = { x: number; y: number; vx: number; vy: number; size: number };
    let animId = 0;
    const nodes: Node[] = [];
    const LINK_DIST = 120;

    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodes.length  = 0;
      const density = window.innerWidth < 768 ? 42000 : 26000;
      const count   = Math.min(46, Math.floor((canvas.width * canvas.height) / density));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x:    Math.random() * canvas.width,
          y:    Math.random() * canvas.height,
          vx:   (Math.random() - 0.5) * 0.22,
          vy:   (Math.random() - 0.5) * 0.22,
          size: 0.8 + Math.random() * 1.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            // Canvas 2D can't read CSS vars — literal mirrors --accent-rgb
            ctx.strokeStyle = `rgba(110,123,255,${(1 - dist / LINK_DIST) * 0.14})`;
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(165,174,255,0.5)";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
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

  // Last word of the name carries the serif-italic emphasis.
  const nameParts = name.trim().split(/\s+/);
  const nameLead  = nameParts.slice(0, -1).join(" ");
  const nameTail  = nameParts[nameParts.length - 1] ?? "";

  const socials = [
    { href: githubUrl, label: "GitHub", icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    )},
    { href: linkedinUrl, label: "LinkedIn", icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )},
    { href: "#contact", label: "Email", icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
      style={{ background: "var(--surface-0)" }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="hero-grid absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-32">
        <div className="flex flex-col-reverse items-start gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">

          {/* ── Text column ── */}
          <div className="min-w-0 flex-1">

            {availability !== "off" && (
              <div
                className="mb-7 inline-flex items-center gap-2.5 animate-fade-in"
                style={{
                  opacity: 0,
                  animationDelay: "0.05s",
                  padding: "6px 13px 6px 10px",
                  borderRadius: "999px",
                  border: "1px solid var(--hairline)",
                  background: "rgb(255 255 255 / 0.035)",
                }}
              >
                <span className="glow-dot" aria-hidden="true" />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--step-meta)",
                    color: "var(--text-2)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {availability}
                </span>
              </div>
            )}

            <h1
              className="animate-fade-in-up mb-6"
              style={{
                opacity: 0,
                animationDelay: "0.12s",
                fontSize: "var(--step-display)",
                lineHeight: 0.94,
                letterSpacing: "-0.045em",
                fontWeight: 700,
                color: "var(--text-1)",
                textWrap: "balance",
              }}
            >
              {nameLead}{" "}
              <span className="display-serif gradient-text" style={{ letterSpacing: "-0.015em" }}>
                {nameTail}
              </span>
            </h1>

            <div
              className="animate-fade-in-up mb-6 flex items-center gap-2"
              style={{ opacity: 0, animationDelay: "0.22s", minHeight: "28px" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(14px, 1.7vw, 18px)",
                  color: "var(--accent-soft)",
                }}
              >
                {role}
              </span>
              <span
                aria-hidden="true"
                className="animate-blink inline-block"
                style={{ width: "2px", height: "1.15em", background: "var(--accent)" }}
              />
            </div>

            <p
              className="animate-fade-in-up mb-10 max-w-xl"
              style={{
                opacity: 0,
                animationDelay: "0.3s",
                color: "var(--text-2)",
                fontSize: "clamp(16px, 1.5vw, 18px)",
                lineHeight: 1.65,
                textWrap: "pretty",
              }}
            >
              {subtitle}
            </p>

            <div
              className="animate-fade-in-up mb-14 flex flex-wrap items-center gap-3"
              style={{ opacity: 0, animationDelay: "0.38s" }}
            >
              <a href="#projects" className="btn-cosmic" onClick={() => sfx.scan()}>
                View my work
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              <a
                href={resumeUrl !== "#" ? resumeUrl : "/Mukesh_Saini_CV.pdf"}
                download="Mukesh_Saini_CV.pdf"
                className="btn-neural"
                onClick={() => sfx.dataTransfer()}
              >
                Download CV
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>

              <div className="ml-1 flex items-center gap-1">
                {socials.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    onClick={() => sfx.softClick()}
                    className="p-2.5 transition-colors duration-200"
                    style={{ color: "var(--text-3)", borderRadius: "var(--r-md)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Proof metrics */}
            <dl
              className="animate-fade-in-up flex flex-wrap gap-x-12 gap-y-6"
              style={{ opacity: 0, animationDelay: "0.46s" }}
            >
              {[
                { value: "2+",  label: "Years experience" },
                { value: "10+", label: "Projects shipped" },
                { value: "1",   label: "Azure certification" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "clamp(26px, 3vw, 34px)",
                      letterSpacing: "-0.04em",
                      color: "var(--text-1)",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {value.replace(/\+$/, "")}
                    {value.includes("+") && <span style={{ color: "var(--accent-soft)" }}>+</span>}
                  </dd>
                  <p
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--step-meta)",
                      color: "var(--text-3)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Portrait — now present at every breakpoint ── */}
          <Portrait />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="animate-fade-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        style={{ opacity: 0, animationDelay: "0.9s" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--step-meta)",
            color: "var(--text-3)",
            letterSpacing: "0.14em",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "34px",
            background: "linear-gradient(to bottom, rgb(var(--accent-rgb) / 0.5), transparent)",
          }}
        />
      </div>
    </section>
  );
}
