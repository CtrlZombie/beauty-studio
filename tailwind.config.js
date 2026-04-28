/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Основные фоны и текст (исправлены названия, чтобы классы существовали)
        background: {
          primary: "#fef9f0",   // для bg-background-primary
          secondary: "#fdf5e6", // для bg-background-secondary
        },
        text: {
          primary: "#2b2a28",   // для text-text-primary
          secondary: "#5c5a58", // для text-text-secondary
          muted: "#9c9a97",     // для text-text-muted
        },
        accent: {
          gold: "#d4af37",      // для accent-gold
          goldDark: "#b8922e",
          goldLight: "#e8d291",
        },
        // Розовые оттенки (на случай, если используются в компонентах)
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec489a",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        // Фиолетовые (на случай, если используются)
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 20px -8px rgba(0, 0, 0, 0.08)",
        hover: "0 20px 35px -12px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #d4af37 0%, #b8922e 100%)",
      },
    },
  },
  plugins: [],
};