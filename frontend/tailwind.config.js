/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3498DB',
          hover: '#2980B9',
          light: '#EBF5FB',
        },
        title: '#2C3E50',
        body: '#333333',
        muted: '#6B7280',
        border: '#E5E7EB',
        page: '#F8FAFC',
        surface: '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        sidebar: '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}
