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
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#FF5A5F',
          600: '#E8484D',
          700: '#be123c',
        },
        sunny: '#FFB800',
        soda: '#00B4D8',
        cream: '#FFFDF7',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans TC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        outfit: ['"Plus Jakarta Sans"', '"Noto Sans TC"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
