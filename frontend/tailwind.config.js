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
        'primary-blue': '#065f46',
        'primary-purple': '#047857',
        'primary-cyan': '#0f766e',
        'accent-gold': '#d97706',
        'accent-green': '#047857',
        'accent-orange': '#f59e0b',
        'bg-primary': '#f8fafc',
        'bg-secondary': '#e2e8f0',
        'bg-tertiary': '#cbd5e1',
        'bg-card': '#ffffff',
        'text-primary': '#1e293b',
        'text-secondary': '#475569',
        'text-muted': '#64748b',
        'text-accent': '#334155',
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
    },
  },
  plugins: [],
};
