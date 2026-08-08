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
    background: "rgb(var(--accent-rgb) / 0.02)",
    border: "1px solid rgb(var(--accent-rgb) / 0.12)",
    borderRadius: "var(--r-md)",
    padding: "12px 16px",
    color: "var(--text-1)",
    fontSize: "14px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-3)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: "8px",
  };

  return (
    <section id="contact" className="py-24" style={{ background: "var(--surface-1)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-label justify-center">Let&apos;s Talk</p>
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-divider mx-auto" />
          <p
            className="max-w-md mx-auto"
            style={{ color: "var(--text-3)", fontSize: "15px", fontFamily: "var(--font-sans)", lineHeight: "1.7" }}
          >
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { label: "Email",    value: "codermsaini@gmail.com",  accent: "var(--accent)",      rgb: "var(--accent-rgb)",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
              { label: "Location", value: "Mohali, Punjab, India",  accent: "var(--accent-soft)", rgb: "var(--accent-soft-rgb)",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
              { label: "Response", value: "Within 24 hours",        accent: "var(--success)",     rgb: "var(--success-rgb)",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
            ].map(({ label, value, accent, rgb, icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 p-4"
                style={{ background: `rgb(${rgb} / 0.02)`, border: `1px solid rgb(${rgb} / 0.1)`, borderLeft: `2px solid rgb(${rgb} / 0.5)`, borderRadius: "var(--r-lg)" }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ background: `rgb(${rgb} / 0.06)`, border: `1px solid rgb(${rgb} / 0.2)`, borderRadius: "var(--r-md)" }}
                >
                  <svg className="w-4 h-4" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: `rgb(${rgb} / 0.85)`, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {label}
                  </p>
                  <p style={{ color: "var(--text-2)", fontSize: "13px", fontFamily: "var(--font-sans)" }}>{value}</p>
                </div>
              </div>
            ))}

            {/* Availability badge */}
            <div
              className="p-4 flex items-center gap-3"
              style={{ background: "rgb(var(--success-rgb) / 0.03)", border: "1px solid rgb(var(--success-rgb) / 0.1)", borderLeft: "2px solid rgb(var(--success-rgb) / 0.4)", borderRadius: "var(--r-lg)" }}
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--success-rgb) / 0.9)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Open to new opportunities
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              <div
                className="text-center py-16 p-6"
                style={{ background: "rgb(var(--success-rgb) / 0.02)", border: "1px solid rgb(var(--success-rgb) / 0.15)", borderTop: "2px solid var(--success)", borderRadius: "var(--r-lg)" }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "rgb(var(--success-rgb) / 0.08)", border: "1px solid rgb(var(--success-rgb) / 0.3)", borderRadius: "var(--r-md)" }}
                >
                  <svg className="w-7 h-7" style={{ color: "var(--success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>
                  Message Sent
                </h3>
                <p style={{ color: "var(--text-3)", fontFamily: "var(--font-sans)", fontSize: "14px", marginBottom: "24px" }}>
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => { setStatus("idle"); sfx.click(); }}
                  className="btn-neural"
                  style={{ color: "var(--success)", borderColor: "rgb(var(--success-rgb) / 0.35)", background: "rgb(var(--success-rgb) / 0.05)" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
                style={{ background: "rgb(var(--accent-rgb) / 0.01)", border: "1px solid rgb(var(--accent-rgb) / 0.08)", borderTop: "2px solid rgb(var(--accent-rgb) / 0.3)", borderRadius: "var(--r-lg)" }}
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
                      onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.4)"; e.target.style.boxShadow = "0 0 0 1px rgb(var(--accent-rgb) / 0.1)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.12)"; e.target.style.boxShadow = "none"; }}
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
                      onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.4)"; e.target.style.boxShadow = "0 0 0 1px rgb(var(--accent-rgb) / 0.1)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.12)"; e.target.style.boxShadow = "none"; }}
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
                    onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.4)"; e.target.style.boxShadow = "0 0 0 1px rgb(var(--accent-rgb) / 0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.12)"; e.target.style.boxShadow = "none"; }}
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
                    onFocus={(e) => { sfx.scan(0.3); e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.4)"; e.target.style.boxShadow = "0 0 0 1px rgb(var(--accent-rgb) / 0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "rgb(var(--accent-rgb) / 0.12)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {status === "error" && (
                  <p
                    style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ember)", letterSpacing: "0.12em" }}
                  >
                    ⚠ Failed to send. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-neural w-full justify-center"
                  style={{ padding: "14px", fontSize: "12px" }}
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-4 h-4 border border-hairline border-t-accent rounded-full animate-spin" />
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
