/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cyber: {
          bg: "#0a0a0f",
          bgAlt: "#1a1a2e",
          bgCard: "rgba(26, 26, 46, 0.6)",
          cyan: "#00f0ff",
          pink: "#ff00aa",
          blue: "#0066ff",
          purple: "#8b5cf6",
          green: "#00ff88",
          yellow: "#ffd700",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 240, 255, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 240, 255, 0.5)",
        "glow-pink": "0 0 20px rgba(255, 0, 170, 0.4)",
        "glow-blue": "0 0 20px rgba(0, 102, 255, 0.4)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        scan: "scan 4s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        flicker: "flicker 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
          "75%": { opacity: "0.95" },
        },
      },
    },
  },
  plugins: [],
};
