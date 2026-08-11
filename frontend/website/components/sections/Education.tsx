import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

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

/* Type only changes the glyph. It used to change the accent colour too,
   which put four competing hues on one screen. */
const TYPE_ICON: Record<string, string> = {
  degree: "◎",
  school: "⊙",
  certification: "◈",
  course: "⬡",
};

export default function Education({ items }: { items: Education[] }) {
  return (
    <Section
      id="education"
      eyebrow="Education"
      title="Academic background"
      width="text"
    >
      {items.length === 0 ? (
        <p className="empty-state">No education has been added yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((item, idx) => (
            <Reveal as="li" key={item.id} delay={Math.min(idx, 4) * 0.06}>
              <article className="card card-interactive h-full">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex shrink-0 items-center justify-center"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "var(--r-md)",
                      background: "rgb(var(--accent-rgb) / 0.1)",
                      border: "1px solid rgb(var(--accent-rgb) / 0.22)",
                      color: "var(--accent-soft)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "17px",
                    }}
                  >
                    {TYPE_ICON[item.type] ?? "◆"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-1)", lineHeight: 1.35 }}>
                      {item.degree}
                    </h3>
                    <p className="mt-1" style={{ color: "var(--accent-soft)", fontSize: "0.875rem" }}>
                      {item.institution}
                    </p>

                    <p className="meta mt-2.5">
                      {[item.year, item.location].filter(Boolean).join(" · ")}
                    </p>

                    {item.grade && (
                      <p className="meta mt-1.5" style={{ color: "var(--ember)" }}>
                        {item.grade}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-3" style={{ color: "var(--text-3)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      )}
    </Section>
  );
}
