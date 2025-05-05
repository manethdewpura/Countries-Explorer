/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'slideDown': 'slideDown 0.2s ease-out forwards',
        'spin': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      scrollbar: {
        DEFAULT: {
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '100vh',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#666',
          },
          '&.dark::-webkit-scrollbar-track': {
            background: '#374151',
          },
          '&.dark::-webkit-scrollbar-thumb': {
            background: '#4B5563',
          },
          '&.dark::-webkit-scrollbar-thumb:hover': {
            background: '#6B7280',
          },
        },
      },
    },
  },
  plugins: [],
}
