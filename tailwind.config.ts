import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "famous-black": "#21232C",
        "famous-pink": "#F9C3DE",
        "famous-green": "#A7E2E3",
        "famous-blue": "#508991",
        "famous-neutral": "#EDCABF",
        "famous-white": "#faf9f9",
      },
    },
  },
  plugins: [],
} satisfies Config;
