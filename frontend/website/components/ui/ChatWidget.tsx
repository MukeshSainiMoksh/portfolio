"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import { sfx } from "@/services/sounds";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi! I'm Mukesh's AI assistant. Ask me anything about his skills, projects, or experience. 🤖",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  async function send() {
    const text = input.trim();
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
      setMsgs((m) => [...m, { role: "assistant", content: res.data.reply }]);
      sfx.success();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const fallback =
        status === 429
          ? "I'm getting a lot of questions right now — please try again in a few minutes."
          : status === 503
          ? "The AI assistant isn't configured yet. Please use the contact form instead!"
          : "Something went wrong. Please try again, or use the contact form.";
      setMsgs((m) => [...m, { role: "assistant", content: fallback }]);
      sfx.error();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => { setOpen((o) => !o); sfx.click(); }}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        style={{
          position: "fixed", bottom: "22px", right: "22px", zIndex: 900,
          width: "52px", height: "52px", borderRadius: "50%",
          background: "rgb(var(--surface-2-rgb) / 0.72)",
          backdropFilter: "blur(24px) saturate(1.6)",
          WebkitBackdropFilter: "blur(24px) saturate(1.6)",
          border: "1px solid var(--hairline)",
          color: "var(--accent-soft)", cursor: "pointer", fontSize: "20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "var(--shadow-lg)" : "var(--shadow-md)",
          transition: "box-shadow .25s, transform .2s",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI assistant chat"
          style={{
            position: "fixed", bottom: "84px", right: "22px", zIndex: 900,
            width: "min(380px, calc(100vw - 44px))", height: "480px",
            background: "rgb(var(--surface-2-rgb) / 0.72)",
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-lg)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* header */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--hairline)",
            background: "rgb(var(--accent-soft-rgb) / 0.05)",
          }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "var(--success)", boxShadow: "0 0 8px rgb(var(--success-rgb) / 0.45)",
              animation: "chat-pulse 1.6s ease-in-out infinite",
            }} />
            <style>{`@keyframes chat-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 700, color: "var(--accent-soft)", letterSpacing: "2px", textTransform: "uppercase" }}>
                AI Assistant
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.12em", marginTop: "1px" }}>
                ASK · ABOUT · MUKESH
              </div>
            </div>
          </div>

          {/* messages */}
          <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {msgs.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  borderRadius: "var(--r-md)",
                  color: "var(--text-1)",
                  background: m.role === "user" ? "rgb(var(--accent-rgb) / 0.1)" : "rgb(var(--accent-soft-rgb) / 0.08)",
                  border: m.role === "user" ? "1px solid rgb(var(--accent-rgb) / 0.25)" : "1px solid var(--hairline)",
                }}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div style={{
                alignSelf: "flex-start", padding: "10px 14px",
                fontFamily: "var(--font-mono)", fontSize: "12px",
                borderRadius: "var(--r-md)",
                color: "var(--accent-soft)",
                background: "rgb(var(--accent-soft-rgb) / 0.08)",
                border: "1px solid var(--hairline)",
              }}>
                <span className="chat-dots">thinking</span>
                <style>{`
                  .chat-dots::after { content: ''; animation: chat-dots 1.2s steps(4) infinite; }
                  @keyframes chat-dots { 0%{content:''} 25%{content:'.'} 50%{content:'..'} 75%{content:'...'} }
                `}</style>
              </div>
            )}
          </div>

          {/* input */}
          <div style={{ display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid var(--hairline)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about skills, projects…"
              maxLength={1000}
              aria-label="Chat message"
              style={{
                flex: 1, background: "rgb(var(--accent-soft-rgb) / 0.04)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--r-md)",
                padding: "10px 12px", color: "var(--text-1)",
                fontFamily: "var(--font-sans)", fontSize: "13px",
                outline: "none", caretColor: "var(--accent-soft)",
              }}
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              aria-label="Send message"
              style={{
                padding: "0 16px",
                background: busy || !input.trim() ? "rgb(var(--accent-soft-rgb) / 0.05)" : "rgb(var(--accent-soft-rgb) / 0.15)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--r-md)",
                color: busy || !input.trim() ? "var(--text-3)" : "var(--accent-soft)",
                cursor: busy || !input.trim() ? "default" : "pointer",
                fontFamily: "var(--font-mono)", fontSize: "13px",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
