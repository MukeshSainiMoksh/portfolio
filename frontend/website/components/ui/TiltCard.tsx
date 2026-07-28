"use client";

import { CSSProperties, ReactNode, useRef } from "react";

/**
 * 3D mouse-follow tilt wrapper. No-ops on touch devices and for
 * reduced-motion users (checked at interaction time, cheap).
 */
export default function TiltCard({
  children,
  className,
  style,
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 … 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform =
      `perspective(800px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: "transform 0.18s ease-out", willChange: "transform" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
