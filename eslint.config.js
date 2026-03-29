export default [
    {
        ignores: ['dist/**']
    },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                alert: 'readonly',
                clearInterval: 'readonly',
                clearTimeout: 'readonly',
                console: 'readonly',
                document: 'readonly',
                FormData: 'readonly',
                IntersectionObserver: 'readonly',
                localStorage: 'readonly',
                navigator: 'readonly',
                sessionStorage: 'readonly',
                setInterval: 'readonly',
                setTimeout: 'readonly',
                URLSearchParams: 'readonly',
                window: 'readonly'
            }
        },
        rules: {}
    }
];
