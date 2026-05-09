import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        borderline: "rgb(var(--borderline) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 16px 40px rgb(15 23 42 / 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
