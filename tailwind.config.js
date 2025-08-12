/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    extend: {
       boxShadow: {
        'lg': '0 0 10px rgba(0, 0, 0, 0.2)', // override shadow-lg
      },
    },
  },
  plugins: [],
}

