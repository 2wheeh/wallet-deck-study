/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#34D98F',
        secondary: {
          coral: 'FF7657',
          yellow: 'FCE849',
        },
        error: '#FF5757',
      },
    },
  },
  plugins: [],
};
