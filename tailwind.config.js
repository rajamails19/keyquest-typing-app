/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      animation: {
        'float-up': 'floatUp var(--duration, 10s) linear forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.4s ease-in-out',
        'star-spin': 'starSpin 0.5s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-110vh) rotate(5deg)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px 0px currentColor' },
          '50%': { boxShadow: '0 0 30px 8px currentColor' },
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        starSpin: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.08)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
