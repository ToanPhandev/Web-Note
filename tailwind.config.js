/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#D0E8FF",
        "brand-primary-hover": "#b0d7ff",
        "brand-text": "#333333",
        "brand-background": "#FFFFFF",
      },
      gap: {
        section: "4rem",
      },
      borderRadius: {
        container: "0.5rem",
      },
    },
  },
  plugins: [],
};
