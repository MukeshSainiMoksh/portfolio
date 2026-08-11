"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Reveals its children when they scroll into view.
 *
 * Replaces the previous approach of `animate-fade-in-up` + an inline
 * `animationDelay`, which fired on page load — so every section below the
 * fold had already finished animating before anyone saw it, and deep links
 * landed mid-animation.
 *
 * Safety: `.reveal` starts at opacity 0, so a `<noscript>` rule in
 * app/layout.tsx un-hides it when JavaScript is unavailable, and the
 * reduced-motion block in globals.css does the same.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Stagger, in seconds. Kept small — long chains feel sluggish. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    // Already on screen at mount (above the fold, or a deep link) — show it
    // immediately rather than waiting for a scroll that may never happen.
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${className}`}
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: shown && delay ? `${delay}s` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}
