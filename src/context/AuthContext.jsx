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
        let isMounted = true;
        const timeoutId = setTimeout(() => {
            if (isMounted) {
                console.warn("Auth initialization timed out after 5s - forcing ready state.");
                setLoading(false);
            }
        }, 5000);

        const checkLoggedIn = async () => {
            try {
                const { data } = await api.get('/auth/me');
                if (isMounted) setUser(data);
            } catch (error) {
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) {
                    clearTimeout(timeoutId);
                    setLoading(false);
                    sessionStorage.setItem('trusttrade_splash_seen', 'true');
                }
            }
        };
        checkLoggedIn();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
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
