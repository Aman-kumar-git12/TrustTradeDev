import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

import SplashScreen from '../components/SplashScreen';
import AppLoader from '../components/shimmers/AppLoader';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            // Check if user has seen splash in this session
            const hasSeenSplash = sessionStorage.getItem('trusttrade_splash_seen');

            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                if (!hasSeenSplash) {
                    // First time: Show splash for at least 1.5s for branding
                    setTimeout(() => {
                        setLoading(false);
                        sessionStorage.setItem('trusttrade_splash_seen', 'true');
                    }, 1500);
                } else {
                    // Subsequent loads: Quick load (no artificial delay)
                    setLoading(false);
                }
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.token) localStorage.setItem('trusttrade_token', data.token);
        setUser(data);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('trusttrade_token');
            setUser(null);
        } catch (error) {
            console.error(error);
            localStorage.removeItem('trusttrade_token'); // Ensure cleanup even on error
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        setAuth: setUser,
        isAuthenticated: !!user
    };

    // Determine what to show while loading
    // If loading && !hasSeenSplash -> SplashScreen
    // If loading && hasSeenSplash -> AppLoader (Shimmer)

    if (loading) {
        const hasSeenSplash = sessionStorage.getItem('trusttrade_splash_seen');
        if (!hasSeenSplash) return <SplashScreen />;
        return <AppLoader />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
