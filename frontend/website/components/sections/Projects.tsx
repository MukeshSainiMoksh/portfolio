"use client";

import { useState } from "react";
import { sfx } from "@/services/sounds";
import TiltCard from "@/components/ui/TiltCard";

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

const TAG_CONFIG: Record<string, { icon: string; accent: string; rgb: string }> = {
  "AI / NLP":       { icon: "◈", accent: "var(--success)",     rgb: "var(--success-rgb)" },
  "AI / Chatbot":   { icon: "⬡", accent: "var(--accent-soft)", rgb: "var(--accent-soft-rgb)" },
  "AI / DevTools":  { icon: "⚡", accent: "var(--accent)",      rgb: "var(--accent-rgb)" },
  "Full Stack":     { icon: "⊕", accent: "var(--accent)",      rgb: "var(--accent-rgb)" },
  "Backend / API":  { icon: "⚙", accent: "var(--accent-soft)", rgb: "var(--accent-soft-rgb)" },
  "Data / Analytics":{ icon: "◉", accent: "var(--ember)",      rgb: "var(--ember-rgb)" },
};
const DEFAULT_TAG = { icon: "◆", accent: "var(--accent)", rgb: "var(--accent-rgb)" };

export default function Projects({ projects }: { projects: Project[] }) {
  const [showAll,  setShowAll]  = useState(false);
  const [filter,   setFilter]   = useState<"all" | "featured">("all");

  const filtered  = filter === "featured" ? projects.filter((p) => p.is_featured) : projects;
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-label">What I&apos;ve Built</p>
        <h2 className="section-title">Projects</h2>
        <div className="section-divider" />

        {/* Filter tabs */}
        <div className="flex gap-3 mb-10">
          {(["all", "featured"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setShowAll(false); sfx.click(); }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "8px 20px",
                borderRadius: "var(--r-md)",
                border: filter === f ? "1px solid var(--accent)" : "1px solid var(--hairline)",
                background: filter === f ? "rgb(var(--accent-rgb) / 0.08)" : "transparent",
                color: filter === f ? "var(--accent)" : "var(--text-3)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f === "all" ? "All Projects" : "Featured"}
            </button>
          ))}
        </div>

        {projects.length === 0 ? (
          <p
            className="text-center py-20 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--accent-rgb) / 0.75)" }}
          >
            No projects added yet.
          </p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayed.map((project, idx) => {
                const cfg = project.project_tag ? (TAG_CONFIG[project.project_tag] ?? DEFAULT_TAG) : DEFAULT_TAG;
                return (
                  <TiltCard
                    key={project.id}
                    className="flex flex-col animate-fade-in-up group"
                    style={{
                      opacity: 0,
                      animationDelay: `${(idx % 6) * 0.08}s`,
                      background: `rgb(${cfg.rgb} / 0.02)`,
                      border: `1px solid rgb(${cfg.rgb} / 0.08)`,
                      borderTop: `2px solid rgb(${cfg.rgb} / 0.4)`,
                      borderRadius: "var(--r-lg)",
                      padding: "24px",
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-10 h-10 flex items-center justify-center"
                        style={{
                          background: `rgb(${cfg.rgb} / 0.08)`,
                          border: `1px solid rgb(${cfg.rgb} / 0.2)`,
                          borderRadius: "var(--r-md)",
                          color: cfg.accent,
                          fontFamily: "var(--font-mono)",
                          fontSize: "18px",
                        }}
                      >
                        {cfg.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {project.is_featured && <span className="badge-featured">Featured</span>}
                        {project.project_tag && (
                          <span
                            className="uppercase tracking-widest"
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              color: `rgb(${cfg.rgb} / 0.85)`,
                              border: `1px solid rgb(${cfg.rgb} / 0.15)`,
                              borderRadius: "var(--r-md)",
                              padding: "2px 8px",
                              background: `rgb(${cfg.rgb} / 0.04)`,
                            }}
                          >
                            {project.project_tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      className="font-bold text-base mb-1 transition-colors"
                      style={{
                        color: "var(--text-1)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {project.title}
                    </h3>

                    {project.tagline && (
                      <p
                        className="text-sm mb-3"
                        style={{ color: `rgb(${cfg.rgb} / 0.9)`, fontFamily: "var(--font-sans)" }}
                      >
                        {project.tagline}
                      </p>
                    )}

                    {project.description && (
                      <p
                        className="text-sm leading-relaxed mb-4 flex-1 line-clamp-3"
                        style={{ color: "var(--text-3)", fontFamily: "var(--font-sans)" }}
                      >
                        {project.description}
                      </p>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              padding: "2px 8px",
                              background: `rgb(${cfg.rgb} / 0.04)`,
                              border: `1px solid rgb(${cfg.rgb} / 0.12)`,
                              borderRadius: "var(--r-md)",
                              color: `rgb(${cfg.rgb} / 0.85)`,
                              letterSpacing: "0.5px",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span style={{ color: "var(--text-3)", fontSize: "12px", alignSelf: "center" }}>
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className="flex gap-3 mt-auto pt-4"
                      style={{ borderTop: `1px solid rgb(${cfg.rgb} / 0.08)` }}
                    >
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            padding: "7px 14px",
                            background: `rgb(${cfg.rgb} / 0.06)`,
                            border: `1px solid rgb(${cfg.rgb} / 0.3)`,
                            borderRadius: "var(--r-md)",
                            color: cfg.accent,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s",
                          }}
                        >
                          Live Demo ↗
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            padding: "7px 14px",
                            background: "transparent",
                            border: "1px solid var(--hairline)",
                            borderRadius: "var(--r-md)",
                            color: "var(--text-3)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s",
                          }}
                        >
                          GitHub ↗
                        </a>
                      )}
                      {!project.live_url && !project.github_url && (
                        <span
                          style={{ color: "var(--text-3)", fontSize: "12px", alignSelf: "center",
                                   fontFamily: "var(--font-mono)" }}
                        >
                          Private Project
                        </span>
                      )}
                    </div>
                  </TiltCard>
                );
              })}
            </div>

            {filtered.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => { setShowAll(!showAll); showAll ? sfx.shutdown() : sfx.dataComplete(); }}
                  className="btn-neural"
                >
                  {showAll ? "Show Less" : `View All ${filtered.length} Projects`}
                  <span>{showAll ? "↑" : "↓"}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
