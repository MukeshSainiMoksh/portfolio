"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import type { Certification } from "@/services/portfolio";
import { formatMonthYear } from "@/lib/format";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { sfx } from "@/services/sounds";

export default function Certifications({ certs }: { certs: Certification[] }) {
  /* The whole certificate is held, not just its image URL. The caption used
     to be a hard-coded Azure string, so every certificate in the lightbox
     claimed to be the same one. */
  const [preview, setPreview] = useState<Certification | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const open = useCallback((cert: Certification, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setPreview(cert);
    sfx.hologram();
  }, []);

  const close = useCallback(() => {
    setPreview(null);
    sfx.shutdown();
    // send focus back where it came from, or it lands on <body>
    lastTrigger.current?.focus();
  }, []);

  useFocusTrap(dialogRef, preview !== null, close);

  useEffect(() => {
    if (!preview) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [preview]);

  if (certs.length === 0) return null;

  return (
    <Section
      id="certifications"
      eyebrow="Credentials"
      title="Certifications"
      width="text"
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {certs.map((cert, idx) => {
          const dates = [
            cert.issue_date && `Issued ${formatMonthYear(cert.issue_date)}`,
            cert.expiry_date && `Expires ${formatMonthYear(cert.expiry_date)}`,
          ].filter(Boolean) as string[];

          return (
            <Reveal as="li" key={cert.id} delay={Math.min(idx, 4) * 0.06}>
              <article className="card card-interactive flex h-full flex-col">
                <div className="flex items-start gap-4">
                  {cert.badge_url ? (
                    <button
                      type="button"
                      onClick={(e) => open(cert, e.currentTarget)}
                      className="shrink-0 overflow-hidden"
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "var(--r-md)",
                        border: "1px solid rgb(var(--accent-rgb) / 0.28)",
                        background: "rgb(var(--accent-rgb) / 0.08)",
                        cursor: "zoom-in",
                      }}
                      aria-label={`Enlarge the ${cert.name} certificate`}
                    >
                      <Image
                        src={cert.badge_url}
                        alt=""
                        width={56}
                        height={56}
                        sizes="56px"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex shrink-0 items-center justify-center"
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "var(--r-md)",
                        background: "rgb(var(--accent-rgb) / 0.1)",
                        border: "1px solid rgb(var(--accent-rgb) / 0.22)",
                      }}
                    >
                      <svg className="h-6 w-6" style={{ color: "var(--accent-soft)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-1)", lineHeight: 1.35 }}>
                      {cert.name}
                    </h3>
                    <p className="mt-1" style={{ color: "var(--accent-soft)", fontSize: "0.875rem" }}>
                      {cert.issuer}
                    </p>

                    {dates.length > 0 && <p className="meta mt-2.5">{dates.join(" · ")}</p>}

                    {cert.credential_id && (
                      <p className="meta mt-1" style={{ overflowWrap: "anywhere" }}>
                        ID {cert.credential_id}
                      </p>
                    )}
                  </div>
                </div>

                {cert.description && (
                  <p className="mt-4" style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                    {cert.description}
                  </p>
                )}

                {(cert.badge_url || cert.credential_url) && (
                  <div
                    className="mt-auto flex flex-wrap gap-2 pt-5"
                    style={{ borderTop: "1px solid var(--hairline)" }}
                  >
                    {cert.badge_url && (
                      <button
                        type="button"
                        className="btn-quiet"
                        onClick={(e) => open(cert, e.currentTarget)}
                      >
                        View certificate
                      </button>
                    )}
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-quiet"
                        onClick={() => sfx.access()}
                        aria-label={`Verify the ${cert.name} credential (opens in a new tab)`}
                      >
                        Verify
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </ul>

      {/* ── Lightbox ── */}
      {preview?.badge_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${preview.name} certificate`}
          style={{
            background: "rgb(var(--surface-0-rgb) / 0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
          onClick={close}
        >
          <div ref={dialogRef} className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={close}
              className="btn-quiet absolute -top-12 right-0"
            >
              Close
              <span className="meta" style={{ color: "inherit", opacity: 0.7 }}>Esc</span>
            </button>

            <div
              className="overflow-hidden"
              style={{
                border: "1px solid var(--hairline-strong)",
                borderRadius: "var(--r-lg)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <Image
                src={preview.badge_url}
                alt={`${preview.name} certificate issued by ${preview.issuer}`}
                width={900}
                height={640}
                sizes="(max-width: 800px) 92vw, 768px"
                className="h-auto w-full"
                priority
              />
            </div>

            <p className="meta mt-4 text-center">
              {[preview.name, preview.credential_id && `ID ${preview.credential_id}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}
