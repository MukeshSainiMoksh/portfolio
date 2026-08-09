"use client";

import { useMemo, useState } from "react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { sfx } from "@/services/sounds";

interface Project {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
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

export default function Projects({ projects }: { projects: Project[] }) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "featured">("all");

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
      lede="A mix of shipped products and systems I built to understand a problem properly."
    >
      {projects.length === 0 ? (
        <p className="empty-state">No projects have been added yet.</p>
      ) : (
        <>
          {/* Filter — a toggle group, so screen readers get the pressed state */}
          <div
            role="group"
            aria-label="Filter projects"
            className="mb-8 flex flex-wrap gap-2"
          >
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

          {/* This check used to be on projects.length, so filtering to
              "Featured" with no featured projects rendered an empty grid. */}
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
                      <article className="card card-interactive flex h-full flex-col">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-1)", lineHeight: 1.3 }}>
                            {project.title}
                          </h3>
                          {project.is_featured && <span className="badge-featured shrink-0">Featured</span>}
                        </div>

                        {project.project_tag && (
                          <p className="meta mb-3">{project.project_tag}</p>
                        )}

                        {project.tagline && (
                          <p className="mb-2" style={{ color: "var(--accent-soft)", fontSize: "0.875rem" }}>
                            {project.tagline}
                          </p>
                        )}

                        {project.description && (
                          <p
                            className="line-clamp-3"
                            style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.65 }}
                          >
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
                          className="mt-auto flex flex-wrap gap-2 pt-5"
                          style={{ borderTop: "1px solid var(--hairline)" }}
                        >
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
                          {!project.live_url && !project.github_url && (
                            <span className="meta self-center">Private project</span>
                          )}
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
    </Section>
  );
}
