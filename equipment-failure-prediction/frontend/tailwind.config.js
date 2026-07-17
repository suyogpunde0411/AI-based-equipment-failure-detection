/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        enterprise: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9ddfe',
          300: '#7cc2fd',
          400: '#36a2fc',
          500: '#0c85eb',
          600: '#0266ca',
          700: '#0252a3',
          800: '#064686',
          900: '#0b3b6f',
          950: '#07254a',
        }
      }
    },
  },
  plugins: [],
}
