import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#230713",
        moss: "#970747",
        copper: "#970747",
        mint: "#fff4f8",
        pearl: "#FFFFFF",
        graphite: "#3a2630"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        official: ["var(--font-official)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(151, 7, 71, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
