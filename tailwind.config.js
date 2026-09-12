/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4B006E',
          'primary-dark': '#250038',
          'primary-light': '#6A009C',
          accent: '#F5C518',
          'accent-light': '#FFE57F',
          dark: '#000000',
          obsidian: '#08050C',
          surface: '#110B18',
          success: '#7CF3B4',
          error: '#FF6B6B',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(245, 197, 24, 0.35)',
        'purple-glow': '0 0 35px rgba(75, 0, 110, 0.5)',
      }
    },
  },
  plugins: [],
}
