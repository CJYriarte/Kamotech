/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          main: '#063B78',
          deep: '#042A54',
        },
        sky: {
          primary: '#0088D1',
          deep: '#0077C8',
        },
        cyan: {
          light: '#5CCCF5',
          pale: '#BDEEFF',
        },
        cloud: {
          DEFAULT: '#FFFFFF',
          50: '#F8FCFF',
          100: '#EFF9FF',
          200: '#E8F7FF',
        },
        brand: {
          red: '#F7192D',
          redDeep: '#E91525',
        },
        gold: {
          DEFAULT: '#FFC400',
          light: '#FFD43B',
        },
        ink: {
          primary: '#0B2E59',
          secondary: '#55708F',
          muted: '#7C93AA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(11,46,89,0.08)',
        softLg: '0 8px 30px rgba(11,46,89,0.12)',
      },
    },
  },
  plugins: [],
};