/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-pink": "#FFD1DC",
        "custom-purple": "#E0B0FF",
        "custom-blue": "#A7C7E7",
        "brand-primary": "#FF6B6B",
        "brand-secondary": "#4ECDC4",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
