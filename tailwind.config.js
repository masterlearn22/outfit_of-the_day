/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1A1A1A',
        secondary: '#F5F5F5',
        accent: '#C8A97E',
      }
    },
  },
  plugins: [],
}
