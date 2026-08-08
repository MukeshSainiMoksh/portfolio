"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import api from "@/services/api";
import { sfx } from "@/services/sounds";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi — I'm Mukesh's assistant. I know his work, his stack and his experience. Ask me anything, or start with one of these:",
};

const SUGGESTIONS = [
  "What has he built with AI?",
  "Walk me through his strongest project",
  "Is he a fit for a backend role?",
  "How do I get in touch?",
];

/* ─── Markdown-lite ───────────────────────────────────────────────────
   Model output is untrusted text, so it is only ever turned into React
   nodes — never dangerouslySetInnerHTML. Handles bold, inline code,
   links and bullet/numbered lists, which is everything the assistant
   is prompted to emit.                                                */

const INLINE =
  /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\((?:https?:\/\/|mailto:|#)[^)\s]+\)|https?:\/\/[^\s<>)]+)/g;

const codeStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.86em",
  padding: "1.5px 5px",
  borderRadius: "var(--r-sm)",
  background: "rgb(255 255 255 / 0.08)",
  color: "var(--accent-soft)",
};

const linkStyle: React.CSSProperties = {
  color: "var(--accent-soft)",
  textUnderlineOffset: "3px",
  textDecoration: "underline",
};

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  INLINE.lastIndex = 0;

  for (let m = INLINE.exec(text); m; m = INLINE.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${n++}`;

    if (tok.startsWith("**")) {
      out.push(
        <strong key={key} style={{ color: "var(--text-1)", fontWeight: 600 }}>
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith("`")) {
      out.push(<code key={key} style={codeStyle}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      out.push(
        link ? (
          <a key={key} href={link[2]} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            {link[1]}
          </a>
        ) : (
          tok
        )
      );
    } else {
      out.push(
        <a key={key} href={tok} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {tok.replace(/^https?:\/\//, "")}
        </a>
      );
    }
    last = m.index + tok.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderMarkdown(text: string): ReactNode {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flush = () => {
    if (!bullets.length) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={`ul-${blocks.length}`} style={{ margin: "6px 0", paddingLeft: "16px", listStyle: "none" }}>
        {items.map((b, i) => (
          <li key={i} style={{ position: "relative", paddingLeft: "12px", marginBottom: "4px" }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: "0.62em",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--accent-soft)",
              }}
            />
            {renderInline(b, `li-${blocks.length}-${i}`)}
          </li>
        ))}
      </ul>
    );
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    const bullet = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(line);
    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }
    flush();
    if (!line.trim()) return;
    blocks.push(
      <p key={`p-${i}`} style={{ margin: blocks.length ? "6px 0 0" : 0 }}>
        {renderInline(line, `p-${i}`)}
      </p>
    );
  });
  flush();

  return <>{blocks}</>;
}

/* ─── Marks ───────────────────────────────────────────────────────── */

function BotMark({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: size / 3.2,
        background: "linear-gradient(145deg, var(--accent-soft), var(--accent-deep))",
        boxShadow:
          "inset 0 1px 0 rgb(255 255 255 / 0.4), inset 0 -2px 3px rgb(0 0 0 / 0.3), 0 2px 6px -2px rgb(var(--accent-rgb) / 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="#0a0a12">
        <path d="M12 2l1.6 5.2L19 8.8l-4.2 3.3L16 18l-4-2.9L8 18l1.2-5.9L5 8.8l5.4-1.6L12 2z" />
      </svg>
    </span>
  );
}

