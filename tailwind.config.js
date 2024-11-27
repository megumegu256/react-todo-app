/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cbgBlue: "rgb(20, 100, 120)",
      },
    },
  },
  plugins: [],
};
