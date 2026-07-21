export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-[rgba(0,245,255,0.08)] py-10 px-4"
      style={{ background: "#000308" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.25)] to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <style>{`
            @keyframes ft-spin  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
            @keyframes ft-spinR { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
            @keyframes ft-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.8)} }
            .ft-ring { animation:ft-spin  10s linear infinite; transform-origin:36px 36px; }
            .ft-ihex { animation:ft-spinR  6s linear infinite; transform-origin:36px 36px; }
            .ft-core { animation:ft-pulse 2.4s ease-in-out infinite; transform-origin:36px 36px; }
          `}</style>
          <div className="flex items-center gap-2.5">
            <div style={{ width: "34px", height: "34px", flexShrink: 0 }}>
              <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <filter id="ft-glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <g className="ft-ring">
                  <circle cx="36" cy="36" r="33" stroke="rgba(0,220,255,0.45)" strokeWidth="1" strokeDasharray="5 4"/>
                  <line x1="36" y1="2"  x2="36" y2="9"  stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                  <line x1="36" y1="63" x2="36" y2="70" stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                  <line x1="2"  y1="36" x2="9"  y2="36" stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                  <line x1="63" y1="36" x2="70" y2="36" stroke="#00dcff" strokeWidth="1.8" opacity=".85"/>
                  <circle cx="36" cy="3"  r="2" fill="#00dcff"/>
                  <circle cx="36" cy="69" r="2" fill="#00dcff"/>
                  <circle cx="3"  cy="36" r="2" fill="#00dcff"/>
                  <circle cx="69" cy="36" r="2" fill="#00dcff"/>
                </g>
                <polygon points="36,10 59,23 59,49 36,62 13,49 13,23"
                  stroke="rgba(0,220,255,0.22)" strokeWidth="1" fill="rgba(0,220,255,0.03)"/>
                <g className="ft-ihex">
                  <polygon points="36,18 52,27 52,45 36,54 20,45 20,27"
                    stroke="rgba(0,220,255,0.14)" strokeWidth="1" fill="none" strokeDasharray="3 3"/>
                </g>
                <g filter="url(#ft-glow)">
                  <polyline points="21,44 21,27 30,37 36,27" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <line x1="38" y1="27" x2="38" y2="44" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round"/>
                  <polyline points="38,36 46,27" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
                  <polyline points="38,36 46,44" stroke="#00dcff" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
                </g>
                <g className="ft-core">
                  <circle cx="36" cy="36" r="4.5" fill="rgba(0,220,255,0.12)" stroke="#00dcff" strokeWidth="1.2"/>
                  <circle cx="36" cy="36" r="2"   fill="#00dcff"/>
                </g>
              </svg>
            </div>
            <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "16px", letterSpacing: "4px", color: "#fff" }}>
              MK<span style={{ color: "#00f5ff", textShadow: "0 0 10px rgba(0,245,255,0.7)" }}>S</span>
            </span>
          </div>
          <p
            className="text-[rgba(255,255,255,0.25)] text-[10px] mt-2 uppercase tracking-[3px]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
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
              className="text-[rgba(255,255,255,0.25)] hover:text-[#00f5ff] transition-colors duration-200"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p
            className="text-[rgba(255,255,255,0.2)] text-[10px] tracking-widest uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            © {year} Mukesh Kumar Saini
          </p>
          <p
            className="text-[rgba(255,255,255,0.12)] text-[9px] tracking-[2px] uppercase mt-1"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            All Rights Reserved
          </p>
          <p
            className="text-[rgba(255,255,255,0.1)] text-[9px] tracking-[1px] uppercase mt-0.5"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Built with Next.js & FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
