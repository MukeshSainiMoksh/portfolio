"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sfx } from "@/services/sounds";

export interface TerminalData {
  skills: string[];
  projects: { title: string; live_url: string | null; github_url: string | null }[];
  social: { github?: string; linkedin?: string; email?: string };
}

type Line = { type: "input" | "output" | "accent" | "error"; text: string };

const BANNER: Line[] = [
  { type: "accent", text: "MKS-OS v2.0 — visitor shell" },
  { type: "output", text: 'Type "help" to see available commands.' },
];

export default function Terminal({ data }: { data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const historyRef = useRef<string[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* open with ` (backtick), close with Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
        sfx.click();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: Line[] = [{ type: "input", text: raw }];

    switch (cmd) {
      case "":
        break;
      case "help":
        out.push(
          { type: "accent", text: "Available commands:" },
          { type: "output", text: "  whoami      → who is this guy" },
          { type: "output", text: "  skills      → technical skills" },
          { type: "output", text: "  projects    → project list" },
          { type: "output", text: "  social      → github / linkedin / email" },
          { type: "output", text: "  contact     → jump to contact form" },
          { type: "output", text: "  clear       → clear terminal" },
          { type: "output", text: "  exit        → close terminal" },
        );
        break;
      case "whoami":
        out.push(
          { type: "accent", text: "Mukesh Kumar Saini" },
          { type: "output", text: "Software Engineer · AI/ML · Full-Stack" },
          { type: "output", text: "Building the AI layer between ideas and reality." },
        );
        break;
      case "skills":
        if (data.skills.length === 0) out.push({ type: "output", text: "(no skills loaded)" });
        else {
          out.push({ type: "accent", text: `${data.skills.length} skills loaded:` });
          for (let i = 0; i < data.skills.length; i += 4) {
            out.push({ type: "output", text: "  " + data.skills.slice(i, i + 4).join(" · ") });
          }
        }
        break;
      case "projects":
        if (data.projects.length === 0) out.push({ type: "output", text: "(no projects loaded)" });
        else {
          out.push({ type: "accent", text: `${data.projects.length} projects:` });
          data.projects.forEach((p, i) => {
            const link = p.live_url || p.github_url;
            out.push({ type: "output", text: `  [${i + 1}] ${p.title}${link ? ` — ${link}` : ""}` });
          });
        }
        break;
      case "social":
        if (data.social.github)   out.push({ type: "output", text: `  github   → ${data.social.github}` });
        if (data.social.linkedin) out.push({ type: "output", text: `  linkedin → ${data.social.linkedin}` });
        if (data.social.email)    out.push({ type: "output", text: `  email    → ${data.social.email}` });
        break;
      case "contact":
        out.push({ type: "accent", text: "Navigating to contact form…" });
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "clear":
        setLines(BANNER);
        setInput("");
        return;
      case "exit":
        setOpen(false);
        setLines((l) => [...l, ...out]);
        setInput("");
        return;
      case "sudo hire":
      case "sudo hire-me":
      case "hire":
        out.push(
          { type: "accent", text: "[sudo] permission granted ✔" },
          { type: "output", text: "Excellent decision. Opening contact form…" },
        );
        sfx.success();
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "rm -rf /":
        out.push({ type: "error", text: "Nice try. This portfolio is immutable. 😎" });
        break;
      default:
        out.push({ type: "error", text: `command not found: ${cmd} — try "help"` });
    }

    setLines((l) => [...l, ...out]);
    if (raw.trim()) {
      historyRef.current.push(raw);
      setHistIdx(-1);
    }
    setInput("");
  }, [data]);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hist = historyRef.current;
    if (e.key === "Enter") {
      sfx.typeKey();
      run(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hist.length) {
        const idx = histIdx === -1 ? hist.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(idx);
        setInput(hist[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx >= 0) {
        const idx = histIdx + 1;
        if (idx >= hist.length) { setHistIdx(-1); setInput(""); }
        else { setHistIdx(idx); setInput(hist[idx]); }
      }
    }
  };

  const colors: Record<Line["type"], string> = {
    input: "#ffffff",
    output: "rgba(255,255,255,0.55)",
    accent: "#00f5ff",
    error: "#ff4466",
  };

  return (
    <>
      {/* floating launcher */}
      <button
        onClick={() => { setOpen((o) => !o); sfx.click(); }}
        aria-label="Open terminal"
        title="Terminal ( ` )"
        style={{
          position: "fixed", bottom: "22px", left: "22px", zIndex: 900,
          width: "44px", height: "44px",
          background: "rgba(3,8,18,0.92)",
          border: "1px solid rgba(0,245,255,0.3)",
          color: "#00f5ff", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "0 0 18px rgba(0,245,255,0.35)" : "none",
          transition: "box-shadow .2s",
        }}
      >
        {">_"}
      </button>

      {/* terminal panel */}
      {open && (
        <div
          style={{
            position: "fixed", bottom: "78px", left: "22px", zIndex: 900,
            width: "min(480px, calc(100vw - 44px))", height: "380px",
            background: "rgba(2,5,12,0.97)",
            border: "1px solid rgba(0,245,255,0.3)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 24px rgba(0,245,255,0.08)",
            display: "flex", flexDirection: "column",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* title bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 14px", borderBottom: "1px solid rgba(0,245,255,0.12)",
            background: "rgba(0,245,255,0.03)",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(0,245,255,0.6)", letterSpacing: "2px" }}>
              VISITOR@MKS : ~
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close terminal"
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "14px" }}
            >
              ✕
            </button>
          </div>

          {/* output */}
          <div
            ref={bodyRef}
            onClick={() => inputRef.current?.focus()}
            style={{ flex: 1, overflowY: "auto", padding: "12px 14px", cursor: "text" }}
          >
            {lines.map((l, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
                  lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word",
                  color: colors[l.type],
                }}
              >
                {l.type === "input" ? (
                  <><span style={{ color: "#00ff88" }}>visitor@mks</span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>:~$ </span>{l.text}</>
                ) : l.text}
              </div>
            ))}
            {/* input row */}
            <div style={{ display: "flex", alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
              <span style={{ color: "#00ff88" }}>visitor@mks</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>:~$&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKey}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal command input"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontFamily: "inherit", fontSize: "inherit", caretColor: "#00f5ff",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
