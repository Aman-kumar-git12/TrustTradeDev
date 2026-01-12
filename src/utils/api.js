import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://trusttrade-6d81.onrender.com/api' : 'http://localhost:5002/api'),
    withCredentials: true // Important for cookies
});

// Handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: redirect to login if not already there, but be careful of infinite loops
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
