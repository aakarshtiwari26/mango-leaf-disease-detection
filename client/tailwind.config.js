export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        mango: {
          50: "#fff8e6",
          100: "#ffefbf",
          200: "#ffe087",
          300: "#ffcf45",
          400: "#ffbf1c",
          500: "#f5a700",
          600: "#d98700",
          700: "#ad6500",
          800: "#7a4700",
          900: "#4d2e00",
        },
        leaf: {
          50: "#eaffef",
          100: "#c8ffd9",
          200: "#92f7b7",
          300: "#58df8e",
          400: "#2ab869",
          500: "#169150",
          600: "#117442",
          700: "#0f5c35",
          800: "#0c462a",
          900: "#08311d",
        },
      },
      boxShadow: {
        glass: "0 20px 60px rgba(15, 23, 42, 0.18)",
        glow: "0 0 0 1px rgba(255,255,255,.12), 0 20px 40px rgba(245,167,0,.18)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(255,191,28,.25), transparent 25%), radial-gradient(circle at bottom right, rgba(22,145,80,.22), transparent 25%), linear-gradient(135deg, rgba(12,27,18,.98), rgba(20,40,30,.92))",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.25s linear infinite",
      },
    },
  },
  plugins: [],
};
