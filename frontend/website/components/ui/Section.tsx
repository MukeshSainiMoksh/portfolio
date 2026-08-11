import type { ReactNode } from "react";

/**
 * The shell every section shares: one container width, one gutter, one
 * vertical rhythm, one header shape.
 *
 * Sections used to each pick their own max-width (6xl here, 5xl there) and
 * their own header markup, which is why nothing lined up down the page.
 */
export default function Section({
  id,
  eyebrow,
  title,
  lede,
  align = "left",
  width = "wide",
  headingId,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  /** "text" narrows to reading width for prose-heavy sections. */
  width?: "wide" | "text";
  headingId?: string;
  children: ReactNode;
}) {
  const labelId = headingId ?? `${id}-heading`;

  return (
    <section id={id} aria-labelledby={labelId}>
      <div className="section-shell" data-width={width} data-align={align}>
        <header
          className="section-head"
          data-align={align}
          style={align === "center" ? { textAlign: "center" } : undefined}
        >
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 id={labelId} className="section-title">{title}</h2>
          {lede && <p className="section-lede">{lede}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
