import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true // Important for cookies
});

// Attach Bearer Token (Fallback for Cookies)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('trusttrade_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 globally & Retry for Cold Starts
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // 1. Handle Cold Start (No Response)
        if (!response && config && !config._isRetry) {
            config._isRetry = true;
            console.log("Backend cold start detected. Retrying in 3s...");
            await new Promise(resolve => setTimeout(resolve, 3000));
            return api(config);
        }

        // 2. Handle 401 Unauthorized
        if (response && response.status === 401) {
            // Don't redirect if the error is from /auth/me (AuthContext handles this)
            if (config.url.includes('/auth/me')) {
                return Promise.reject(error);
            }

            // Don't redirect if we are on login, register, or landing pages
            if (
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/' &&
                window.location.pathname !== '/register'
            ) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
