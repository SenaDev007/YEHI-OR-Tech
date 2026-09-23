import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // PALETTE YEHI OR TECH (CONSERVÉE) — dark + gold + blue
        // ============================================================
        // Fonds — neutres premium
        "noir-profond": "#080A0F",
        "noir-2": "#0D1117",
        "noir-3": "#141921",
        // Bleus — extraits du logo
        "bleu-nuit": "#071A2F",
        "bleu-tech": "#0B3D91",
        "bleu-electrique": "#1464F4",
        "bleu-medium": "#1A2744",
        // Or — accent principal de marque
        "or": {
          DEFAULT: "#F5B700",
          light: "#FFD166",
          pale: "#FFF3C4",
          vivid: "#FFC700",
          ombre: "#C88000",
        },
        // Textes
        "blanc-creme": "#F8F5EE",
        "gris-light": "#C5C8D0",
        "gris": "#8A8F9E",
        "gris-dark": "#4B5563",
        // Statuts
        "success": "#4ADE80",
        "warning": "#FBBF24",
        "danger": "#F87171",
        "whatsapp": "#25D366",
      },
      fontFamily: {
        // Polices Win Agro appliquées à YEHI OR Tech
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-1': ['clamp(2.75rem, 6vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2.25rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-3': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '28px',
      },
      backgroundImage: {
        'grid-gold': 'linear-gradient(rgba(245, 183, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 183, 0, 0.04) 1px, transparent 1px)',
        'halo-or': 'radial-gradient(circle at center, rgba(245, 183, 0, 0.10) 0%, transparent 70%)',
        'halo-bleu': 'radial-gradient(circle at center, rgba(20, 100, 244, 0.08) 0%, transparent 70%)',
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
      animation: {
        'rotate-slow': 'subtle-spin 20s linear infinite',
        'pulse-whatsapp': 'pulse-whatsapp 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s linear infinite',
        'marquee': 'marquee 180s linear infinite',
        'marquee-left': 'marquee-left 65s linear infinite',
        'marquee-right': 'marquee-right 65s linear infinite',
        'marquee-badge': 'marquee 16s linear infinite',
        'fade-in': 'fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
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
        'pulse-slow': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(245, 183, 0, 0.7)',
          },
          '50%': {
            transform: 'scale(1.08)',
            boxShadow: '0 0 0 12px rgba(245, 183, 0, 0)',
          },
        },
        'subtle-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '100%': { transform: 'translateX(200%) skewX(-20deg)' },
        },
        'rotate-conic-light': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.3333%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-33.3333%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '380px',
      },
    },
  },
  plugins: [],
};

export default config;
