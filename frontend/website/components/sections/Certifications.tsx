"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Certification } from "@/services/portfolio";
import { sfx } from "@/services/sounds";

export default function Certifications({ certs }: { certs: Certification[] }) {
  const [lightbox, setLightbox]   = useState<string | null>(null);

  /* close lightbox on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { sfx.shutdown(); setLightbox(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-label" style={{ color: "var(--accent-soft)" }}>Credentials</p>
        <h2 className="section-title">Certifications</h2>
        <div className="section-divider" style={{ background: "linear-gradient(90deg, var(--accent-soft), transparent)" }} />

        <div className="grid md:grid-cols-2 gap-5">
          {certs.map((cert, idx) => (
            <div
              key={cert.id}
              className="animate-fade-in-up group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                opacity: 0,
                animationDelay: `${idx * 0.15}s`,
                background: "rgb(var(--accent-soft-rgb) / 0.02)",
                border: "1px solid rgb(var(--accent-soft-rgb) / 0.1)",
                borderLeft: "2px solid rgb(var(--accent-soft-rgb) / 0.5)",
                borderRadius: "var(--r-lg)",
                padding: "24px",
              }}
            >
              {/* BG glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgb(var(--accent-soft-rgb) / 0.04)" }}
              />

              <div className="flex items-start gap-4 relative">
                {/* Badge icon / thumbnail */}
                {cert.badge_url ? (
                  <button
                    onClick={() => { sfx.hologram(); setLightbox(cert.badge_url!); }}
                    className="w-16 h-16 shrink-0 overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none"
                    style={{ border: "1px solid rgb(var(--accent-soft-rgb) / 0.3)", background: "rgb(var(--accent-soft-rgb) / 0.06)", borderRadius: "var(--r-md)" }}
                    title="View certificate"
                  >
                    <Image
                      src={cert.badge_url}
                      alt={`${cert.name} certificate`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ) : (
                  <div
                    className="w-14 h-14 flex items-center justify-center shrink-0 animate-pulse-glow"
                    style={{ background: "rgb(var(--accent-soft-rgb) / 0.08)", border: "1px solid rgb(var(--accent-soft-rgb) / 0.3)", borderRadius: "var(--r-md)" }}
                  >
                    <svg className="w-7 h-7" style={{ color: "var(--accent-soft)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-base leading-snug mb-1"
                    style={{ color: "var(--text-1)", fontFamily: "var(--font-sans)" }}
                  >
                    {cert.name}
                  </h3>
                  <p
                    className="font-medium text-sm mb-2"
                    style={{ color: "var(--accent-soft)", fontFamily: "var(--font-sans)" }}
                  >
                    {cert.issuer}
                  </p>

                  {cert.description && (
                    <p
                      className="text-sm leading-relaxed mb-3 line-clamp-2"
                      style={{ color: "var(--text-3)", fontFamily: "var(--font-sans)" }}
                    >
                      {cert.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    {cert.issue_date && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}>
                        Issued {cert.issue_date}
                      </span>
                    )}
                    {cert.expiry_date && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}>
                        Expires {cert.expiry_date}
                      </span>
                    )}
                    {cert.credential_id && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--accent-soft-rgb) / 0.8)" }}>
                        ID: {cert.credential_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-5 pt-4 flex flex-wrap gap-3" style={{ borderTop: "1px solid rgb(var(--accent-soft-rgb) / 0.1)" }}>
                {cert.badge_url && (
                  <button
                    onClick={() => { sfx.hologram(); setLightbox(cert.badge_url!); }}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "8px 18px",
                      background: "rgb(var(--accent-soft-rgb) / 0.04)",
                      border: "1px solid rgb(var(--accent-soft-rgb) / 0.2)",
                      borderRadius: "var(--r-md)",
                      color: "rgb(var(--accent-soft-rgb) / 0.9)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Certificate
                  </button>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sfx.access()}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "8px 18px",
                      background: "rgb(var(--accent-soft-rgb) / 0.06)",
                      border: "1px solid rgb(var(--accent-soft-rgb) / 0.3)",
                      borderRadius: "var(--r-md)",
                      color: "var(--accent-soft)",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Verify Credential
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview"
          style={{ background: "rgb(var(--surface-0-rgb) / 0.92)", backdropFilter: "blur(12px)" }}
          onClick={() => { sfx.shutdown(); setLightbox(null); }}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => { sfx.shutdown(); setLightbox(null); }}
              className="absolute -top-10 right-0 flex items-center gap-2 transition-colors"
              style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close [ Esc ]
            </button>

            {/* Certificate image */}
            <div
              className="overflow-hidden"
              style={{ border: "1px solid rgb(var(--accent-soft-rgb) / 0.3)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-lg)" }}
            >
              <Image
                src={lightbox}
                alt="Certificate"
                width={900}
                height={640}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Caption */}
            <p
              className="text-center mt-4"
              style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--accent-soft-rgb) / 0.8)", letterSpacing: "0.12em" }}
            >
              Microsoft Certified: Azure AI Engineer Associate · ID: A76EDCB4BBE3F103
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
