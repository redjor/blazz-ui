import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../dist/**/*.{js,mjs}',
  ],
  theme: {},
  plugins: [],
} satisfies Config
