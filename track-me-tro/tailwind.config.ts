import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kinetic Transit Design System Colors
        surface: {
          DEFAULT: "#f7f9fb",
          dim: "#d8dadc",
          bright: "#f7f9fb",
          variant: "#e0e3e5",
          container: {
            lowest: "#ffffff",
            low: "#f2f4f6",
            DEFAULT: "#eceef0",
            high: "#e6e8ea",
            highest: "#e0e3e5",
          },
        },
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-variant": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",

        "on-surface": {
          DEFAULT: "#191c1e",
          variant: "#5b4137",
        },
        "on-surface-variant": "#5b4137",

        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",

        outline: {
          DEFAULT: "#8f7065",
          variant: "#e4beb2",
        },
        "outline-variant": "#e4beb2",

        "surface-tint": "#a93800",

        primary: {
          DEFAULT: "#a53700",
          electric: "#F95700",
          container: "#ce4700",
          fixed: {
            DEFAULT: "#ffdbcf",
            dim: "#ffb59b",
          },
        },
        "primary-container": "#ce4700",
        "primary-fixed": "#ffdbcf",
        "primary-fixed-dim": "#ffb59b",
        "inverse-primary": "#ffb59b",

        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#fffbff",
          fixed: {
            DEFAULT: "#380d00",
            variant: "#812900",
          },
        },
        "on-primary-container": "#fffbff",
        "on-primary-fixed": "#380d00",
        "on-primary-fixed-variant": "#812900",

        secondary: {
          DEFAULT: "#5b5e68",
          charcoal: "#181C24",
          container: "#dcdfeb",
          fixed: {
            DEFAULT: "#dfe2ed",
            dim: "#c3c6d1",
          },
        },
        "secondary-container": "#dcdfeb",
        "secondary-fixed": "#dfe2ed",
        "secondary-fixed-dim": "#c3c6d1",

        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#5f626c",
          fixed: {
            DEFAULT: "#181c24",
            variant: "#434750",
          },
        },
        "on-secondary-container": "#5f626c",
        "on-secondary-fixed": "#181c24",
        "on-secondary-fixed-variant": "#434750",

        tertiary: {
          DEFAULT: "#69594b",
          peach: "#FFE8D6",
          container: "#837163",
          fixed: {
            DEFAULT: "#f5decd",
            dim: "#d8c3b2",
          },
        },
        "tertiary-container": "#837163",
        "tertiary-fixed": "#f5decd",
        "tertiary-fixed-dim": "#d8c3b2",

        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#fffbff",
          fixed: {
            DEFAULT: "#25190f",
            variant: "#534437",
          },
        },
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed": "#25190f",
        "on-tertiary-fixed-variant": "#534437",

        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "error-container": "#ffdad6",

        "on-error": {
          DEFAULT: "#ffffff",
          container: "#93000a",
        },
        "on-error-container": "#93000a",

        background: "#f7f9fb",
        "on-background": "#191c1e",

        // Semantic Transit Statuses
        transit: {
          orange: "#F95700",
          charcoal: "#181C24",
          peach: "#FFE8D6",
          success: "#10B981",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "3xl": "1.75rem",
        full: "9999px",
      },
      spacing: {
        gutter: "1rem",
        margin: "1.25rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
      },
      boxShadow: {
        elevation1: "0 4px 20px -2px rgba(24, 28, 36, 0.05)",
        elevation2: "0 10px 25px -4px rgba(24, 28, 36, 0.10)",
        elevation3: "0 8px 30px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

