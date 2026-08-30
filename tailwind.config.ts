import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clean House Collective brand palette (matches the logo)
        emerald: {
          DEFAULT: "#0D4F45",
          deep: "#0A3E37",
          light: "#166A5C",
        },
        sage: {
          DEFAULT: "#86A88A",
          light: "#A8C4AB",
          dark: "#6B8C6F",
        },
        cream: "#FAFAF7",
        charcoal: "#1E1E1E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 40px -15px rgba(13, 79, 69, 0.18)",
        "soft-lg": "0 20px 60px -20px rgba(13, 79, 69, 0.25)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
