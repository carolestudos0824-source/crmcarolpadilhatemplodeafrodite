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
        background: "#F4F0EA", // Fundo Claro
        foreground: "#111111", // Preto Apoio
        templo: {
          bg: "#F4F0EA",
          ivory: "#ECE5DC",
          gold: "#C9A35A",
          "gold-deep": "#9B7440",
          red: "#A61E25",
          black: "#111111",
        },
        primary: {
          DEFAULT: "#A61E25", // Vermelho Tulipa
          foreground: "#F4F0EA",
        },
        secondary: {
          DEFAULT: "#C9A35A", // Dourado Principal
          foreground: "#111111",
        },
        destructive: {
          DEFAULT: "#A61E25",
          foreground: "#F4F0EA",
        },
        muted: {
          DEFAULT: "#ECE5DC",
          foreground: "#111111",
        },
        accent: {
          DEFAULT: "#C9A35A",
          foreground: "#111111",
        },
        popover: {
          DEFAULT: "#ECE5DC",
          foreground: "#111111",
        },
        card: {
          DEFAULT: "#ECE5DC", // Marfim Rosado for cards
          foreground: "#111111",
        },
        sidebar: {
          DEFAULT: "#111111",
          foreground: "#F4F0EA",
          primary: "#A61E25",
          "primary-foreground": "#F4F0EA",
          accent: "#C9A35A",
          "accent-foreground": "#111111",
          border: "#C9A35A",
          ring: "#C9A35A",
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
