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
  "AI / NLP":       { icon: "◈", accent: "#00ff88", rgb: "0,255,136" },
  "AI / Chatbot":   { icon: "⬡", accent: "#a855f7", rgb: "168,85,247" },
  "AI / DevTools":  { icon: "⚡", accent: "#00f5ff", rgb: "0,245,255" },
  "Full Stack":     { icon: "⊕", accent: "#00f5ff", rgb: "0,245,255" },
  "Backend / API":  { icon: "⚙", accent: "#a855f7", rgb: "168,85,247" },
  "Data / Analytics":{ icon: "◉", accent: "#00ff88", rgb: "0,255,136" },
};
const DEFAULT_TAG = { icon: "◆", accent: "#00f5ff", rgb: "0,245,255" };

export default function Projects({ projects }: { projects: Project[] }) {
  const [showAll,  setShowAll]  = useState(false);
  const [filter,   setFilter]   = useState<"all" | "featured">("all");

  const filtered  = filter === "featured" ? projects.filter((p) => p.is_featured) : projects;
  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="projects" className="py-24" style={{ background: "#000308" }}>
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
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "8px 20px",
                border: filter === f ? "1px solid #00f5ff" : "1px solid rgba(255,255,255,0.1)",
                background: filter === f ? "rgba(0,245,255,0.08)" : "transparent",
                color: filter === f ? "#00f5ff" : "rgba(255,255,255,0.35)",
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
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(0,245,255,0.3)" }}
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
                      background: `rgba(${cfg.rgb}, 0.02)`,
                      border: `1px solid rgba(${cfg.rgb}, 0.08)`,
                      borderTop: `2px solid rgba(${cfg.rgb}, 0.4)`,
                      padding: "24px",
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-10 h-10 flex items-center justify-center"
                        style={{
                          background: `rgba(${cfg.rgb}, 0.08)`,
                          border: `1px solid rgba(${cfg.rgb}, 0.2)`,
                          color: cfg.accent,
                          fontFamily: "'JetBrains Mono', monospace",
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
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "9px",
                              color: `${cfg.accent}80`,
                              border: `1px solid rgba(${cfg.rgb}, 0.15)`,
                              padding: "2px 8px",
                              background: `rgba(${cfg.rgb}, 0.04)`,
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
                        color: "rgba(255,255,255,0.9)",
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {project.title}
                    </h3>

                    {project.tagline && (
                      <p
                        className="text-sm mb-3"
                        style={{ color: `${cfg.accent}99`, fontFamily: "'Syne', sans-serif" }}
                      >
                        {project.tagline}
                      </p>
                    )}

                    {project.description && (
                      <p
                        className="text-sm leading-relaxed mb-4 flex-1 line-clamp-3"
                        style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Syne', sans-serif" }}
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
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "9px",
                              padding: "2px 8px",
                              background: `rgba(${cfg.rgb}, 0.04)`,
                              border: `1px solid rgba(${cfg.rgb}, 0.12)`,
                              color: `${cfg.accent}80`,
                              letterSpacing: "0.5px",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", alignSelf: "center" }}>
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className="flex gap-3 mt-auto pt-4"
                      style={{ borderTop: `1px solid rgba(${cfg.rgb}, 0.08)` }}
                    >
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "9px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            padding: "7px 14px",
                            background: `rgba(${cfg.rgb}, 0.06)`,
                            border: `1px solid rgba(${cfg.rgb}, 0.3)`,
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
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "9px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            padding: "7px 14px",
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.4)",
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
                          style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", alignSelf: "center",
                                   fontFamily: "'JetBrains Mono', monospace" }}
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
