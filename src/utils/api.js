import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true // Important for cookies
});

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
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
