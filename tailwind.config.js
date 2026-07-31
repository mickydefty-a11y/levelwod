/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#121212',
          surface: '#1c1c1e',
          raised: '#26262a',
        },
        coral: {
          DEFAULT: '#ff6b5b',
          light: '#ff8a7d',
          dark: '#e2503f',
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
