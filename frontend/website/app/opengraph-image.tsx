import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mukesh Kumar Saini — Software Engineer & AI Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #08080c 0%, #0d0d16 55%, #08080c 100%)",
          position: "relative",
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a5aeff",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          <div style={{ width: 46, height: 2, background: "#6e7bff", display: "flex" }} />
          Software Engineer · AI Developer
        </div>

        {/* name */}
        <div style={{ display: "flex", flexDirection: "column", color: "rgba(255,255,255,0.94)", fontSize: 92, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Mukesh</span>
          <span style={{ color: "#6e7bff" }}>Kumar Saini</span>
        </div>

        {/* tagline */}
        <div style={{ display: "flex", marginTop: 32, color: "rgba(255,255,255,0.72)", fontSize: 28 }}>
          Building the AI layer between ideas and reality.
        </div>

        {/* footer chips */}
        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          {["AI / ML", "FastAPI", "Next.js", "Azure AI"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 22px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(110,123,255,0.08)",
                color: "#a5aeff",
                fontSize: 20,
                letterSpacing: 2,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
