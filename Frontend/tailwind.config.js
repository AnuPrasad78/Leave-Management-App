/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emids: {
          black: '#0E0E0E',
          surface: '#141414',
          surface2: '#262626',
          white: '#F2F2F0',
          teal: {
            light: '#ABC7CA',
            DEFAULT: '#47A2B0',
            deep: '#2A7682'
          },
          signal: {
            blue: '#00B9F9',
            green: '#45BDA0',
            red: '#E04F4F'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(to right, #9DC6CC 0%, #72B3BE 50%, #57A6B3 100%)',
      }
    },
  },
  plugins: [],
}
