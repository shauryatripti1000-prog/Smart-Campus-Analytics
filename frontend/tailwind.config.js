/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dae5ff',
          200: '#bdd0ff',
          300: '#90b0ff',
          400: '#5c85ff',
          500: '#3b5fff',
          600: '#2540e0',
          700: '#1e32b8',
          800: '#1e2d94',
          900: '#1e2b74',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}