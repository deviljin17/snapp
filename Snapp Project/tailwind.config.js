/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: [
          '"Playfair Display"',
          'ui-serif',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif'
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      fontSize: {
        '4xl': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        '8xl': ['5.25rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        '9xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      letterSpacing: {
        'tighter': '-0.04em',
        'tight': '-0.02em',
        'normal': '0',
        'wide': '0.01em',
      },
      fontFeatureSettings: {
        'ss01': '"ss01"',
        'liga': '"liga" 1',
        'kern': '"kern" 1',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse": "softPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "floatUpDown 6s ease-in-out infinite",
        "icon-bounce": "iconBounce 0.5s cubic-bezier(0.36, 0, 0.66, -0.56)",
        "soft-float": "softFloat 4s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".8", transform: "scale(0.98)" }
        },
        softFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0)" },
          "50%": { transform: "translateY(-5px) rotate(2deg)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true
  }
};