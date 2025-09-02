/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gray': '#808080',
        'brand-blue': '#005176',
        'brand-navy': '#002b50',
        'brand-orange': '#FFA855',
        'brand-pink': '#FFB0B9',
        'brand-light-gray': '#D9D9D9',
        'brand-white': '#FFFFFF',
        'brand-black': '#000000',
      },
      fontFamily: {
        'arial': ['Arial', 'sans-serif'],
      },
      fontWeight: {
        'regular': 400,
        'extrabold': 800,
      }
    },
  },
  plugins: [],
}

