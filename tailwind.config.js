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
            },
            animation: {
                blob: "blob 7s infinite",
                "fade-in-up": "fadeInUp 0.8s ease-out forwards",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
                fadeInUp: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(10px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
            },
        },
    },
    plugins: [
        plugin(({ addVariant }) => {
            addVariant('bluish', 'html.bluish &');
        }),
    ],
}
