/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // TIP brand palette
        tip: {
          yellow: '#F5C400',
          'yellow-dark': '#C49B00',
          black: '#0a0a0a',
          charcoal: '#1e1e1e',
          gray: '#808080',
          'gray-light': '#AAAAAA',
        },
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
