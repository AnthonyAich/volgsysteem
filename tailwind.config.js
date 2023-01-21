/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // $lightBlue: #f1f8fc;
      // $blue: #4ca2d5;
      // $darkGrey: #344054;
      // $lightGrey: #d0d5dd;
      // $yellow: #ffe500;
      // $red: #ef4444;
      colors: {
        lightBlue: '#f1f8fc',
        blue: '#4ca2d5',
        darkGrey: '#344054',
        lightGrey: '#d0d5dd',
        yellow: '#ffe500',
        red: '#ef4444',
        green: '#34C759',
      }
    },
  },
  plugins: [],
}
