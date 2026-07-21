"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sfx } from "@/services/sounds";

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

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activeSection, setActive]    = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const ids = navLinks.map((l) => l.href.slice(1));
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[rgba(0,245,255,0.08)]"
          : ""
      }`}
      style={{
        background: scrolled
          ? "rgba(0, 3, 8, 0.92)"
          : "linear-gradient(to bottom, rgba(0,3,8,0.7), transparent)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
          <style>{`
            @keyframes nb-spin  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
            @keyframes nb-spinR { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
            @keyframes nb-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.8)} }
            .nb-ring { animation:nb-spin  10s linear infinite; transform-origin:36px 36px; }
            .nb-ihex { animation:nb-spinR  6s linear infinite; transform-origin:36px 36px; }
            .nb-core { animation:nb-pulse 2.4s ease-in-out infinite; transform-origin:36px 36px; }
          `}</style>

          {/* Geometric hex icon */}
          <div style={{ width: "38px", height: "38px", flexShrink: 0 }}>
            <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
              <defs>
                <filter id="nb-glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* outer rotating dashed ring + cardinal ticks */}
              <g className="nb-ring">
                <circle cx="36" cy="36" r="33" stroke="rgba(0,220,255,0.45)" strokeWidth="1" strokeDasharray="5 4"/>
                <line x1="36" y1="2"  x2="36" y2="9"  stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                <line x1="36" y1="63" x2="36" y2="70" stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                <line x1="2"  y1="36" x2="9"  y2="36" stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                <line x1="63" y1="36" x2="70" y2="36" stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                <circle cx="36" cy="3"  r="2" fill="#00dcff"/>
                <circle cx="36" cy="69" r="2" fill="#00dcff"/>
                <circle cx="3"  cy="36" r="2" fill="#00dcff"/>
                <circle cx="69" cy="36" r="2" fill="#00dcff"/>
              </g>
              {/* static outer hex */}
              <polygon points="36,10 59,23 59,49 36,62 13,49 13,23"
                stroke="rgba(0,220,255,0.22)" strokeWidth="1" fill="rgba(0,220,255,0.03)"/>
              {/* inner counter-rotating dashed hex */}
              <g className="nb-ihex">
                <polygon points="36,18 52,27 52,45 36,54 20,45 20,27"
                  stroke="rgba(0,220,255,0.14)" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
              </g>
              {/* MK letter paths */}
              <g filter="url(#nb-glow)">
                <polyline points="21,44 21,27 30,37 36,27" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <line x1="38" y1="27" x2="38" y2="44" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round"/>
                <polyline points="38,36 46,27" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
                <polyline points="38,36 46,44" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
              </g>
              {/* pulsing core dot */}
              <g className="nb-core">
                <circle cx="36" cy="36" r="4.5" fill="rgba(0,220,255,0.12)" stroke="#00dcff" strokeWidth="1.2"/>
                <circle cx="36" cy="36" r="2"   fill="#00dcff"/>
              </g>
            </svg>
          </div>

          {/* Wordmark */}
          <span
            className="group-hover:text-[#00f5ff] transition-colors duration-300"
            style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "17px", letterSpacing: "4px", color: "#fff" }}
          >
            MK<span style={{ color: "#00f5ff", textShadow: "0 0 10px rgba(0,245,255,0.7)" }}>S</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => sfx.click()}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "2.5px",
                  }}
                  className={`relative px-3.5 py-2.5 uppercase transition-all duration-200 block group ${
                    isActive
                      ? "text-[#00f5ff]"
                      : "text-[rgba(255,255,255,0.5)] hover:text-white"
                  }`}
                >
                  {/* hover bg flash */}
                  <span className={`absolute inset-0 transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                    style={{ background: "rgba(0,245,255,0.04)", borderBottom: "1px solid rgba(0,245,255,0.15)" }}
                  />
                  {/* active glow dot */}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00f5ff] shadow-[0_0_8px_#00f5ff]" />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Hire Me */}
        <a
          href="#contact"
          onClick={() => sfx.access()}
          className="hidden lg:inline-flex items-center gap-2 px-5 py-2 border border-[rgba(0,245,255,0.35)] bg-[rgba(0,245,255,0.06)] text-[#00f5ff] transition-all duration-200 hover:bg-[rgba(0,245,255,0.12)] hover:border-[#00f5ff] hover:shadow-[0_0_20px_rgba(0,245,255,0.15)]"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88] animate-pulse" />
          Hire Me
        </a>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-[rgba(255,255,255,0.5)] hover:text-[#00f5ff] p-2 transition-colors"
          onClick={() => { setMenuOpen(!menuOpen); sfx.softClick(); }}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t border-[rgba(0,245,255,0.08)] px-6 py-4 space-y-1"
          style={{ background: "rgba(0, 3, 8, 0.97)", backdropFilter: "blur(20px)" }}
        >
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => { setMenuOpen(false); sfx.click(); }}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "2.5px" }}
                className={`block py-3 px-3 uppercase transition-colors border-b border-[rgba(0,245,255,0.06)] ${
                  isActive ? "text-[#00f5ff]" : "text-[rgba(255,255,255,0.5)] hover:text-[#00f5ff]"
                }`}
              >
                {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00f5ff] shadow-[0_0_6px_#00f5ff] mr-2 align-middle" />}
                {link.label}
              </a>
            );
          })}
          <div className="pt-3">
            <a
              href="#contact"
              onClick={() => { setMenuOpen(false); sfx.access(); }}
              className="w-full flex justify-center btn-neural py-3"
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
