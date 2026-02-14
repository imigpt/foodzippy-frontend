/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'century-gothic': ['Century Gothic', 'Apple Gothic', 'sans-serif'],
        'playwrite': ['Playwrite US Trad Guides', 'serif'],
        'montserrat': ["Montserrat", "sans-serif"],
        'belgiano': ['BelgianoSerif', 'serif'],
      }
    }
  },
  plugins: [],
}