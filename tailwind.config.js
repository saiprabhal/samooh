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
        background: '#F7F6F2',
        surface: '#FFFFFF',
        surfaceMuted: '#F8FAFC',
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#16A34A',
          600: '#166534',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          DEFAULT: '#166534',
        },
        card: '#FFFFFF',
        cardHover: '#F8FAFC',
        accentBlue: '#2563EB',
        accentPurple: '#6366F1',
        accentGreen: '#16A34A',
        darkBorder: '#334155',
        darkMuted: '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'soft-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02)',
        'soft': '0 8px 24px -4px rgba(15, 23, 42, 0.05), 0 2px 8px -2px rgba(15, 23, 42, 0.02)',
        'soft-lg': '0 16px 36px -6px rgba(15, 23, 42, 0.07), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'soft-inset': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.03)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
