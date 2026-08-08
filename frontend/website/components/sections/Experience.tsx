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
    <section id="experience" className="py-24" style={{ background: "var(--surface-1)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-label">My Journey</p>
        <h2 className="section-title">Work Experience</h2>
        <div className="section-divider" />

        {items.length === 0 ? (
          <p
            className="text-center py-20 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--accent-rgb) / 0.75)" }}
          >
            No experience added yet.
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-3 top-2 bottom-2 w-px md:left-8"
              style={{ background: "linear-gradient(to bottom, rgb(var(--accent-rgb) / 0.25), rgb(var(--accent-soft-rgb) / 0.12), transparent)" }}
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
                      style={{ background: item.is_current ? "var(--success)" : "var(--accent)" }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="p-6 transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "rgb(var(--accent-rgb) / 0.02)",
                      border: "1px solid rgb(var(--accent-rgb) / 0.08)",
                      borderLeft: `2px solid ${item.is_current ? "rgb(var(--success-rgb) / 0.25)" : "rgb(var(--accent-rgb) / 0.25)"}`,
                      borderRadius: "var(--r-lg)",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3
                          className="text-white font-bold text-lg leading-tight"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {item.job_title}
                        </h3>
                        <p
                          className="font-semibold mt-0.5"
                          style={{ color: "var(--accent)", fontFamily: "var(--font-sans)", fontSize: "14px" }}
                        >
                          {item.company}
                        </p>
                        {item.location && (
                          <p
                            className="mt-1 uppercase tracking-widest"
                            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}
                          >
                            {item.location}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        {item.is_current && (
                          <span className="badge-current flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            Current
                          </span>
                        )}
                        <span
                          style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}
                        >
                          {item.start_date} — {item.is_current ? "Present" : item.end_date}
                        </span>
                      </div>
                    </div>

                    {item.description && (
                      <p
                        className="leading-relaxed mb-4"
                        style={{ color: "var(--text-3)", fontSize: "14px", fontFamily: "var(--font-sans)" }}
                      >
                        {item.description}
                      </p>
                    )}

                    {item.responsibilities && item.responsibilities.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {item.responsibilities.slice(0, 4).map((r, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span style={{ color: "var(--accent)", marginTop: "2px", flexShrink: 0, fontSize: "12px" }}>▸</span>
                            <span style={{ color: "var(--text-2)", fontSize: "13px", fontFamily: "var(--font-sans)", lineHeight: "1.6" }}>
                              {r}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.technologies && (
                      <div
                        className="flex flex-wrap gap-2 pt-3"
                        style={{ borderTop: "1px solid rgb(var(--accent-rgb) / 0.06)" }}
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
