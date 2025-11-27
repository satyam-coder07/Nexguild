/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    950: '#000000',      // Pure black background
                    900: '#050505',      // Sidebar/Header
                    850: '#0a0a0a',      // Hover states
                    800: '#121212',      // Card background
                    700: '#1e1e1e',      // Borders
                    600: '#2d2d2d',      // Inputs
                },
                brand: {
                    primary: '#FF6B4A',  // Coral Orange (from image)
                    secondary: '#FF8F75', // Lighter Coral
                    accent: '#FF4D29',    // Darker Coral
                },
                // Keeping semantic colors but adjusting for the dark theme
                success: '#10B981',
                error: '#EF4444',
                warning: '#F59E0B',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.5)',
                'glow': '0 0 15px rgba(255, 107, 74, 0.3)', // Orange glow
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
