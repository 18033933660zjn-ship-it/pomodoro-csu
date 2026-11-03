/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tomato: {
          50: '#fff1f0',
          100: '#ffe4e1',
          200: '#ffccc7',
          300: '#ffa39e',
          400: '#ff7875',
          500: '#ff4d4f',
          600: '#f5222d',
          700: '#cf1322',
          800: '#a8071a',
          900: '#820014'
        },
        navy: {
          850: '#141c2e',
          900: '#0f172a',
          950: '#090d16'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 25px rgba(255, 77, 79, 0.25)',
      }
    },
  },
  plugins: [],
}
