/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50 : '#eae8f8',
          100 : '#cac6ef',
          200 : '#a7a1e4',
          300 : '#847bd9',
          400 : '#695ed0',
          500 : '#4f42c8',
          600 : '#483cc2',
          700 : '#3f33bb',
          800 : '#362bb4',
          900 : '#261da7',
          A100 : '#e1e0ff',
          A200 : '#b1adff',
          A400 : '#807aff',
          A700 : '#6860ff',
        },
        accent: {
          50: '#e8feef',
          100: '#c8fcd8',
          200: '#a2fabf',
          300: '#79f7a6',
          400: '#59f192',
          500: '#36eb7f',
          600: '#2ada73',
          700: '#1ac565',
          800: '#0bb35a',
          900: '#009144'
        }
      }
    },
  },
  plugins: [],
}

