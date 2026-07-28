"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sfx } from "@/services/sounds";

export interface PaletteItem {
  label: string;
  hint: string;       // right-side tag e.g. "Section" | "Project" | "Link"
  action: () => void;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function CommandPalette({
  projects,
  social,
}: {
  projects: { title: string; live_url: string | null; github_url: string | null }[];
  social: { github?: string; linkedin?: string; email?: string };
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items: PaletteItem[] = useMemo(() => {
    const sections: PaletteItem[] = [
      { label: "Home",           hint: "Section", action: () => scrollToId("home") },
      { label: "Intro Video",    hint: "Section", action: () => scrollToId("intro-video") },
      { label: "About",          hint: "Section", action: () => scrollToId("about") },
      { label: "Skills",         hint: "Section", action: () => scrollToId("skills") },
      { label: "Experience",     hint: "Section", action: () => scrollToId("experience") },
      { label: "Projects",       hint: "Section", action: () => scrollToId("projects") },
      { label: "Certifications", hint: "Section", action: () => scrollToId("certifications") },
      { label: "Education",      hint: "Section", action: () => scrollToId("education") },
      { label: "Contact",        hint: "Section", action: () => scrollToId("contact") },
    ];
    const proj: PaletteItem[] = projects.map((p) => ({
      label: p.title,
      hint: "Project",
      action: () => {
        const url = p.live_url || p.github_url;
        if (url) window.open(url, "_blank", "noopener");
        else scrollToId("projects");
      },
    }));
    const links: PaletteItem[] = [];
    if (social.github)   links.push({ label: "GitHub",   hint: "Link", action: () => window.open(social.github!,   "_blank", "noopener") });
    if (social.linkedin) links.push({ label: "LinkedIn", hint: "Link", action: () => window.open(social.linkedin!, "_blank", "noopener") });
    if (social.email)    links.push({ label: "Send Email", hint: "Link", action: () => { window.location.href = `mailto:${social.email}`; } });
    return [...sections, ...proj, ...links];
  }, [projects, social]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  /* global shortcut: Ctrl+K / Cmd+K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        sfx.click();
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);

  /* keep active row in view */
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      sfx.success();
      filtered[active].action();
      close();
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 950,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "18vh",
      }}
    >
      {/* backdrop */}
      <div
        onClick={close}
        style={{ position: "absolute", inset: 0, background: "rgba(0,2,8,0.75)", backdropFilter: "blur(8px)" }}
      />

      {/* panel */}
      <div
        style={{
          position: "relative", width: "min(560px, calc(100vw - 32px))",
          background: "rgba(3,7,16,0.98)",
          border: "1px solid rgba(0,245,255,0.3)",
          boxShadow: "0 16px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,245,255,0.07)",
        }}
      >
        {/* search input */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", borderBottom: "1px solid rgba(0,245,255,0.12)" }}>
          <span style={{ color: "rgba(0,245,255,0.6)", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Jump to section, project, link…"
            aria-label="Command palette search"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px",
              letterSpacing: "0.5px", caretColor: "#00f5ff",
            }}
          />
          <kbd style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
            color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.12)",
            padding: "3px 7px", letterSpacing: "1px",
          }}>
            ESC
          </kbd>
        </div>

        {/* results */}
        <div ref={listRef} style={{ maxHeight: "320px", overflowY: "auto", padding: "6px" }}>
          {filtered.length === 0 ? (
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
              color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "28px 0",
              letterSpacing: "1px",
            }}>
              NO RESULTS
            </p>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={`${item.hint}-${item.label}`}
                data-idx={idx}
                onClick={() => { sfx.success(); item.action(); close(); }}
                onMouseEnter={() => setActive(idx)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 14px", border: "none", cursor: "pointer", textAlign: "left",
                  background: idx === active ? "rgba(0,245,255,0.08)" : "transparent",
                  borderLeft: idx === active ? "2px solid #00f5ff" : "2px solid transparent",
                }}
              >
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontSize: "14px",
                  color: idx === active ? "#fff" : "rgba(255,255,255,0.65)",
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
                  color: "rgba(0,245,255,0.45)", letterSpacing: "2px", textTransform: "uppercase",
                }}>
                  {item.hint}
                </span>
              </button>
            ))
          )}
        </div>

        {/* footer hints */}
        <div style={{
          display: "flex", gap: "16px", padding: "10px 18px",
          borderTop: "1px solid rgba(0,245,255,0.1)",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
          color: "rgba(255,255,255,0.3)", letterSpacing: "1px",
        }}>
          <span>↑↓ NAVIGATE</span>
          <span>↵ SELECT</span>
          <span>ESC CLOSE</span>
        </div>
      </div>
    </div>
  );
}
