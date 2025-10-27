/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "media", // respects the OS dark-mode preference
  theme: {
    extend: {
      colors: {
        // Contrast-aware brand set (AA on both light/dark backgrounds)
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          600: "#2563eb", // primary (AA on white)
          700: "#1d4ed8", // hover on white
          800: "#1e40af", // AA on light surfaces
        },
      },
      // Slightly stronger default ring for focus (pairs with :focus-visible)
      ringWidth: {
        DEFAULT: "3px",
      },
      ringColor: {
        DEFAULT: "#2563eb",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("@tailwindcss/typography"),
  ],
}
