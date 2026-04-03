import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  safelist: [
    "bg-sensor-temperature/10",
    "text-sensor-temperature",
    "border-sensor-temperature/30",
    "hover:bg-sensor-temperature/20",
    "bg-sensor-humidity/10",
    "text-sensor-humidity",
    "border-sensor-humidity/30",
    "hover:bg-sensor-humidity/20",
    "bg-sensor-light/10",
    "text-sensor-light",
    "border-sensor-light/30",
    "hover:bg-sensor-light/20",
  ],
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        sensor: {
          temperature: "hsl(var(--sensor-temperature))",
          "temperature-light": "hsl(var(--sensor-temperature-light))",
          humidity: "hsl(var(--sensor-humidity))",
          "humidity-light": "hsl(var(--sensor-humidity-light))",
          light: "hsl(var(--sensor-light))",
          "light-light": "hsl(var(--sensor-light-light))",
        },
        device: {
          off: "hsl(var(--device-off))",
          on: "hsl(var(--device-on))",
          loading: "hsl(var(--device-loading))",
          failed: "hsl(var(--device-failed))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        'sensor': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'sensor-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'glow-warm': '0 0 20px hsl(0, 85%, 58%, 0.3)',
        'glow-cool': '0 0 20px hsl(210, 95%, 58%, 0.3)',
        'glow-light': '0 0 20px hsl(48, 100%, 50%, 0.4)',
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
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "wave": {
          "0%, 100%": { transform: "translateX(0) scaleY(1)" },
          "25%": { transform: "translateX(-2px) scaleY(1.02)" },
          "50%": { transform: "translateX(0) scaleY(0.98)" },
          "75%": { transform: "translateX(2px) scaleY(1.02)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 8px currentColor)" },
          "50%": { opacity: "0.8", filter: "drop-shadow(0 0 16px currentColor)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 4px 15px -2px rgba(16,185,129,0.3), 0 0 20px rgba(16,185,129,0.2)",
          },
          "50%": {
            boxShadow: "0 4px 20px -2px rgba(16,185,129,0.5), 0 0 35px rgba(16,185,129,0.4)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 1.5s linear infinite",
        "wave": "wave 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
