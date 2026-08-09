"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

const STACK = ["Python", "FastAPI", "PyTorch", "React", "Next.js", "PostgreSQL", "LLMs", "RAG", "Azure"];

function useCountUp(target: number, duration = 1400, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let raf = 0;
    let start: number | null = null;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out so the number settles instead of stopping dead
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    // without this the chain keeps running (and setting state) after unmount
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return count;
}

export default function About({ about }: { about: Record<string, string> }) {
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDListElement>(null);

  const years = Number(about.stat_years) || 3;
  const projects = Number(about.stat_projects) || 10;
  const certs = Number(about.stat_certs) || 1;

  const yearsCount = useCountUp(years, 1100, statsActive);
  const projectCount = useCountUp(projects, 1300, statsActive);
  const certCount = useCountUp(certs, 800, statsActive);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStatsActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bio =
    about.bio ??
    "I'm a software engineer from India with 3+ years building AI-driven products end to end — retrieval pipelines, FastAPI services, and the interfaces on top of them.";
  const bioSecondary =
    about.bio_secondary ??
    "My work sits where machine learning meets production: evaluation harnesses, retrieval quality, and making inference cheap enough to actually ship. I've worked across NLP, computer vision and modern web architectures, coordinating with teams in the US.";

  const facts = [
    { label: "Location", value: about.location ?? "Mohali, Punjab, India" },
    { label: "Email", value: about.email ?? "codermsaini@gmail.com" },
    { label: "Phone", value: about.phone ?? "+91 82190 05065" },
    { label: "Status", value: about.availability ?? "Open to opportunities" },
  ];

  const stats = [
    { value: yearsCount, suffix: "+", label: "Years experience" },
    { value: projectCount, suffix: "+", label: "Projects shipped" },
    { value: certCount, suffix: "", label: "Azure certification" },
  ];

  return (
    <Section
      id="about"
      eyebrow="About"
      title="Engineer first, AI second"
      lede="The interesting problems are rarely the model. They're everything around it — the data, the evaluation, and whether it survives contact with real users."
    >
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        {/* ── Prose ── */}
        <Reveal>
          <p style={{ color: "var(--text-2)", fontSize: "1.0625rem", lineHeight: 1.75 }}>
            {bio}
          </p>
          <p className="mt-5" style={{ color: "var(--text-3)", fontSize: "0.9375rem", lineHeight: 1.75 }}>
            {bioSecondary}
          </p>

          <h3 className="mt-9 mb-3" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)" }}>
            Working with
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label="Core technologies">
            {STACK.map((tech) => (
              <li key={tech} className="chip">{tech}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {about.github_url && (
              <a href={about.github_url} target="_blank" rel="noopener noreferrer" className="btn-neural">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {about.linkedin_url && (
              <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-neural">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </Reveal>

        {/* ── At a glance ── */}
        <Reveal delay={0.08}>
          <div className="card">
            <h3 className="mb-5" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-2)" }}>
              At a glance
            </h3>

            <dl className="space-y-4">
              {facts.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                  <dt className="meta sm:w-24 sm:shrink-0">{label}</dt>
                  <dd
                    style={{
                      color: "var(--text-1)",
                      fontSize: "0.9375rem",
                      // wrap long emails at sensible points, not mid-character
                      overflowWrap: "anywhere",
                    }}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <dl
              ref={statsRef}
              className="mt-7 grid grid-cols-3 gap-4 border-t pt-6"
              style={{ borderColor: "var(--hairline)" }}
            >
              {stats.map(({ value, suffix, label }) => (
                <div key={label}>
                  <dd
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      color: "var(--text-1)",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {value}
                    {suffix && <span style={{ color: "var(--accent-soft)" }}>{suffix}</span>}
                  </dd>
                  <dt className="meta" style={{ lineHeight: 1.4 }}>{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
