/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4A9B9B',
        secondary: '#E63946',
        'text-primary': '#2C3E50',
        'text-secondary': '#7F8C8D',
        'link': '#5DADE2',
        'bg-light': '#F5F5F5',
        'border': '#E0E0E0'
      },
      fontSize: {
        'title': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'subtitle': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'nav': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }]
      },
      spacing: {
        'sidebar': '280px'
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [],
};