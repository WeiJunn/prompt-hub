import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f6f8f7",
        foreground: "#1f2933",
        card: "#ffffff",
        border: "#d7dde4",
        primary: {
          DEFAULT: "#12344d",
          foreground: "#f8fbff"
        },
        secondary: {
          DEFAULT: "#0f766e",
          foreground: "#ecfeff"
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#3b2a0a"
        },
        muted: {
          DEFAULT: "#eef2f5",
          foreground: "#5b6875"
        }
      },
      boxShadow: {
        card: "0 16px 48px rgba(18, 52, 77, 0.08)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans-sc)",
          "sans-serif"
        ],
        mono: [
          "var(--font-mono)",
          "monospace"
        ]
      }
    }
  },
  plugins: [
    typography
  ]
};

export default config;
