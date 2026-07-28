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
          background: "linear-gradient(135deg, #000308 0%, #040a1a 55%, #060312 100%)",
          position: "relative",
        }}
      >
        {/* corner brackets */}
        <div style={{ position: "absolute", top: 40, left: 40, width: 36, height: 36, borderTop: "3px solid #00f5ff", borderLeft: "3px solid #00f5ff", display: "flex" }} />
        <div style={{ position: "absolute", top: 40, right: 40, width: 36, height: 36, borderTop: "3px solid #00f5ff", borderRight: "3px solid #00f5ff", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 40, left: 40, width: 36, height: 36, borderBottom: "3px solid #00f5ff", borderLeft: "3px solid #00f5ff", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 36, height: 36, borderBottom: "3px solid #00f5ff", borderRight: "3px solid #00f5ff", display: "flex" }} />

        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "rgba(0,245,255,0.65)",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          <div style={{ width: 46, height: 2, background: "rgba(0,245,255,0.5)", display: "flex" }} />
          Software Engineer · AI Developer
        </div>

        {/* name */}
        <div style={{ display: "flex", flexDirection: "column", color: "#fff", fontSize: 92, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Mukesh</span>
          <span style={{ color: "#00f5ff" }}>Kumar Saini</span>
        </div>

        {/* tagline */}
        <div style={{ display: "flex", marginTop: 32, color: "rgba(255,255,255,0.55)", fontSize: 28 }}>
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
                border: "1px solid rgba(0,245,255,0.35)",
                background: "rgba(0,245,255,0.07)",
                color: "#00f5ff",
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
