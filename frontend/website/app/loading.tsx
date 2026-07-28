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
        background: "#000510",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          border: "2px solid rgba(0,245,255,0.12)",
          borderTopColor: "#00f5ff",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "rgba(0,245,255,0.5)",
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}
      >
        Initializing
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
