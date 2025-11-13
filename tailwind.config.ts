import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#020617",
        bone: "#F9F5EC",
        emerald: "#005949",
        silver: "#94A3B8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at 0 0, rgba(148,163,184,0.14), transparent 58%), radial-gradient(circle at 100% 100%, rgba(0,89,73,0.45), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
