import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Новая премиальная цветовая палитра
      colors: {
        // Основные фоны
        background: {
          primary: '#f8f1eb',   // тёплый кремовый
          secondary: '#fdfaf7',  // мягкий сливочный
          card: '#ffffff',
        },
        // Текстовые цвета
        text: {
          primary: '#3f2a1e',    // глубокий тёплый коричневый
          secondary: '#6b5342',  // мягкий коричневый
          muted: '#a28c7a',      // приглушённый
          light: '#d4c5b8',      // очень светлый
        },
        // Акцентные цвета
        accent: {
          gold: '#d4a373',       // основной золотой
          goldDark: '#c9a66b',   // тёмное золото
          rose: '#f5d0e6',       // нежно-розовый
          dark: '#2c211b',       // тёмный акцент
        },
        // Системные цвета (для состояний)
        success: '#8b9e7c',
        error: '#b87c6e',
        warning: '#e2c4a1',
      },
      
      // Премиальные шрифты
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      
      // Размеры шрифтов (типографическая система)
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.625rem', letterSpacing: '0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.02em' }],
      },
      
      // Премиальные тени (очень мягкие)
      boxShadow: {
        'soft': '0 8px 20px -6px rgba(60, 40, 30, 0.08)',
        'hover': '0 20px 35px -12px rgba(60, 40, 30, 0.12)',
        'inner-soft': 'inset 0 1px 2px 0 rgba(60, 40, 30, 0.03)',
        'gold': '0 4px 12px -2px rgba(212, 163, 115, 0.2)',
      },
      
      // Плавные переходы
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      },
      
      // Дополнительные утилиты
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #d4a373 0%, #c9a66b 100%)',
        'gradient-soft': 'linear-gradient(135deg, #fdfaf7 0%, #f8f1eb 100%)',
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

export default config