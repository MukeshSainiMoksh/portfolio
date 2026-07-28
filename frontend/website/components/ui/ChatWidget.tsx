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
          background: "rgba(3,8,18,0.94)",
          border: "1px solid rgba(168,85,247,0.5)",
          color: "#a855f7", cursor: "pointer", fontSize: "20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open
            ? "0 0 24px rgba(168,85,247,0.4)"
            : "0 4px 16px rgba(0,0,0,0.4), 0 0 12px rgba(168,85,247,0.15)",
          transition: "box-shadow .25s, transform .2s",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* panel */}
      {open && (
        <div
          style={{
            position: "fixed", bottom: "84px", right: "22px", zIndex: 900,
            width: "min(380px, calc(100vw - 44px))", height: "480px",
            background: "rgba(3,5,14,0.97)",
            border: "1px solid rgba(168,85,247,0.35)",
            boxShadow: "0 12px 48px rgba(0,0,0,0.65), 0 0 28px rgba(168,85,247,0.1)",
            display: "flex", flexDirection: "column",
            backdropFilter: "blur(14px)",
          }}
        >
          {/* header */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(168,85,247,0.18)",
            background: "rgba(168,85,247,0.05)",
          }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#00ff88", boxShadow: "0 0 8px #00ff88",
              animation: "chat-pulse 1.6s ease-in-out infinite",
            }} />
            <style>{`@keyframes chat-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "11px", fontWeight: 700, color: "#a855f7", letterSpacing: "2px", textTransform: "uppercase" }}>
                AI Assistant
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "rgba(168,85,247,0.5)", letterSpacing: "1px", marginTop: "1px" }}>
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
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  color: m.role === "user" ? "#fff" : "rgba(255,255,255,0.8)",
                  background: m.role === "user" ? "rgba(0,245,255,0.1)" : "rgba(168,85,247,0.08)",
                  border: m.role === "user" ? "1px solid rgba(0,245,255,0.25)" : "1px solid rgba(168,85,247,0.2)",
                }}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div style={{
                alignSelf: "flex-start", padding: "10px 14px",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                color: "rgba(168,85,247,0.7)",
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.2)",
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
          <div style={{ display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid rgba(168,85,247,0.18)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about skills, projects…"
              maxLength={1000}
              aria-label="Chat message"
              style={{
                flex: 1, background: "rgba(168,85,247,0.04)",
                border: "1px solid rgba(168,85,247,0.2)",
                padding: "10px 12px", color: "#fff",
                fontFamily: "'Syne', sans-serif", fontSize: "13px",
                outline: "none", caretColor: "#a855f7",
              }}
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              aria-label="Send message"
              style={{
                padding: "0 16px",
                background: busy || !input.trim() ? "rgba(168,85,247,0.05)" : "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.35)",
                color: busy || !input.trim() ? "rgba(168,85,247,0.35)" : "#a855f7",
                cursor: busy || !input.trim() ? "default" : "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "13px",
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
