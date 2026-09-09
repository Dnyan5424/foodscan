/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#3F7D4A', deep: '#245B35', soft: '#76A86B' },
        sage: '#E8F0E4',
        charcoal: '#1D1D1B',
        orange: { DEFAULT: '#D9821F', gold: '#E69A32' },
        cream: '#F8F7F1',
        muted: '#777777',
        danger: '#C94B4B',
        warn: '#D99A2B',
        success: '#4E8B55',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(29,29,27,0.06)',
        lift: '0 16px 40px rgba(29,29,27,0.10)',
      },
    },
  },
  plugins: [],
}
