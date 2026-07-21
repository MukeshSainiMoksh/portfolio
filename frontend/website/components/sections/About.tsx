"use client";

import { useEffect, useRef, useState } from "react";
import { getPortfolioData } from "@/services/api";

function useCountUp(target: number, duration = 1400, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

export default function About() {
  const [about, setAbout]       = useState<Record<string, string>>({});
  const [statsActive, setStats] = useState(false);
  const statsRef                = useRef<HTMLDivElement>(null);

  const yearsCount   = useCountUp(2,  1200, statsActive);
  const projectCount = useCountUp(10, 1400, statsActive);
  const certCount    = useCountUp(1,  800,  statsActive);

  useEffect(() => {
    getPortfolioData()
      .then((data) => setAbout(data.profile?.about ?? {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStats(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const infoItems = [
    { label: "Location",   value: about.location     ?? "Mohali, Punjab, India",    accent: "#00f5ff" },
    { label: "Email",      value: about.email        ?? "codermsaini@gmail.com",     accent: "#a855f7" },
    { label: "Phone",      value: about.phone        ?? "+91 82190 05065",           accent: "#00ff88" },
    { label: "Status",     value: about.availability ?? "Open to Opportunities",     accent: "#00f5ff" },
  ];

  return (
    <section id="about" className="py-24" style={{ background: "#000510" }}>
      <div className="max-w-6xl mx-auto px-6">
        <p className="section-label">Who I Am</p>
        <h2 className="section-title">About Me</h2>
        <div className="section-divider" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <div className="animate-slide-left" style={{ opacity: 0 }}>
            <div className="space-y-5 mb-8">
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.8", fontFamily: "'Syne', sans-serif", fontSize: "15px" }}>
                {about.bio ??
                  "I'm a qualified Software Engineer from India with 2+ years of experience, specializing in AI-driven solutions and full-stack development. I have hands-on expertise in Python frameworks like Django, Flask and FastAPI, along with deep experience in ML/AI including Generative AI."}
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", lineHeight: "1.8", fontFamily: "'Syne', sans-serif", fontSize: "14px" }}>
                I have a strong foundation in NLP, computer vision, retrieval-based pipelines, and modern web architectures. Experienced in cross-cultural environments and coordinating with teams in the USA.
              </p>
            </div>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["Python", "FastAPI", "PyTorch", "React", "PostgreSQL", "LLMs", "RAG", "Azure"].map((tech) => (
                <span key={tech} className="badge-tech">{tech}</span>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              {about.github_url && (
                <a href={about.github_url} target="_blank" rel="noopener noreferrer" className="btn-neural py-2.5 px-5" style={{ fontSize: "10px" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {about.linkedin_url && (
                <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className="btn-neural py-2.5 px-5"
                   style={{ fontSize: "10px", color: "rgba(168,85,247,0.85)", borderColor: "rgba(168,85,247,0.35)", background: "rgba(168,85,247,0.05)" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Right: info cards + stats */}
          <div className="animate-slide-right" style={{ opacity: 0 }}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {infoItems.map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="p-4 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: `rgba(${accent === "#00f5ff" ? "0,245,255" : accent === "#a855f7" ? "168,85,247" : "0,255,136"}, 0.02)`,
                    border: `1px solid rgba(${accent === "#00f5ff" ? "0,245,255" : accent === "#a855f7" ? "168,85,247" : "0,255,136"}, 0.1)`,
                    borderLeft: `2px solid ${accent}40`,
                  }}
                >
                  <p
                    className="mb-1.5 uppercase tracking-[2px]"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: `${accent}99` }}
                  >
                    {label}
                  </p>
                  <p className="text-white text-sm font-medium break-all leading-snug"
                     style={{ fontFamily: "'Syne', sans-serif" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats — animated counters */}
            <div
              ref={statsRef}
              className="p-6 col-span-2"
              style={{
                background: "rgba(0,245,255,0.02)",
                border: "1px solid rgba(0,245,255,0.08)",
                borderTop: "1px solid rgba(0,245,255,0.2)",
              }}
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { count: yearsCount,   suffix: "+", label: "Years Exp." },
                  { count: projectCount, suffix: "+", label: "Projects" },
                  { count: certCount,    suffix: "",  label: "Azure Cert" },
                ].map(({ count, suffix, label }) => (
                  <div key={label}>
                    <div
                      className="mb-1"
                      style={{
                        fontFamily: "'Orbitron', monospace",
                        fontWeight: 800,
                        fontSize: "24px",
                        background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        transition: "all 0.1s",
                      }}
                    >
                      {count}{suffix}
                    </div>
                    <div
                      className="uppercase tracking-[2px]"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
