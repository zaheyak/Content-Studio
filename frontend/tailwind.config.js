/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // === Brand Palettes ===
        emeraldbrand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        goldbrand: {
          400: "#d97706",
          500: "#f59e0b",
        },
        // === Semantic Colors (your previous ones) ===
        'primary-blue': '#065f46',
        'primary-purple': '#047857',
        'primary-cyan': '#0f766e',
        'accent-gold': '#d97706',
        'accent-green': '#047857',
        'accent-orange': '#f59e0b',
        // === Neutral ===
        'bg-primary': '#f8fafc',
        'bg-secondary': '#e2e8f0',
        'bg-tertiary': '#cbd5e1',
        'bg-card': '#ffffff',
        'text-primary': '#1e293b',
        'text-secondary': '#475569',
        'text-muted': '#64748b',
        'text-accent': '#334155',
        // === Gamification ===
        'xp-color': '#f59e0b',
        'level-color': '#047857',
        'badge-color': '#10b981',
        'streak-color': '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #065f46, #047857)',
        'gradient-secondary': 'linear-gradient(135deg, #0f766e, #047857)',
        'gradient-accent': 'linear-gradient(135deg, #d97706, #f59e0b)',
        'gradient-card': 'linear-gradient(145deg, #ffffff, #f0fdfa)',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(6, 95, 70, 0.3)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'hover': '0 20px 60px rgba(6, 95, 70, 0.2)',
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        fadeInUp: 'fadeInUp 1s ease-out',
        gradientShift: 'gradientShift 8s ease-in-out infinite',
        progressGlow: 'progressGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        progressGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.5)' },
          '50%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
