import type { Config } from "tailwindcss";

/**
 * Every value here resolves to a CSS custom property declared in
 * app/globals.css. Tokens live in one place; this file only exposes them
 * to Tailwind's utility generator.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:  ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:  ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
      },
      colors: {
        surface: {
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          soft:    "rgb(var(--accent-soft-rgb) / <alpha-value>)",
          deep:    "var(--accent-deep)",
        },
        ember:   "rgb(var(--ember-rgb) / <alpha-value>)",
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        warning: "rgb(var(--warning-rgb) / <alpha-value>)",
        danger:  "rgb(var(--danger-rgb) / <alpha-value>)",
        ink: {
          1: "var(--text-1)",
          2: "var(--text-2)",
          3: "var(--text-3)",
        },
        hairline: {
          DEFAULT: "var(--hairline)",
          strong:  "var(--hairline-strong)",
        },
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        md:     "var(--shadow-md)",
        lg:     "var(--shadow-lg)",
        accent: "var(--shadow-accent)",
      },
      fontSize: {
        meta:    ["var(--step-meta)", { lineHeight: "1.5" }],
        display: ["var(--step-display)", { lineHeight: "0.92", letterSpacing: "-0.035em" }],
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
      },
    },
  },
  plugins: [],
};

export default config;
