import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "prospect-blue": "#0066FF",
        "prospect-navy": "#0A1428",
        "prospect-gray": "#F8F9FA",
        "prospect-dark": "#1A1A1A",
        "prospect-red": "#E63946",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-poppins)"],
      },
      keyframes: {
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-scale": "fadeInScale 1s ease-in-out",
        "fade-in": "fadeIn 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
