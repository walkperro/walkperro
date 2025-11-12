import type { Config } from "tailwindcss";
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C",
        bone: "#F8F8F8",
        graphite: "#2B2B2C",
        silver: "#B8B8B8",
        emerald: "#005949",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
} satisfies Config;
