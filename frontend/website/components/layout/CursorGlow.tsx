"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient cursor glow — dual element: precise dot + large halo.
 * Follows mouse with a spring-eased lag on the halo.
 * pointer-events: none so it never blocks clicks.
 */
export default function CursorGlow() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let haloX = 0, haloY = 0;
    let curX  = 0, curY  = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${curX - 4}px, ${curY - 4}px)`;
        dotRef.current.style.opacity = "1";
      }
    };

    const loop = () => {
      haloX += (curX - haloX) * 0.1;
      haloY += (curY - haloY) * 0.1;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate(${haloX - 220}px, ${haloY - 220}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* small precise dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: "8px", height: "8px",
          borderRadius: "50%",
          background: "rgba(0,245,255,0.9)",
          boxShadow: "0 0 8px rgba(0,245,255,0.8)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transition: "opacity 0.2s",
          mixBlendMode: "screen",
        }}
      />
      {/* ambient halo */}
      <div
        ref={haloRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: "440px", height: "440px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,245,255,0.038) 0%, rgba(168,85,247,0.018) 45%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />
    </>
  );
}
