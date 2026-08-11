import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

interface Skill {
  id: number;
  category: string;
  skill_name: string;
  skill_level: number;
  icon_class: string | null;
}

/* Category order is editorial, not alphabetical — the things worth leading
   with come first. Anything unlisted falls to the end in data order. */
const CATEGORY_ORDER = [
  "Languages",
  "AI & Machine Learning",
  "Frameworks & Libraries",
  "Backend",
  "Databases",
  "Cloud & DevOps",
  "Frontend",
  "Tools",
];

/** Above this, a skill is marked "core". Replaces the old percentage bars —
    a self-assigned "React 87%" carries no information a reader can use. */
const CORE_THRESHOLD = 85;

export default function Skills({ skills }: { skills: Skill[] }) {
  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  const categories = Object.entries(byCategory).sort(([a], [b]) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const hasCore = skills.some((s) => s.skill_level >= CORE_THRESHOLD);

  return (
    <Section
      id="skills"
      eyebrow="Stack"
      title="What I build with"
      lede="Grouped by where they sit in a system. The highlighted ones are what I reach for first and have shipped with repeatedly."
    >
      {categories.length === 0 ? (
        <p className="empty-state">No skills have been added yet.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(([category, categorySkills], idx) => {
              // core skills lead each group
              const sorted = [...categorySkills].sort(
                (a, b) => b.skill_level - a.skill_level
              );
              const headingId = `skills-cat-${category.replace(/\W+/g, "-").toLowerCase()}`;

              return (
                <Reveal key={category} delay={Math.min(idx, 5) * 0.05}>
                  <div className="card card-interactive h-full">
                    <h3
                      id={headingId}
                      className="mb-4 pb-4"
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--text-1)",
                        borderBottom: "1px solid var(--hairline)",
                      }}
                    >
                      {category}
                    </h3>

                    <ul className="flex flex-wrap gap-2" aria-labelledby={headingId}>
                      {sorted.map((skill) => {
                        const core = skill.skill_level >= CORE_THRESHOLD;
                        return (
                          <li
                            key={skill.id}
                            className="chip"
                            style={
                              core
                                ? {
                                    background: "rgb(var(--accent-rgb) / 0.14)",
                                    borderColor: "rgb(var(--accent-rgb) / 0.4)",
                                    color: "var(--accent-soft)",
                                  }
                                : undefined
                            }
                          >
                            {skill.skill_name}
                            {core && <span className="sr-only"> (core skill)</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {hasCore && (
            <p className="meta mt-6 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "3px",
                  background: "rgb(var(--accent-rgb) / 0.14)",
                  border: "1px solid rgb(var(--accent-rgb) / 0.4)",
                  display: "inline-block",
                }}
              />
              Highlighted = core, used across multiple shipped projects
            </p>
          )}
        </>
      )}
    </Section>
  );
}
