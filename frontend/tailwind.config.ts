import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#171D55",
          700: "#222a6e",
          800: "#1b2262",
          900: "#10143d",
        },
        gold: {
          DEFAULT: "#E8A23A",
          light: "#F3C679",
          dark: "#B87A1C",
        },
        brand: {
          green: "#278A43",
          greenDark: "#1d6c34",
        },
        mist: "#F7F8FC",
        ink: "#25283A",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,29,85,0.06), 0 8px 24px -12px rgba(23,29,85,0.18)",
        lift: "0 2px 4px rgba(23,29,85,0.08), 0 18px 36px -16px rgba(23,29,85,0.30)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
