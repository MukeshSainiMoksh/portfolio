"use client";

import { FormEvent, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import api from "@/services/api";
import { sfx } from "@/services/sounds";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact({ about = {} }: { about?: Record<string, string> }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const lastKeyTime = useRef(0);
  /* Bots fill every field they find. Humans never see this one. */
  const honeypot = useRef("");

  function handleKeySound() {
    const now = Date.now();
    if (now - lastKeyTime.current > 38) {
      lastKeyTime.current = now;
      sfx.typeKey();
    }
  }

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (honeypot.current) return; // silently drop

    setStatus("sending");
    setErrorMsg("");
    sfx.scan();

    try {
      await api.post("/api/website/contact/submit", form);
      setStatus("success");
      setForm(EMPTY);
      sfx.success();
    } catch (err: unknown) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      setErrorMsg(
        code === 429
          ? "Too many messages from this address. Please try again a bit later."
          : "That didn't go through. Please try again, or email me directly."
      );
      setStatus("error");
      sfx.error();
    }
  }

  const email = about.email ?? "codermsaini@gmail.com";
  const location = about.location ?? "Mohali, Punjab, India";
  const availability = about.availability ?? "Open to new opportunities";

  const details = [
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "Location", value: location },
    { label: "Response time", value: "Usually within 24 hours" },
  ];

  const busy = status === "sending";

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's talk"
      lede="Working on something interesting, or hiring? Tell me what you're building and I'll get back to you."
      align="center"
      width="text"
    >
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* ── Details ── */}
        <Reveal>
          <div className="card h-full">
            <dl className="space-y-5">
              {details.map(({ label, value, href }) => (
                <div key={label}>
                  <dt className="meta mb-1.5">{label}</dt>
                  <dd style={{ color: "var(--text-1)", fontSize: "0.9375rem", overflowWrap: "anywhere" }}>
                    {href ? (
                      <a
                        href={href}
                        style={{ color: "var(--accent-soft)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p
              className="mt-6 flex items-center gap-2.5 pt-5"
              style={{ borderTop: "1px solid var(--hairline)", color: "var(--text-2)", fontSize: "0.875rem" }}
            >
              <span className="glow-dot" aria-hidden="true" />
              {availability}
            </p>
          </div>
        </Reveal>

        {/* ── Form ── */}
        <Reveal delay={0.08}>
          {status === "success" ? (
            <div className="card flex h-full flex-col items-center justify-center py-14 text-center" role="status">
              <span
                aria-hidden="true"
                className="mb-5 flex items-center justify-center"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "rgb(var(--success-rgb) / 0.12)",
                  border: "1px solid rgb(var(--success-rgb) / 0.3)",
                }}
              >
                <svg className="h-6 w-6" style={{ color: "var(--success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-1)" }}>Message sent</h3>
              <p className="mt-2 mb-7" style={{ color: "var(--text-3)", fontSize: "0.9375rem" }}>
                Thanks for reaching out — I&apos;ll reply soon.
              </p>
              <button type="button" className="btn-neural" onClick={() => { setStatus("idle"); sfx.click(); }}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card" noValidate={false}>
              {/* honeypot — hidden from people, not from bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                onChange={(e) => { honeypot.current = e.target.value; }}
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    className="field"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    onKeyDown={handleKeySound}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className="field"
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    onKeyDown={handleKeySound}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="field-label" htmlFor="contact-subject">
                  Subject <span className="meta">optional</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  className="field"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  onKeyDown={handleKeySound}
                />
              </div>

              <div className="mt-4">
                <label className="field-label" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  className="field"
                  style={{ resize: "vertical", minHeight: "132px" }}
                  placeholder="A few lines about the project or role…"
                  required
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  onKeyDown={handleKeySound}
                />
              </div>

              {/* Announced to screen readers the moment it appears */}
              <p
                role="alert"
                aria-live="assertive"
                className="mt-4 min-h-[1.25rem]"
                style={{ color: "var(--danger)", fontSize: "0.875rem" }}
              >
                {status === "error" ? errorMsg : ""}
              </p>

              <button type="submit" className="btn-cosmic mt-2 w-full" disabled={busy}>
                {busy ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full"
                      style={{ border: "2px solid rgb(0 0 0 / 0.25)", borderTopColor: "#0a0a12" }}
                    />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
