import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["Cinzel", "serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["DM Sans", "Inter", "system-ui", "sans-serif"],
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
        accent: ["Cormorant Garamond", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        templo: {
          black: "#000000",
          red: "#B80D2D",
          gold: "#D7BD79",
          ivory: "#F7F4EF",
          purple: "#5C2A7A",
        },
        primary: {
          DEFAULT: "#B80D2D",
          foreground: "#F7F4EF",
        },
        secondary: {
          DEFAULT: "#D7BD79",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F7F4EF",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#D7BD79",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "#D7BD79",
          light: "#E5D1A0",
          dark: "#B59955",
          muted: "hsl(var(--gold-muted))",
        },
        sidebar: {
          DEFAULT: "#000000",
          foreground: "#F7F4EF",
          primary: "#B80D2D",
          "primary-foreground": "#F7F4EF",
          accent: "#D7BD79",
          "accent-foreground": "#000000",
          border: "#D7BD79",
          ring: "#D7BD79",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "card-reveal": {
          from: { opacity: "0", transform: "rotateY(90deg) scale(0.8)" },
          to: { opacity: "1", transform: "rotateY(0deg) scale(1)" },
        },
        stars: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "card-reveal": "card-reveal 0.8s ease-out forwards",
        stars: "stars 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
