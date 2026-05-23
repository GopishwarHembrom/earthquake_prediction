/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 42px -20px rgba(0, 0, 0, 0.7)",
      },
      colors: {
        panel: "rgba(15, 23, 42, 0.7)",
        border: "rgba(148, 163, 184, 0.2)",
      },
    },
  },
  plugins: [],
};
