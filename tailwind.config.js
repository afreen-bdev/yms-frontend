export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        surface: "#ffffff",
        background: "#f8fafc"
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.08)"
      }
    },
  },
  plugins: [],
}