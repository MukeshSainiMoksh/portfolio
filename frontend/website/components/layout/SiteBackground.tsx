"use client";

import { useEffect, useRef } from "react";

/**
 * One fixed field behind the entire site.
 *
 * Because it is `position: fixed`, it does not scroll — the same field is
 * continuous under every section, so the page reads as one surface instead
 * of a stack of separately-coloured bands. Its hue drifts from the cool
 * accent at the top of the document toward the warm ember near the contact
 * section, which is subtle enough that nobody notices it consciously.
 *
 * Phase 2 replaces the Canvas 2D loop here with the WebGL latent field; the
 * mounting point and the scroll-progress contract stay the same.
 */

/* Canvas 2D cannot read CSS custom properties — these mirror the tokens
   in app/globals.css and must be kept in sync. */
const ACCENT = [110, 123, 255] as const;
const EMBER  = [255, 138, 76] as const;

type Node = { x: number; y: number; vx: number; vy: number; r: number };

export default function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  /* Document scroll progress, 0 → 1. Read by the draw loop for the hue drift. */
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let running = true;
    const nodes: Node[] = [];
    let dpr = 1;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Coarse device tiering — low-core machines get a much lighter field.
      const cores = navigator.hardwareConcurrency ?? 4;
      const cap = w < 768 ? 26 : cores <= 4 ? 40 : 62;
      const count = Math.min(cap, Math.floor((w * h) / 26000));

      nodes.length = 0;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: 0.7 + Math.random() * 1.2,
        });
      }
    };

    const LINK = 150;

    const draw = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Hue drift: cool accent at the top of the document, warmer near the end.
      const t = progressRef.current * 0.45;
      const R = Math.round(ACCENT[0] + (EMBER[0] - ACCENT[0]) * t);
      const G = Math.round(ACCENT[1] + (EMBER[1] - ACCENT[1]) * t);
      const B = Math.round(ACCENT[2] + (EMBER[2] - ACCENT[2]) * t);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.13;
          ctx.strokeStyle = `rgba(${R},${G},${B},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${R},${G},${B},0.42)`;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (animId) return;
      running = true;
      animId = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      animId = 0;
    };

    // A background field has no business burning cycles on a hidden tab.
    const onVisibility = () => (document.hidden ? stop() : start());

    build();
    start();

    const onResize = () => { build(); };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="site-bg" aria-hidden="true">
      {/* Base wash — two very soft, slowly breathing accent blooms. */}
      <div className="site-bg-wash" />
      {/* Structure — masked grid, strongest at the centre. */}
      <div className="site-bg-grid" />
      {/* The field itself. */}
      <canvas ref={canvasRef} className="site-bg-canvas" />
      {/* Vignette — pulls focus inward and hides the field's hard edges. */}
      <div className="site-bg-vignette" />
    </div>
  );
}
