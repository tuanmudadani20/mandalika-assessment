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
        bg: "var(--bg)",
        surface: "var(--surface)",
        gold: "var(--gold)",
        "gold-dim": "var(--gold-dim)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        l1: "var(--l1)",
        l2: "var(--l2)",
        l3: "var(--l3)",
        l4: "var(--l4)",
        catA: "var(--cat-a)",
        catBs: "var(--cat-bs)",
        catB: "var(--cat-b)",
        catC: "var(--cat-c)",
        catCk: "var(--cat-ck)",
      },
      fontFamily: {
        display: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
