"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { sfx } from "@/services/sounds";

interface Project {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  role: string | null;
  duration: string | null;
  technologies: string[] | null;
  features: string[] | null;
  live_url: string | null;
  github_url: string | null;
  icon_class: string | null;
  project_tag: string | null;
  is_featured: boolean;
}

const PAGE_SIZE = 6;

function ExternalIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

/* ─── Details modal ──────────────────────────────────────────────────
   Everything the card doesn't have room for: the full description,
   role, duration, every feature and the complete stack.              */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true, onClose);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const meta = [
    project.role && { label: "Role", value: project.role },
    project.duration && { label: "Timeline", value: project.duration },
    project.project_tag && { label: "Category", value: project.project_tag },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      style={{
        background: "rgb(var(--surface-0-rgb) / 0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="chat-panel flex w-full max-w-2xl flex-col overflow-hidden"
        style={{
          maxHeight: "min(86dvh, 720px)",
          background: "rgb(var(--surface-2-rgb) / 0.92)",
          backdropFilter: "blur(28px) saturate(1.7)",
          WebkitBackdropFilter: "blur(28px) saturate(1.7)",
          border: "1px solid var(--hairline-strong)",
          borderRadius: "var(--r-xl)",
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.07), var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 p-6 pb-5"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {project.is_featured && <span className="badge-featured">Featured</span>}
            </div>
            <h3 style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.25 }}>
              {project.title}
            </h3>
            {project.tagline && (
              <p className="mt-1.5" style={{ color: "var(--accent-soft)", fontSize: "0.9375rem" }}>
                {project.tagline}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="btn-quiet shrink-0" aria-label="Close details">
            Close <span className="meta" style={{ color: "inherit", opacity: 0.7 }}>Esc</span>
          </button>
        </div>

        {/* Body — scrolls when content is taller than the panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {meta.length > 0 && (
            <dl className="mb-6 grid gap-4 sm:grid-cols-3">
              {meta.map(({ label, value }) => (
                <div key={label}>
                  <dt className="meta mb-1">{label}</dt>
                  <dd style={{ color: "var(--text-1)", fontSize: "0.9375rem", fontWeight: 500 }}>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.description && (
            <p style={{ color: "var(--text-2)", fontSize: "0.9375rem", lineHeight: 1.75 }}>
              {project.description}
            </p>
          )}

          {project.features && project.features.length > 0 && (
            <>
              <h4 className="mb-3 mt-7" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)" }}>
                What I built
              </h4>
              <ul className="space-y-2.5">
                {project.features.map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] shrink-0"
                      style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgb(var(--accent-rgb) / 0.8)" }}
                    />
                    <span style={{ color: "var(--text-2)", fontSize: "0.9375rem", lineHeight: 1.65 }}>{f}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <>
              <h4 className="mb-3 mt-7" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)" }}>
                Stack
              </h4>
              <ul className="flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
                {project.technologies.map((t, i) => (
                  <li key={i} className="chip">{t}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex flex-wrap gap-3 p-6 pt-5"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-cosmic" onClick={() => sfx.access()}>
              View live <ExternalIcon />
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-neural" onClick={() => sfx.access()}>
              Source code <ExternalIcon />
            </a>
          )}
          {!project.live_url && !project.github_url && (
            <span className="meta self-center">Private / client project — code not public</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = useCallback((p: Project, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setOpenProject(p);
    sfx.hologram();
  }, []);

  const close = useCallback(() => {
    setOpenProject(null);
    sfx.softClick();
    lastTrigger.current?.focus();
  }, []);

  const featuredCount = useMemo(() => projects.filter((p) => p.is_featured).length, [projects]);
  const filtered = filter === "featured" ? projects.filter((p) => p.is_featured) : projects;
  const displayed = showAll ? filtered : filtered.slice(0, PAGE_SIZE);

  const filters = [
    { key: "all" as const, label: "All", count: projects.length },
    { key: "featured" as const, label: "Featured", count: featuredCount },
  ];

  return (
    <Section
      id="projects"
      eyebrow="Work"
      title="Things I've built"
      lede="A mix of shipped products and systems I built to understand a problem properly. Click any card for the full story."
    >
      {projects.length === 0 ? (
        <p className="empty-state">No projects have been added yet.</p>
      ) : (
        <>
          {/* Filter — a toggle group, so screen readers get the pressed state */}
          <div role="group" aria-label="Filter projects" className="mb-8 flex flex-wrap gap-2">
            {filters.map(({ key, label, count }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(key);
                    setShowAll(false);
                    sfx.click();
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "var(--r-md)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all var(--dur-fast) var(--ease-out)",
                    border: `1px solid ${active ? "rgb(var(--accent-rgb) / 0.55)" : "var(--hairline)"}`,
                    background: active ? "rgb(var(--accent-rgb) / 0.12)" : "transparent",
                    color: active ? "var(--accent-soft)" : "var(--text-3)",
                  }}
                >
                  {label}
                  <span className="meta" style={{ color: "inherit", opacity: 0.7 }}>{count}</span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">
              No featured projects yet — switch to <strong style={{ color: "var(--text-2)" }}>All</strong> to see everything.
            </p>
          ) : (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {displayed.map((project, idx) => {
                  const tech = project.technologies ?? [];
                  const shown = tech.slice(0, 4);
                  const overflow = tech.length - shown.length;

                  return (
                    <Reveal as="li" key={project.id} delay={Math.min(idx, 5) * 0.05}>
                      <article className="card card-interactive group relative flex h-full flex-col">
                        {/* Stretched hit-area. A real button so it is keyboard
                            and screen-reader reachable; z-0 keeps the Live and
                            Code links (z-10) clickable above it. Links can't be
                            nested inside a button, which rules out wrapping the
                            whole card. */}
                        <button
                          type="button"
                          className="absolute inset-0 z-0 cursor-pointer"
                          style={{ borderRadius: "inherit", background: "transparent", border: "none" }}
                          aria-label={`View details of ${project.title}`}
                          onClick={(e) => open(project, e.currentTarget)}
                        />

                        <div className="pointer-events-none relative z-[1] flex h-full flex-col">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-1)", lineHeight: 1.3 }}>
                              {project.title}
                            </h3>
                            {project.is_featured && <span className="badge-featured shrink-0">Featured</span>}
                          </div>

                          {(project.project_tag || project.role) && (
                            <p className="meta mb-3">
                              {[project.project_tag, project.role].filter(Boolean).join(" · ")}
                            </p>
                          )}

                          {project.tagline && (
                            <p className="mb-2" style={{ color: "var(--accent-soft)", fontSize: "0.875rem" }}>
                              {project.tagline}
                            </p>
                          )}

                          {project.description && (
                            <p className="line-clamp-3" style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                              {project.description}
                            </p>
                          )}

                          {shown.length > 0 && (
                            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${project.title} tech stack`}>
                              {shown.map((t, i) => (
                                <li key={`${project.id}-t-${i}`} className="chip">{t}</li>
                              ))}
                              {overflow > 0 && (
                                <li className="meta self-center" style={{ paddingInline: "4px" }}>
                                  +{overflow} more
                                </li>
                              )}
                            </ul>
                          )}

                          <div
                            className="mt-auto flex flex-wrap items-center gap-2 pt-5"
                            style={{ borderTop: "1px solid var(--hairline)" }}
                          >
                            {/* Real links stay clickable above the stretched button */}
                            <span className="pointer-events-auto relative z-10 flex flex-wrap gap-2">
                              {project.live_url && (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-quiet"
                                  aria-label={`View ${project.title} live (opens in a new tab)`}
                                >
                                  Live <ExternalIcon />
                                </a>
                              )}
                              {project.github_url && (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-quiet"
                                  aria-label={`View ${project.title} source on GitHub (opens in a new tab)`}
                                >
                                  Code <ExternalIcon />
                                </a>
                              )}
                            </span>

                            {/* Affordance — the card is a door, say so */}
                            <span
                              className="meta ml-auto flex items-center gap-1 transition-colors duration-200 group-hover:text-[var(--accent-soft)]"
                              aria-hidden="true"
                            >
                              Details
                              <svg className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </ul>

              {filtered.length > PAGE_SIZE && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    className="btn-neural"
                    aria-expanded={showAll}
                    onClick={() => {
                      setShowAll((v) => !v);
                      showAll ? sfx.shutdown() : sfx.dataComplete();
                    }}
                  >
                    {showAll ? "Show fewer" : `Show all ${filtered.length} projects`}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {openProject && <ProjectModal project={openProject} onClose={close} />}
    </Section>
  );
}
