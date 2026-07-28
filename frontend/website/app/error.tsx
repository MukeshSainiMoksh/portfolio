"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        background: "#000510",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "rgba(255,68,102,0.8)",
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        SYS://ERROR · CONNECTION LOST
      </p>
      <h1
        style={{
          fontFamily: "'Orbitron', monospace",
          fontWeight: 800,
          fontSize: "clamp(22px, 4vw, 36px)",
          color: "#fff",
          margin: 0,
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "14px",
          color: "rgba(255,255,255,0.4)",
          maxWidth: "420px",
          lineHeight: 1.7,
        }}
      >
        The portfolio data could not be loaded right now. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#00f5ff",
          background: "rgba(0,245,255,0.06)",
          border: "1px solid rgba(0,245,255,0.35)",
          padding: "12px 32px",
          cursor: "pointer",
        }}
      >
        ↻ Retry
      </button>
    </div>
  );
}
