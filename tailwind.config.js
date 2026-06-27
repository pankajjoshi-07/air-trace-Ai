/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          black: '#050A15',
          navy: '#0F172A',
          blue: '#1E293B',
          cyan: '#00F0FF',
          electric: '#3B82F6',
          orange: '#F97316',
          red: '#EF4444',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'hud-cyan': '0 0 15px rgba(0, 240, 255, 0.15)',
        'hud-cyan-glow': '0 0 25px rgba(0, 240, 255, 0.35)',
        'hud-orange': '0 0 15px rgba(249, 115, 22, 0.15)',
        'hud-red': '0 0 15px rgba(239, 68, 68, 0.15)',
      }
    },
  },
  plugins: [],
}
