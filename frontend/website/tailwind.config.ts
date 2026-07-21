import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Syne", "system-ui", "sans-serif"],
        orbitron: ["Orbitron", "monospace"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        neural: {
          bg: "#000308",
          cyan: "#00f5ff",
          purple: "#a855f7",
          green: "#00ff88",
          pink: "#ff2d78",
        },
      },
      animation: {
        "neural-pulse": "neural-pulse 3s ease-in-out infinite",
        "scan": "scan 4s linear infinite",
      },
      keyframes: {
        "neural-pulse": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        scan: {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
