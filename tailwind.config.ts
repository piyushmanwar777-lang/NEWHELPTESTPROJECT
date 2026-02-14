import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        pink: {
          50: "var(--pink-50)",
          100: "var(--pink-100)",
          200: "var(--pink-200)",
          300: "var(--pink-300)",
          400: "var(--pink-400)",
          500: "var(--pink-500)",
          600: "var(--pink-600)",
          700: "var(--pink-700)",
          800: "var(--pink-800)",
          900: "var(--pink-900)",
        },
        purple: {
          50: "var(--purple-50)",
          100: "var(--purple-100)",
          200: "var(--purple-200)",
          300: "var(--purple-300)",
          400: "var(--purple-400)",
          500: "var(--purple-500)",
          600: "var(--purple-600)",
          700: "var(--purple-700)",
          800: "var(--purple-800)",
          900: "var(--purple-900)",
        },
        accent: {
          pink: "var(--accent-pink)",
          purple: "var(--accent-purple)",
          rose: "var(--accent-rose)",
        },
      },
      backgroundImage: {
        "gradient-romantic": "linear-gradient(135deg, var(--gradient-romantic-start) 0%, var(--gradient-romantic-end) 100%)",
        "gradient-soft": "linear-gradient(135deg, var(--gradient-soft-start) 0%, var(--gradient-soft-end) 100%)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
      fontFamily: {
        apple: "var(--font-apple)",
      },
    },
  },
  plugins: [],
};
export default config;

