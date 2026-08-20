/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#ffffff',
          grey: '#cdcfd3',
          black1: '#414042',
          black2: '#232527',
          black3: '#131314',
          red: '#d5342a',
          'red-deep': '#b70000',
          'red-coral': '#ec7c67',
          orange: '#e58925',
          'orange-deep': '#c64b00',
          'orange-soft': '#f3aa66',
          yellow: '#f9cf32',
          'yellow-deep': '#e8ba00',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
