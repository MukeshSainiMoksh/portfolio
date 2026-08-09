export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-hairline py-10"
      style={{ background: "rgb(var(--surface-0-rgb) / 0.55)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(var(--accent-rgb) / 0.25), transparent)",
        }}
      />

      <div className="container-shell flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: "8px",
                height: "8px",
                flexShrink: 0,
                background: "var(--accent)",
                borderRadius: "var(--r-sm)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "-0.02em",
                color: "var(--text-1)",
              }}
            >
              MKS
            </span>
          </div>
          <p
            className="text-ink-3 text-meta mt-2 uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Software Engineer · AI Developer
          </p>
        </div>

        <div className="flex items-center gap-8">
          {[
            { href: "#about",          label: "About" },
            { href: "#projects",       label: "Projects" },
            { href: "#certifications", label: "Certifications" },
            { href: "#contact",        label: "Contact" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-ink-3 hover:text-accent transition-colors duration-200"
              style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p
            className="text-ink-3 text-meta tracking-widest uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            © {year} Mukesh Kumar Saini
          </p>
          <p
            className="text-ink-3 text-meta tracking-[2px] uppercase mt-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            All Rights Reserved
          </p>
          <p
            className="text-ink-3 text-meta tracking-[1px] uppercase mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Built with Next.js & FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
