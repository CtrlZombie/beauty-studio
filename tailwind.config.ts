/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0a',
          secondary: '#1a1a1a',
        },
        text: {
          primary: '#f5f5f5',
          secondary: '#e5e5e5',
          accent: '#d4af7f',
        },
        accent: {
          gold: {
            light: '#d4af7f',
            DEFAULT: '#c9a66b',
            dark: '#b38b5d',
          },
          wine: '#4a2c2f',
          emerald: '#1f2e2a',
        },
        border: '#333333',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.04em',
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(212, 175, 127, 0.1), 0 2px 4px -1px rgba(212, 175, 127, 0.06)',
        hover: '0 10px 15px -3px rgba(212, 175, 127, 0.1), 0 4px 6px -2px rgba(212, 175, 127, 0.05)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(212, 175, 127, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 127, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 127, 0)' },
        },
      },
    },
  },
  plugins: [],
}