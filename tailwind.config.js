/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0faf8',
          100: '#d0f0ea',
          200: '#a3e0d4',
          300: '#6dc9b8',
          400: '#3aad9a',
          500: '#1A7A6E',
          600: '#166359',
          700: '#124f47',
          800: '#0e3d37',
          900: '#0a2d29',
        },
        accent: {
          400: '#f7c948',
          500: '#F5B731',
          600: '#d4970a',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8fafa',
          100: '#f1f4f3',
          200: '#e4eae8',
          300: '#cdd7d4',
        },
        ink: {
          900: '#1E2D3D',
          700: '#3d5463',
          500: '#4A6572',
          300: '#7a9aa8',
          100: '#b8cdd4',
        },
      },
      boxShadow: {
        card:    '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md':'0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'card-lg':'0 8px 24px 0 rgb(0 0 0 / 0.10), 0 4px 8px -4px rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.25rem',
      },
    },
  },
  plugins: [],
};
