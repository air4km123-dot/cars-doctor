import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F33",
          light: "#142A42",
        },
        ink: "#111111",
        paper: "#FFFFFF",
        bg: "#F5F7F9",
        border: "#D9DEE5",
        status: {
          green: "#2E9E5B",
          yellow: "#E4B905",
          orange: "#F08A2C",
          red: "#E14848",
        },
      },
      fontFamily: {
        sans: [
          "Noto Sans Thai",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 2px 10px rgba(11, 31, 51, 0.06)",
        fab: "0 8px 20px rgba(11, 31, 51, 0.35)",
        sheet: "0 -8px 30px rgba(11, 31, 51, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
