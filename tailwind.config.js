/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#000000',
          surface: '#141414',
          raised: '#1f1f1f',
        },
        accent: {
          DEFAULT: '#c6ff33',
          light: '#ddff85',
          dark: '#9fd400',
        },
        ink: {
          DEFAULT: '#f2f2f2',
          muted: '#9a9a9e',
        },
      },
    },
  },
  plugins: [],
}
