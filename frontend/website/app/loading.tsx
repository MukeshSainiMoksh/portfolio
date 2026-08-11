export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "18px",
        background: "var(--surface-0)",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          border: "2px solid rgb(var(--accent-rgb) / 0.12)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--accent-soft)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Initializing
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
