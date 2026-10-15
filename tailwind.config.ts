import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0b0c0e",
          900: "#121317",
          850: "#181a20",
          800: "#20232c",
          700: "#2c303c",
          600: "#444958",
        },
        cream: {
          50: "#fdfbf7",
          100: "#f6f2e9",
          200: "#ebe4d5",
          300: "#ded2bd",
          400: "#c7b79e",
        },
        crimson: {
          400: "#ff4d5a",
          500: "#e63946",
          600: "#c92534",
          700: "#9e1925",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        japanese: ["'Noto Sans JP'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
