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
        "prospect-green": "#1B5E20",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "'Helvetica Neue'", "Arial", "sans-serif"],
        display: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 102, 255, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 102, 255, 0.9)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-scale": "fadeInScale 1s ease-in-out",
        "fade-in": "fadeIn 0.6s ease-in-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
