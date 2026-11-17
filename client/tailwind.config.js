/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saathi: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          ink: 'var(--color-ink)',
          muted: 'var(--color-muted)',
          border: 'var(--color-border)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-light': 'var(--color-primary-light)',
          accent: 'var(--color-accent)',
          'accent-light': 'var(--color-accent-light)',
          success: 'var(--color-success)',
          'success-light': 'var(--color-success-light)',
          warning: 'var(--color-warning)',
          'warning-light': 'var(--color-warning-light)',
          danger: 'var(--color-danger)',
          'danger-light': 'var(--color-danger-light)',
        },
        category: {
          farmers: 'var(--cat-farmers)',
          'farmers-bg': 'var(--cat-farmers-bg)',
          women: 'var(--cat-women)',
          'women-bg': 'var(--cat-women-bg)',
          students: 'var(--cat-students)',
          'students-bg': 'var(--cat-students-bg)',
          health: 'var(--cat-health)',
          'health-bg': 'var(--cat-health-bg)',
          seniors: 'var(--cat-seniors)',
          'seniors-bg': 'var(--cat-seniors-bg)',
          housing: 'var(--cat-housing)',
          'housing-bg': 'var(--cat-housing-bg)',
          skills: 'var(--cat-skills)',
          'skills-bg': 'var(--cat-skills-bg)',
          disability: 'var(--cat-disability)',
          'disability-bg': 'var(--cat-disability-bg)',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Noto Sans Kannada', 'Noto Sans Devanagari', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Noto Sans Kannada', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(28, 27, 25, 0.05), 0 1px 4px -1px rgba(28, 27, 25, 0.03)',
        'soft-md': '0 8px 24px -6px rgba(28, 27, 25, 0.08), 0 4px 12px -3px rgba(28, 27, 25, 0.04)',
        'soft-lg': '0 16px 40px -10px rgba(28, 27, 25, 0.12), 0 8px 20px -5px rgba(28, 27, 25, 0.06)',
        'soft-hover': '0 20px 32px -8px rgba(31, 111, 91, 0.15), 0 8px 16px -4px rgba(28, 27, 25, 0.06)',
      },
    },
  },
  plugins: [],
};
