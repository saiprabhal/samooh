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
        background: '#FAF7EE',
        surface: '#FFFFFF',
        surfaceMuted: '#F4F0E6',
        neo: {
          bg: '#FBF8F1',
          black: '#000000',
          white: '#FFFFFF',
          green: '#22C55E',
          yellow: '#FFDE59',
          orange: '#FF8A48',
          pink: '#FF70A6',
          blue: '#3B82F6',
          purple: '#A855F7',
          mint: '#86EFAC',
          border: '#000000',
        },
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
        darkBorder: '#FFFFFF',
        darkMuted: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'neo-xs': '1.5px 1.5px 0px 0px #000000',
        'neo-sm': '2.5px 2.5px 0px 0px #000000',
        'neo': '4px 4px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
        'neo-dark-xs': '1.5px 1.5px 0px 0px #FFFFFF',
        'neo-dark-sm': '2.5px 2.5px 0px 0px #FFFFFF',
        'neo-dark': '4px 4px 0px 0px #FFFFFF',
        'neo-dark-lg': '6px 6px 0px 0px #FFFFFF',
        'neo-dark-xl': '8px 8px 0px 0px #FFFFFF',
        'subtle': '2px 2px 0px 0px #000000',
        'card': '4px 4px 0px 0px #000000',
      },
      borderWidth: {
        '2.5': '2.5px',
        '3': '3px',
      }
    },
  },
  plugins: [],
}
