"use client";

import { useEffect, useRef, useState } from "react";
import { getPortfolioData } from "@/services/api";
import { sfx } from "@/services/sounds";

interface Skill {
  id: number;
  category: string;
  skill_name: string;
  skill_level: number;
  icon_class: string | null;
}

const CATEGORY_CONFIG: Record<string, { label: string; accent: string; rgb: string }> = {
  "Languages":              { label: "⟨/⟩", accent: "#00f5ff", rgb: "0,245,255" },
  "Frameworks & Libraries": { label: "⚙",   accent: "#a855f7", rgb: "168,85,247" },
  "AI & Machine Learning":  { label: "◈",   accent: "#00ff88", rgb: "0,255,136" },
  "Cloud & DevOps":         { label: "☁",   accent: "#ff2d78", rgb: "255,45,120" },
  "Databases":              { label: "◉",   accent: "#00f5ff", rgb: "0,245,255" },
  "Tools":                  { label: "⬡",   accent: "#a855f7", rgb: "168,85,247" },
};

function SkillBar({ level, animate, accent }: { level: number; animate: boolean; accent: string }) {
  return (
    <div className="h-1 w-full relative" style={{ background: "rgba(255,255,255,0.05)" }}>
      <div
        style={{
          height: "100%",
          width: animate ? `${Math.min(level, 100)}%` : "0%",
          background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
          transition: "width 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 8px ${accent}`,
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [skills,  setSkills]  = useState<Skill[]>([]);
  const [animate, setAnimate] = useState(false);
  const sectionRef            = useRef<HTMLElement>(null);

  useEffect(() => {
    getPortfolioData()
      .then((data) => setSkills(data.skills ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); sfx.startup(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] = acc[skill.category] ?? []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" ref={sectionRef} className="py-24" style={{ background: "#000308" }}>
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-label">What I Know</p>
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="section-divider" />

        {Object.keys(byCategory).length === 0 ? (
          <div
            className="text-center py-20 uppercase tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(0,245,255,0.3)" }}
          >
            Loading skills...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(byCategory).map(([category, categorySkills], catIdx) => {
              const cfg = CATEGORY_CONFIG[category] ?? { label: "◆", accent: "#00f5ff", rgb: "0,245,255" };
              return (
                <div
                  key={category}
                  className="animate-fade-in-up p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    opacity: 0,
                    animationDelay: `${catIdx * 0.1}s`,
                    background: `rgba(${cfg.rgb}, 0.02)`,
                    border: `1px solid rgba(${cfg.rgb}, 0.08)`,
                    borderTop: `2px solid rgba(${cfg.rgb}, 0.4)`,
                  }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: `1px solid rgba(${cfg.rgb}, 0.08)` }}>
                    <span style={{ color: cfg.accent, fontSize: "16px", fontFamily: "'JetBrains Mono', monospace" }}>
                      {cfg.label}
                    </span>
                    <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {category}
                    </h3>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontFamily: "'Syne', sans-serif" }}>
                            {skill.skill_name}
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: cfg.accent }}>
                            {skill.skill_level}%
                          </span>
                        </div>
                        <SkillBar level={skill.skill_level} animate={animate} accent={cfg.accent} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
