import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable class-based dark mode
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f172a', // Deep Slate
                    light: '#334155',
                },
                accent: {
                    DEFAULT: '#f59e0b', // Warm Amber
                    hover: '#d97706',
                },
                bluish: {
                    bg: '#0a0f1d',      // Custom Blue-Black
                    card: '#1e293b',    // Slate 800
                    border: '#334155',  // Slate 700
                    text: '#f8fafc',    // Slate 50
                    muted: '#94a3b8'    // Slate 400
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            }
        },
    },
    plugins: [
        plugin(({ addVariant }) => {
            addVariant('bluish', 'html.bluish &');
        }),
    ],
}
