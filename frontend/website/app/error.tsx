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
        background: "var(--surface-0)",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--ember)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        SYS://ERROR · CONNECTION LOST
      </p>
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(22px, 4vw, 36px)",
          color: "var(--text-1)",
          margin: 0,
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          color: "var(--text-3)",
          maxWidth: "420px",
          lineHeight: 1.7,
        }}
      >
        The portfolio data could not be loaded right now. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "var(--accent)",
          background: "rgb(var(--accent-rgb) / 0.06)",
          border: "1px solid rgb(var(--accent-rgb) / 0.35)",
          padding: "12px 32px",
          cursor: "pointer",
        }}
      >
        ↻ Retry
      </button>
    </div>
  );
}
