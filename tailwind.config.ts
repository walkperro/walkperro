import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#F5F1E8",
        charcoal: "#0E0E0E",
        signal: "#EBFF00",
        ink: "#1A1A1A",
        smoke: "#6B6B6B",
        line: "#E5E0D2",
        "line-dark": "#2A2A2A",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Instrument Serif", "Georgia", "serif"],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.08em",
        wider: "0.12em",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
      },
      maxWidth: {
        prose: "65ch",
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(0.2, 0, 0, 1)",
      },
      transitionDuration: {
        snap: "180ms",
      },
    },
  },
  plugins: [],
};

export default config;
