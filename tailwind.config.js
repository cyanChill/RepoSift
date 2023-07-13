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
        1.5: "1.5px",
        3: "3px",
      },
      boxShadow: {
        full: "var(--bs-offset-x) var(--bs-offset-y) 0 0 var(--tw-shadow-color)",
      },
      colors: {
        bkg: "#e9e2db",
        "p-green": { 400: "#a2d6a4", 600: "#6cae7b", 900: "#396f45" },
      },
      maxWidth: {
        appContent: "var(--max-app-width)", // max-w-7xl: 1280px
        "appContent-1/2": "calc(var(--max-app-width)/2)",
        "appContent-1/3": "calc(var(--max-app-width)/3)",
      },
      padding: {
        xprose: "var(--dynamic-x-pad)",
      },
      zIndex: {
        nav: "var(--nav-z-index)",
      },
      animation: {
        marqueeX: "marqueeX var(--marqueeX-anim-duration) linear infinite",
        rotate: "rotate var(--rotate-anim-duration) linear infinite",
      },
      keyframes: {
        marqueeX: {
          "0%": { transform: "translateX(100vw)" },
          "100%": { transform: "translateX(-100%)" },
        },
        rotate: {
          "0%": {
            transform: "rotate(0deg)",
            translate: "var(--tw-translate-x) var(--tw-translate-y)",
          },
          "100%": {
            transform: "rotate(360deg)",
            translate: "var(--tw-translate-x) var(--tw-translate-y)",
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    }),
  ],
};
