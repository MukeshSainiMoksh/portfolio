"use client";

import { FormEvent, useRef, useState } from "react";
import api from "@/services/api";
import { sfx } from "@/services/sounds";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const lastKeyTime = useRef(0);

  function handleKeySound() {
    const now = Date.now();
    if (now - lastKeyTime.current > 38) { // throttle — max ~26 sounds/sec
      lastKeyTime.current = now;
      sfx.typeKey();
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    sfx.scan();
    try {
      await api.post("/api/website/contact/submit", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      sfx.success();
    } catch {
      setStatus("error");
      sfx.error();
    }
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(0,245,255,0.02)",
    border: "1px solid rgba(0,245,255,0.12)",
    padding: "12px 16px",
    color: "rgba(255,255,255,0.85)",
    fontSize: "14px",
    fontFamily: "'Syne', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "9px",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    marginBottom: "8px",
  };

  return (
    <section id="contact" className="py-24" style={{ background: "#000510" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-label justify-center">Let&apos;s Talk</p>
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-divider mx-auto" />
          <p
            className="max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "15px", fontFamily: "'Syne', sans-serif", lineHeight: "1.7" }}
          >
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { label: "Email",    value: "codermsaini@gmail.com",  accent: "#00f5ff", rgb: "0,245,255",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
              { label: "Location", value: "Mohali, Punjab, India",  accent: "#a855f7", rgb: "168,85,247",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
              { label: "Response", value: "Within 24 hours",        accent: "#00ff88", rgb: "0,255,136",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
            ].map(({ label, value, accent, rgb, icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 p-4"
                style={{ background: `rgba(${rgb}, 0.02)`, border: `1px solid rgba(${rgb}, 0.1)`, borderLeft: `2px solid ${accent}50` }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: `rgba(${rgb}, 0.06)`, border: `1px solid rgba(${rgb}, 0.2)` }}
                >
                  <svg className="w-4 h-4" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: `${accent}80`, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                    {label}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "'Syne', sans-serif" }}>{value}</p>
                </div>
              </div>
            ))}

            {/* Availability badge */}
            <div
              className="p-4 flex items-center gap-3"
              style={{ background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.1)", borderLeft: "2px solid rgba(0,255,136,0.4)" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-pulse shrink-0" />
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(0,255,136,0.7)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Open to new opportunities
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              <div
                className="text-center py-16 p-6"
                style={{ background: "rgba(0,255,136,0.02)", border: "1px solid rgba(0,255,136,0.15)", borderTop: "2px solid #00ff88" }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.3)" }}
                >
                  <svg className="w-7 h-7" style={{ color: "#00ff88" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Orbitron', monospace" }}>
                  Message Sent
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Syne', sans-serif", fontSize: "14px", marginBottom: "24px" }}>
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => { setStatus("idle"); sfx.click(); }}
                  className="btn-neural"
                  style={{ color: "#00ff88", borderColor: "rgba(0,255,136,0.35)", background: "rgba(0,255,136,0.05)" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
                style={{ background: "rgba(0,245,255,0.01)", border: "1px solid rgba(0,245,255,0.08)", borderTop: "2px solid rgba(0,245,255,0.3)" }}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input
                      style={inputStyle}
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      onKeyDown={handleKeySound}
                      onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgba(0,245,255,0.4)"; e.target.style.boxShadow = "0 0 0 1px rgba(0,245,255,0.1)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgba(0,245,255,0.12)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input
                      type="email"
                      style={inputStyle}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      onKeyDown={handleKeySound}
                      onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgba(0,245,255,0.4)"; e.target.style.boxShadow = "0 0 0 1px rgba(0,245,255,0.1)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgba(0,245,255,0.12)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input
                    style={inputStyle}
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    onKeyDown={handleKeySound}
                    onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgba(0,245,255,0.4)"; e.target.style.boxShadow = "0 0 0 1px rgba(0,245,255,0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(0,245,255,0.12)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    rows={5}
                    style={{ ...inputStyle, resize: "none" }}
                    placeholder="Tell me about your project or opportunity..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    onKeyDown={handleKeySound}
                    onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgba(0,245,255,0.4)"; e.target.style.boxShadow = "0 0 0 1px rgba(0,245,255,0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgba(0,245,255,0.12)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {status === "error" && (
                  <p
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#ff2d78", letterSpacing: "1px" }}
                  >
                    ⚠ Failed to send. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-neural w-full justify-center"
                  style={{ padding: "14px", fontSize: "11px" }}
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 border border-[rgba(0,245,255,0.3)] border-t-[#00f5ff] rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
