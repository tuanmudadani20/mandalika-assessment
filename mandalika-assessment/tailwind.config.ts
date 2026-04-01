import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--bg)',
        surface: 'var(--surface)',
        panel: 'var(--surface-2)',
        gold: 'var(--gold)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        success: '#1A6B43',
        solid: '#1D4D8A',
        warning: '#7A4E10',
        danger: '#8B2020',
      },
      borderRadius: {
        card: '11px',
        field: '8px',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
    },
  },
  plugins: [],
}

export default config
