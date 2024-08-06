/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "dot-pulse-before": {
          "0%": {
            "box-shadow": "9984px 0 0 -5px",
          },
          "30%": {
            "box-shadow": "9984px 0 0 2px",
          },
          "60%, 100%": {
            "box-shadow": "9984px 0 0 -5px",
          },
        },
        "dot-pulse": {
          "0%": {
            "box-shadow": "9999px 0 0 -5px",
          },
          "30%": {
            "box-shadow": "9999px 0 0 2px",
          },
          "60%, 100%": {
            "box-shadow": "9999px 0 0 -5px",
          },
        },
        "dot-pulse-after": {
          "0%": {
            "box-shadow": "10014px 0 0 -5px",
          },
          "30%": {
            "box-shadow": "10014px 0 0 2px",
          },
          "60%, 100%": {
            "box-shadow": "10014px 0 0 -5px",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        body: "#2D120B",
        primary: {
          50: "#FDEEE9",
          100: "#FACABC",
          200: "#F8B09C",
          300: "#F48C6E",
          400: "#F27652",
          500: "#EF5427",
          600: "#D94C23",
          700: "#AA3C1C",
          800: "#832E15",
          900: "#642310",
        },
        secondary: {
          50: "#EDEDED",
          100: "#C7C7C7",
          200: "#ACACAC",
          300: "#868686",
          400: "#6F6F6F",
          500: "#4B4B4B",
          600: "#444444",
          700: "#353535",
          800: "#292929",
          900: "#202020",
        },
        success: {
          50: "#EFFFEC",
          100: "#CCFFC4",
          200: "#B4FFA7",
          300: "#91FF7F",
          400: "#7CFF66",
          500: "#5BFF40",
          600: "#53E83A",
          700: "#41B52D",
          800: "#328C23",
          900: "#266B1B",
        },
        warning: {
          50: "#FFF8EB",
          100: "#FDE9C1",
          200: "#FDDEA3",
          300: "#FCCF79",
          400: "#FBC65F",
          500: "#FAB837",
          600: "#E4A732",
          700: "#B28327",
          800: "#8A651E",
          900: "#694D17",
        },
        danger: {
          50: "#FFECEC",
          100: "#FFC4C4",
          200: "#FFA7A7",
          300: "#FF7F7F",
          400: "#FF6666",
          500: "#FF4040",
          600: "#E83A3A",
          700: "#B52D2D",
          800: "#8C2323",
          900: "#6B1B1B",
        },
        info: {
          50: "#EAEFFB",
          100: "#BECDF2",
          200: "#9FB5EC",
          300: "#7393E4",
          400: "#587EDE",
          500: "#2E5ED6",
          600: "#2A56C3",
          700: "#214398",
          800: "#193476",
          900: "#13275A",
        },
        body: {
          50: "#EAE7E7",
          100: "#BEB6B3",
          200: "#9F928F",
          300: "#73605C",
          400: "#58413C",
          600: "#2A100A",
          700: "#210D08",
          800: "#190A06",
          900: "#130805",
        },
      },
      fontSize: {
        xs: ["11px", { lineHeight: "13.2px" }],
        sm: ["12px", { lineHeight: "14.4px" }],
        base: ["14px", { lineHeight: "16.8px" }],
        lg: ["16px", { lineHeight: "19.2px" }],
        h6: ["18px", { lineHeight: "21.6px" }],
        h5: ["20px", { lineHeight: "24px" }],
        h4: ["22px", { lineHeight: "26.4px" }],
        h3: ["25px", { lineHeight: "30px" }],
        h2: ["28px", { lineHeight: "33.6%" }],
        h1: ["32px", { lineHeight: "38.4%" }],
      },
      fontFamily: {
        body: ["var(--font-poppins)"],
        heading: ["var(--font-roboto-slab)"],
      },
      keyframes: {
       spinLeft: {
        '0%': {transform: 'rotate(0deg)'},
        '100%': {transform: 'rotate(720deg)'}
        },
        spinRight: {
          '0%': {transform:'rotate(360deg)'},
          '100%': {transform:'rotate(0deg)'}
        }
      },
      animation: {
        spinLeft: 'spinLeft 2s linear infinite',
        spinRight: 'spinRight 1s linear infinite'
      }
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
