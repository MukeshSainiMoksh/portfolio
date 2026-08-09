"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { sfx, isMuted, toggleMute } from "@/services/sounds";

const navLinks = [
  { label: "Home",          href: "#home" },
  { label: "About",         href: "#about" },
  { label: "Skills",        href: "#skills" },
  { label: "Experience",    href: "#experience" },
  { label: "Projects",      href: "#projects" },
  { label: "Certifications",href: "#certifications" },
  { label: "Education",     href: "#education" },
  { label: "Contact",       href: "#contact" },
];

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      {muted ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l4-4m0 4l-4-4" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
      )}
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]    = useState(false);
  const [menuOpen, setMenuOpen]    = useState(false);
  const [activeSection, setActive] = useState("home");
  const [muted, setMuted]          = useState(false);
  const rafRef = useRef(0);

  // read persisted mute state after mount (SSR-safe)
  useEffect(() => { setMuted(isMuted()); }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));

    // Scroll-spy reads layout, so it must never run more than once per frame.
    const measure = () => {
      rafRef.current = 0;
      setScrolled(window.scrollY > 24);
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActive(id);
          break;
        }
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav
      className="nav-bar fixed top-0 left-0 right-0 z-50"
      data-scrolled={scrolled ? "true" : "false"}
      style={{ paddingBlock: scrolled ? "10px" : "16px" }}
    >
      <div className="container-shell flex items-center justify-between">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="nav-logo flex items-center gap-2.5 shrink-0"
          style={{ textDecoration: "none" }}
          aria-label="Home"
        >
          <span className="nav-mark" aria-hidden="true" />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "-0.03em",
              color: "var(--text-1)",
            }}
          >
            MKS
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => sfx.click()}
                  aria-current={isActive ? "true" : undefined}
                  data-active={isActive ? "true" : "false"}
                  className="nav-link block"
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ── Sound toggle + CTA ── */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => { const m = toggleMute(); setMuted(m); if (!m) sfx.softClick(); }}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            title={muted ? "Unmute sounds" : "Mute sounds"}
            className="p-2 transition-colors"
            style={{
              borderRadius: "var(--r-md)",
              border: "1px solid var(--hairline)",
              color: "var(--text-3)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; }}
          >
            <SoundIcon muted={muted} />
          </button>

          <a href="#contact" onClick={() => sfx.access()} className="btn-cosmic" style={{ padding: "9px 18px" }}>
            Hire Me
          </a>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="lg:hidden p-2 transition-colors"
          style={{ color: "var(--text-2)", borderRadius: "var(--r-md)" }}
          onClick={() => { setMenuOpen(!menuOpen); sfx.softClick(); }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
            }
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div
          /* Attached to the bar, not floating beside it. */
          className="lg:hidden mt-[10px] px-4 pb-4 pt-2"
          style={{
            background: "rgb(var(--surface-0-rgb) / 0.94)",
            borderTop: "1px solid var(--hairline)",
            backdropFilter: "blur(20px) saturate(1.7)",
            WebkitBackdropFilter: "blur(20px) saturate(1.7)",
            boxShadow: "0 16px 32px -24px rgb(0 0 0 / 0.95)",
          }}
        >
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => { setMenuOpen(false); sfx.click(); }}
                aria-current={isActive ? "true" : undefined}
                data-active={isActive ? "true" : "false"}
                className="nav-link flex items-center gap-2.5"
                style={{ padding: "12px 14px", fontSize: "15px" }}
              >
                {link.label}
              </a>
            );
          })}

          <div className="pt-3 flex items-center gap-2.5">
            <a
              href="#contact"
              onClick={() => { setMenuOpen(false); sfx.access(); }}
              className="btn-cosmic flex-1 justify-center"
            >
              Hire Me
            </a>
            <button
              onClick={() => { const m = toggleMute(); setMuted(m); if (!m) sfx.softClick(); }}
              aria-label={muted ? "Unmute sounds" : "Mute sounds"}
              className="p-3 transition-colors"
              style={{
                borderRadius: "var(--r-md)",
                border: "1px solid var(--hairline)",
                color: "var(--text-3)",
              }}
            >
              <SoundIcon muted={muted} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
