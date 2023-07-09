import plugin from "tailwindcss/plugin";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        full: "4px 4px 0 0 var(--tw-shadow-color)",
      },
      colors: {
        bkg: "#e9e2db",
        "p-green": { 400: "#a2d6a4", 600: "#6cae7b", 900: "#396f45" },
      },
      maxWidth: {
        appContent: "var(--max-app-width)", // max-w-7xl: 1280px
      },
      padding: {
        xprose: "var(--dynamic-x-pad)",
      },
      zIndex: {
        nav: "var(--nav-z-index)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
    }),
  ],
};
