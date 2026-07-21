"use client";

import { useEffect, useState } from "react";
import { getPortfolioData } from "@/services/api";

interface Experience {
  id: number;
  job_title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  responsibilities: string[] | null;
  technologies: string | null;
}

export default function Experience() {
  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    getPortfolioData()
      .then((data) => setItems(data.experience ?? []))
      .catch(() => {});
  }, []);

  return (
    <section id="experience" className="py-24" style={{ background: "#000510" }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-label">My Journey</p>
        <h2 className="section-title">Work Experience</h2>
        <div className="section-divider" />

        {items.length === 0 ? (
          <p
            className="text-center py-20 uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(0,245,255,0.3)" }}
          >
            No experience added yet.
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-3 top-2 bottom-2 w-px md:left-8"
              style={{ background: "linear-gradient(to bottom, #00f5ff40, #a855f720, transparent)" }}
            />

            <div className="space-y-8">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative pl-10 md:pl-24 animate-fade-in-up"
                  style={{ opacity: 0, animationDelay: `${idx * 0.15}s` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-3 top-4 md:left-8 -translate-x-1/2 flex items-center justify-center">
                    <div
                      className="w-3 h-3 rounded-full animate-pulse-glow"
                      style={{ background: item.is_current ? "#00ff88" : "#00f5ff", boxShadow: `0 0 8px ${item.is_current ? "#00ff88" : "#00f5ff"}` }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="p-6 transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(0,245,255,0.02)",
                      border: "1px solid rgba(0,245,255,0.08)",
                      borderLeft: `2px solid ${item.is_current ? "#00ff88" : "#00f5ff"}40`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3
                          className="text-white font-bold text-lg leading-tight"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {item.job_title}
                        </h3>
                        <p
                          className="font-semibold mt-0.5"
                          style={{ color: "#00f5ff", fontFamily: "'Syne', sans-serif", fontSize: "14px" }}
                        >
                          {item.company}
                        </p>
                        {item.location && (
                          <p
                            className="mt-1 uppercase tracking-widest"
                            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)" }}
                          >
                            {item.location}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        {item.is_current && (
                          <span className="badge-current flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                            Current
                          </span>
                        )}
                        <span
                          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}
                        >
                          {item.start_date} — {item.is_current ? "Present" : item.end_date}
                        </span>
                      </div>
                    </div>

                    {item.description && (
                      <p
                        className="leading-relaxed mb-4"
                        style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", fontFamily: "'Syne', sans-serif" }}
                      >
                        {item.description}
                      </p>
                    )}

                    {item.responsibilities && item.responsibilities.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {item.responsibilities.slice(0, 4).map((r, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span style={{ color: "#00f5ff", marginTop: "2px", flexShrink: 0, fontSize: "10px" }}>▸</span>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontFamily: "'Syne', sans-serif", lineHeight: "1.6" }}>
                              {r}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.technologies && (
                      <div
                        className="flex flex-wrap gap-2 pt-3"
                        style={{ borderTop: "1px solid rgba(0,245,255,0.06)" }}
                      >
                        {item.technologies.split(",").map((t) => (
                          <span key={t} className="badge-tech">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