/* ─── Widget ──────────────────────────────────────────────────────── */

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  /* Progressive reveal of the newest assistant reply. The backend is not
     streaming, so this is what makes an answer feel written rather than
     pasted. Total reveal time is capped, so long answers never drag. */
  const [revealIdx, setRevealIdx] = useState<number | null>(null);
  const [revealChars, setRevealChars] = useState(0);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, revealChars]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); sfx.softClick(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (revealIdx === null) return;
    const full = msgs[revealIdx]?.content ?? "";
    if (revealChars >= full.length) { setRevealIdx(null); return; }
    const perTick = Math.max(1, Math.ceil(full.length / 55)); // ~55 ticks ≈ 900ms
    const id = setTimeout(
      () => setRevealChars((c) => Math.min(full.length, c + perTick)),
      16
    );
    return () => clearTimeout(id);
  }, [revealIdx, revealChars, msgs]);

  const send = useCallback(
    async (override?: string) => {
      const text = (override ?? input).trim();
      if (!text || busy) return;
      setInput("");
      sfx.typeKey();

      const nextMsgs: Msg[] = [...msgs, { role: "user", content: text }];
      setMsgs(nextMsgs);
      setBusy(true);

      try {
        // last 10 turns as history (excluding the welcome message)
        const history = nextMsgs.slice(1, -1).slice(-10);
        const res = await api.post("/api/website/chat/", { message: text, history });
        const reply: string = res.data.reply;
        setMsgs((m) => {
          const next = [...m, { role: "assistant" as const, content: reply }];
          if (!reduceMotion()) { setRevealIdx(next.length - 1); setRevealChars(0); }
          return next;
        });
        sfx.success();
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        const fallback =
          status === 429
            ? "I'm getting a lot of questions right now — please try again in a few minutes."
            : status === 503
            ? "The assistant isn't configured yet. The [contact form](#contact) is the fastest way to reach Mukesh."
            : "Something went wrong on my side. Try again, or use the [contact form](#contact).";
        setMsgs((m) => [...m, { role: "assistant", content: fallback }]);
        sfx.error();
      } finally {
        setBusy(false);
      }
    },
    [input, busy, msgs]
  );

  const showSuggestions = msgs.length === 1 && !busy;

  return (
    <>
      {/* ── Launcher ── */}
      <button
        onClick={() => { setOpen((o) => !o); sfx.click(); }}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        style={{
          position: "fixed",
          bottom: "22px",
          right: "22px",
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: open ? "12px" : "10px 16px 10px 12px",
          borderRadius: "999px",
          background: "rgb(var(--surface-2-rgb) / 0.8)",
          backdropFilter: "blur(20px) saturate(1.7)",
          WebkitBackdropFilter: "blur(20px) saturate(1.7)",
          border: "1px solid var(--hairline-strong)",
          color: "var(--text-1)",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: "13.5px",
          fontWeight: 500,
          boxShadow:
            "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 10px 26px -12px rgb(0 0 0 / 0.9)",
          transition: "padding .25s var(--ease-out), box-shadow .25s var(--ease-out)",
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <>
            <span style={{ position: "relative", display: "flex" }}>
              <span
                aria-hidden="true"
                className="chat-halo"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "8px",
                  background: "rgb(var(--accent-rgb) / 0.5)",
                }}
              />
              <BotMark size={26} />
            </span>
            Ask AI
          </>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div
          ref={panelRef}
          className="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="AI assistant"
          style={{
            position: "fixed",
            bottom: "84px",
            right: "22px",
            left: "auto",
            zIndex: 900,
            width: "min(400px, calc(100vw - 44px))",
            height: "min(560px, calc(100dvh - 130px))",
            background: "rgb(var(--surface-2-rgb) / 0.82)",
            backdropFilter: "blur(28px) saturate(1.7)",
            WebkitBackdropFilter: "blur(28px) saturate(1.7)",
            border: "1px solid var(--hairline-strong)",
            borderRadius: "var(--r-xl)",
            boxShadow:
              "inset 0 1px 0 rgb(255 255 255 / 0.07), 0 28px 64px -24px rgb(0 0 0 / 0.95)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              padding: "14px 16px",
              borderBottom: "1px solid var(--hairline)",
              background: "rgb(255 255 255 / 0.025)",
            }}
          >
            <BotMark size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-1)",
                  letterSpacing: "-0.01em",
                }}
              >
                Portfolio assistant
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  color: "var(--text-3)",
                  marginTop: "1px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--success)",
                    boxShadow: "0 0 0 3px rgb(var(--success-rgb) / 0.16)",
                  }}
                />
                Answers only from Mukesh&apos;s portfolio
              </div>
            </div>
            {msgs.length > 1 && (
              <button
                onClick={() => { setMsgs([WELCOME]); setRevealIdx(null); sfx.softClick(); }}
                aria-label="Clear conversation"
                title="Clear conversation"
                style={{
                  padding: "6px",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--hairline)",
                  color: "var(--text-3)",
                  background: "transparent",
                  cursor: "pointer",
                  lineHeight: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
                </svg>
              </button>
            )}
          </div>

          {/* Messages */}
          <div
            ref={bodyRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {msgs.map((m, i) => {
              const isUser = m.role === "user";
              const revealing = revealIdx === i;
              const shown = revealing ? m.content.slice(0, revealChars) : m.content;

              return (
                <div
                  key={i}
                  className="chat-msg"
                  style={{
                    display: "flex",
                    gap: "9px",
                    alignItems: "flex-start",
                    flexDirection: isUser ? "row-reverse" : "row",
                  }}
                >
                  {!isUser && <BotMark size={22} />}
                  <div
                    style={{
                      maxWidth: "84%",
                      padding: "10px 13px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "13.5px",
                      lineHeight: 1.62,
                      color: isUser ? "var(--text-1)" : "var(--text-2)",
                      background: isUser
                        ? "rgb(var(--accent-rgb) / 0.16)"
                        : "rgb(255 255 255 / 0.045)",
                      border: `1px solid ${isUser ? "rgb(var(--accent-rgb) / 0.3)" : "var(--hairline)"}`,
                      borderRadius: "var(--r-lg)",
                      // tail-side corner tightened so the bubble points at its author
                      borderTopRightRadius: isUser ? "var(--r-sm)" : undefined,
                      borderTopLeftRadius: isUser ? undefined : "var(--r-sm)",
                      wordBreak: "break-word",
                    }}
                  >
                    {renderMarkdown(shown)}
                    {revealing && (
                      <span
                        aria-hidden="true"
                        className="animate-blink"
                        style={{
                          display: "inline-block",
                          width: "2px",
                          height: "0.95em",
                          marginLeft: "2px",
                          verticalAlign: "text-bottom",
                          background: "var(--accent-soft)",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Suggested openers — only before the first real question */}
            {showSuggestions && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", paddingLeft: "31px" }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { sfx.softClick(); send(s); }}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "999px",
                      border: "1px solid var(--hairline-strong)",
                      background: "rgb(255 255 255 / 0.04)",
                      color: "var(--text-2)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "12.5px",
                      cursor: "pointer",
                      transition: "all var(--dur-fast) var(--ease-out)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgb(var(--accent-rgb) / 0.5)";
                      e.currentTarget.style.color = "var(--text-1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--hairline-strong)";
                      e.currentTarget.style.color = "var(--text-2)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <div className="chat-msg" style={{ display: "flex", gap: "9px", alignItems: "center" }}>
                <BotMark size={22} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "13px",
                    borderRadius: "var(--r-lg)",
                    borderTopLeftRadius: "var(--r-sm)",
                    background: "rgb(255 255 255 / 0.045)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="chat-dot"
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "var(--accent-soft)",
                      }}
                    />
                  ))}
                  <span className="sr-only">Thinking</span>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px",
              borderTop: "1px solid var(--hairline)",
              background: "rgb(255 255 255 / 0.02)",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Ask about his work…"
              maxLength={1000}
              aria-label="Message"
              style={{
                flex: 1,
                minWidth: 0,
                background: "rgb(0 0 0 / 0.28)",
                border: "1px solid var(--hairline)",
                borderRadius: "999px",
                padding: "11px 16px",
                color: "var(--text-1)",
                fontFamily: "var(--font-sans)",
                fontSize: "13.5px",
                outline: "none",
                caretColor: "var(--accent-soft)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgb(var(--accent-rgb) / 0.55)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--hairline)"; }}
            />
            <button
              onClick={() => send()}
              disabled={busy || !input.trim()}
              aria-label="Send message"
              style={{
                width: "40px",
                height: "40px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "none",
                background:
                  busy || !input.trim()
                    ? "rgb(255 255 255 / 0.06)"
                    : "linear-gradient(180deg, var(--accent-soft), var(--accent))",
                color: busy || !input.trim() ? "var(--text-3)" : "#0a0a12",
                cursor: busy || !input.trim() ? "default" : "pointer",
                boxShadow:
                  busy || !input.trim()
                    ? "none"
                    : "inset 0 1px 0 rgb(255 255 255 / 0.4), 0 4px 12px -4px rgb(var(--accent-rgb) / 0.6)",
                transition: "all var(--dur-fast) var(--ease-out)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
