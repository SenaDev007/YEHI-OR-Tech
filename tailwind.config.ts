import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fonds neutres premium
        'noir-profond': '#080A0F',
        'noir-2': '#0D1117',
        'noir-3': '#141921',
        // Bleus extraits du logo
        'bleu-nuit': '#071A2F',
        'bleu-tech': '#0B3D91',
        'bleu-electrique': '#1464F4',
        'bleu-medium': '#1A2744',
        // Or extrait du logo
        or: {
          DEFAULT: '#F5B700',
          light: '#FFD166',
          pale: '#FFF3C4',
          vivid: '#FFC700',
          ombre: '#C88000',
        },
        // Textes
        'blanc-creme': '#F8F5EE',
        'gris-light': '#C5C8D0',
        'gris': '#8A8F9E',
        'gris-dark': '#4B5563',
        // Statuts
        'success': '#4ADE80',
        'warning': '#FBBF24',
        'danger': '#F87171',
        'whatsapp': '#25D366',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-1': ['clamp(2.75rem, 6vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2.25rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-3': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      clipPath: {
        'angular': 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        'angular-sm': 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        'cut-corner': 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '28px',
        '3xl': '36px',
      },
      backgroundImage: {
        'grid-gold': 'linear-gradient(rgba(245, 183, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 183, 0, 0.04) 1px, transparent 1px)',
        'halo-or': 'radial-gradient(circle at center, rgba(245, 183, 0, 0.10) 0%, transparent 70%)',
        'halo-bleu': 'radial-gradient(circle at center, rgba(20, 100, 244, 0.08) 0%, transparent 70%)',
      },
      animation: {
        'rotate-slow': 'rotate 20s linear infinite',
        'pulse-whatsapp': 'pulse-whatsapp 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
      },
      keyframes: {
        'pulse-whatsapp': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.6)' },
          '50%': { boxShadow: '0 0 0 12px rgba(37, 211, 102, 0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'gold-glow': '0 20px 60px rgba(201, 168, 76, 0.15)',
        'gold-glow-strong': '0 0 30px rgba(245, 183, 0, 0.45)',
        'card-hover': '0 20px 60px rgba(201, 168, 76, 0.15)',
        'inner-gold': 'inset 0 0 0 1px rgba(245, 183, 0, 0.4)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      screens: {
        'xs': '380px',
      },
    },
  },
  plugins: [],
};

export default config;
