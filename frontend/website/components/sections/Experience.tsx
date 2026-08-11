import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { formatDateRange } from "@/lib/format";

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

export default function Experience({ items }: { items: Experience[] }) {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've worked"
      lede="Roles, and the things I actually shipped in them."
      width="text"
    >
      {items.length === 0 ? (
        <p className="empty-state">No experience has been added yet.</p>
      ) : (
        <ol className="relative space-y-5">
          {/* Spine. Sits behind the markers and fades out at the end so the
              timeline stops rather than being cut off. */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-3 bottom-3 w-px"
            style={{
              background:
                "linear-gradient(to bottom, rgb(var(--accent-rgb) / 0.4), rgb(var(--accent-rgb) / 0.15) 65%, transparent)",
            }}
          />

          {items.map((item, idx) => {
            const period = formatDateRange(item.start_date, item.end_date, item.is_current);
            const tech = (item.technologies ?? "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            return (
              <Reveal as="li" key={item.id} delay={Math.min(idx, 4) * 0.06} className="relative pl-8">
                {/* Marker */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-6"
                  style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    background: "var(--surface-0)",
                    border: `2px solid ${item.is_current ? "var(--success)" : "rgb(var(--accent-rgb) / 0.6)"}`,
                    boxShadow: item.is_current
                      ? "0 0 0 4px rgb(var(--success-rgb) / 0.14)"
                      : "0 0 0 4px rgb(var(--accent-rgb) / 0.08)",
                  }}
                />

                <article className="card card-interactive">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 style={{ fontSize: "var(--step-h3)", fontWeight: 600, color: "var(--text-1)" }}>
                        {item.job_title}
                      </h3>
                      <p className="mt-1" style={{ color: "var(--accent-soft)", fontSize: "0.9375rem", fontWeight: 500 }}>
                        {item.company}
                        {item.location && (
                          <span style={{ color: "var(--text-3)", fontWeight: 400 }}> · {item.location}</span>
                        )}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      {item.is_current && (
                        <span className="badge-current">
                          <span className="glow-dot" style={{ width: 6, height: 6, boxShadow: "none" }} />
                          Current
                        </span>
                      )}
                      {period && <span className="meta">{period}</span>}
                    </div>
                  </div>

                  {item.description && (
                    <p style={{ color: "var(--text-2)", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                      {item.description}
                    </p>
                  )}

                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {item.responsibilities.map((r, i) => (
                        <li key={`${item.id}-r-${i}`} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-[9px] shrink-0"
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: "rgb(var(--accent-rgb) / 0.8)",
                            }}
                          />
                          <span style={{ color: "var(--text-2)", fontSize: "0.9375rem", lineHeight: 1.65 }}>
                            {r}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {tech.length > 0 && (
                    <ul
                      className="mt-5 flex flex-wrap gap-2 pt-4"
                      style={{ borderTop: "1px solid var(--hairline)" }}
                      aria-label={`Technologies used at ${item.company}`}
                    >
                      {tech.map((t, i) => (
                        <li key={`${item.id}-t-${i}`} className="chip">{t}</li>
                      ))}
                    </ul>
                  )}
                </article>
              </Reveal>
            );
          })}
        </ol>
      )}
    </Section>
  );
}
