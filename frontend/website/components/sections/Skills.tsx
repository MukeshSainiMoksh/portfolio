"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/services/sounds";

interface Skill {
  id: number;
  category: string;
  skill_name: string;
  skill_level: number;
  icon_class: string | null;
}

const CATEGORY_CONFIG: Record<string, { label: string; accent: string; rgb: string }> = {
  "Languages":              { label: "⟨/⟩", accent: "var(--accent)",      rgb: "var(--accent-rgb)" },
  "Frameworks & Libraries": { label: "⚙",   accent: "var(--accent-soft)", rgb: "var(--accent-soft-rgb)" },
  "AI & Machine Learning":  { label: "◈",   accent: "var(--success)",     rgb: "var(--success-rgb)" },
  "Cloud & DevOps":         { label: "☁",   accent: "var(--ember)",       rgb: "var(--ember-rgb)" },
  "Databases":              { label: "◉",   accent: "var(--accent)",      rgb: "var(--accent-rgb)" },
  "Tools":                  { label: "⬡",   accent: "var(--accent-soft)", rgb: "var(--accent-soft-rgb)" },
};

function SkillBar({ level, animate, accent, rgb }: { level: number; animate: boolean; accent: string; rgb: string }) {
  return (
    <div className="h-1 w-full relative" style={{ background: "rgb(255 255 255 / 0.05)" }}>
      <div
        style={{
          height: "100%",
          width: animate ? `${Math.min(level, 100)}%` : "0%",
          background: `linear-gradient(90deg, rgb(${rgb}), rgb(${rgb} / 0.5))`,
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
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const [animate, setAnimate] = useState(false);
  const sectionRef            = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); sfx.startup(); observer.disconnect(); } },
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
    <section id="skills" ref={sectionRef} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-label">What I Know</p>
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="section-divider" />

        {Object.keys(byCategory).length === 0 ? (
          <div
            className="text-center py-20 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--accent-rgb) / 0.75)" }}
          >
            Loading skills...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(byCategory).map(([category, categorySkills], catIdx) => {
              const cfg = CATEGORY_CONFIG[category] ?? { label: "◆", accent: "var(--accent)", rgb: "var(--accent-rgb)" };
              return (
                <div
                  key={category}
                  className="animate-fade-in-up p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    opacity: 0,
                    animationDelay: `${catIdx * 0.1}s`,
                    background: `rgb(${cfg.rgb} / 0.02)`,
                    border: `1px solid rgb(${cfg.rgb} / 0.08)`,
                    borderTop: `2px solid rgb(${cfg.rgb} / 0.4)`,
                    borderRadius: "var(--r-lg)",
                  }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: `1px solid rgb(${cfg.rgb} / 0.08)` }}>
                    <span style={{ color: cfg.accent, fontSize: "16px", fontFamily: "var(--font-mono)" }}>
                      {cfg.label}
                    </span>
                    <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                      {category}
                    </h3>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ color: "var(--text-2)", fontSize: "13px", fontFamily: "var(--font-sans)" }}>
                            {skill.skill_name}
                          </span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: cfg.accent }}>
                            {skill.skill_level}%
                          </span>
                        </div>
                        <SkillBar level={skill.skill_level} animate={animate} accent={cfg.accent} rgb={cfg.rgb} />
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
