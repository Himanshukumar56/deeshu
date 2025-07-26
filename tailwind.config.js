/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#4A90E2",
        "brand-secondary": "#50E3C2",
        "brand-dark": "#2c3e50",
        "brand-light": "#ecf0f1",
        "brand-accent": "#f39c12",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
