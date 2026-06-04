import axios from 'axios';

const defaultApiBaseUrl =
    typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:5002/api`
        : 'http://localhost:5002/api';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || defaultApiBaseUrl}`,
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
        const isNetworkOffline =
            typeof navigator !== 'undefined' && navigator.onLine === false;
        const errorCode = error?.code || '';
        const errorMessage = String(error?.message || '').toLowerCase();
        const isLikelyOfflineError =
            isNetworkOffline ||
            errorCode === 'ERR_NETWORK' ||
            errorCode === 'ECONNABORTED' ||
            errorMessage.includes('network error') ||
            errorMessage.includes('failed to fetch');

        // 1. Handle Cold Start (No Response)
        if (!response && config && !config._isRetry && !isLikelyOfflineError) {
            config._isRetry = true;
            console.log("Backend cold start detected. Retrying in 3s...");
            await new Promise(resolve => setTimeout(resolve, 3000));
            return api(config);
        }

        // 2. Handle 401 Unauthorized
        if (response && response.status === 401) {
            const requestUrl = String(config?.url || '');
            const isAuthCheck = requestUrl.includes('/auth/me');
            const isPaymentFlow = requestUrl.includes('/payment/') || requestUrl.includes('/agent/');

            // Don't redirect if the error is from /auth/me (AuthContext handles this)
            // or from payment/agent actions where we want the caller to surface the error.
            if (isAuthCheck || isPaymentFlow) {
                return Promise.reject(error);
            }

            // Don't redirect if we are on login, register, or landing pages
            if (
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/' &&
                window.location.pathname !== '/register'
            ) {
                localStorage.removeItem('trusttrade_token'); // Clear stale token to fix auth loop
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
