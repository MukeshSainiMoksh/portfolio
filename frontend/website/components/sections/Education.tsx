interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string | null;
  year: string | null;
  grade: string | null;
  type: string;
  description: string | null;
}

const TYPE_CONFIG: Record<string, { icon: string; accent: string; rgb: string }> = {
  degree:        { icon: "◎", accent: "var(--accent)",       rgb: "var(--accent-rgb)" },
  school:        { icon: "⊙", accent: "var(--success)",      rgb: "var(--success-rgb)" },
  certification: { icon: "◈", accent: "var(--accent-soft)",  rgb: "var(--accent-soft-rgb)" },
  course:        { icon: "⬡", accent: "var(--accent)",       rgb: "var(--accent-rgb)" },
};
const DEFAULT_TYPE = { icon: "◆", accent: "var(--accent)", rgb: "var(--accent-rgb)" };

export default function Education({ items }: { items: Education[] }) {

  return (
    <section id="education" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-label">Academic Background</p>
        <h2 className="section-title">Education</h2>
        <div className="section-divider" />

        {items.length === 0 ? (
          <p
            className="text-center py-20 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--accent-rgb) / 0.75)" }}
          >
            No education added yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {items.map((item, idx) => {
              const cfg = TYPE_CONFIG[item.type] ?? DEFAULT_TYPE;
              return (
                <div
                  key={item.id}
                  className="animate-fade-in-up transition-all duration-300 hover:-translate-y-1 p-6"
                  style={{
                    opacity: 0,
                    animationDelay: `${idx * 0.15}s`,
                    background: `rgb(${cfg.rgb} / 0.02)`,
                    border: `1px solid rgb(${cfg.rgb} / 0.08)`,
                    borderLeft: `2px solid rgb(${cfg.rgb} / 0.4)`,
                    borderRadius: "var(--r-lg)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 flex items-center justify-center shrink-0"
                      style={{
                        background: `rgb(${cfg.rgb} / 0.06)`,
                        border: `1px solid rgb(${cfg.rgb} / 0.2)`,
                        color: cfg.accent,
                        fontFamily: "var(--font-mono)",
                        fontSize: "18px",
                        borderRadius: "var(--r-md)",
                      }}
                    >
                      {cfg.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className="font-bold text-base leading-tight"
                          style={{ color: "var(--text-1)", fontFamily: "var(--font-sans)" }}
                        >
                          {item.degree}
                        </h3>
                        <span
                          className="capitalize shrink-0"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            padding: "2px 8px",
                            background: `rgb(${cfg.rgb} / 0.06)`,
                            border: `1px solid rgb(${cfg.rgb} / 0.15)`,
                            color: cfg.accent,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            borderRadius: "var(--r-md)",
                          }}
                        >
                          {item.type}
                        </span>
                      </div>

                      <p
                        className="font-medium text-sm mb-2"
                        style={{ color: cfg.accent, fontFamily: "var(--font-sans)" }}
                      >
                        {item.institution}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {item.location && (
                          <span
                            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}
                          >
                            {item.location}
                          </span>
                        )}
                        {item.year && (
                          <span
                            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}
                          >
                            {item.year}
                          </span>
                        )}
                        {item.grade && (
                          <span
                            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgb(var(--ember-rgb) / 0.85)" }}
                          >
                            {item.grade}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p
                          className="text-sm mt-3 leading-relaxed"
                          style={{ color: "var(--text-3)", fontFamily: "var(--font-sans)" }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
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
