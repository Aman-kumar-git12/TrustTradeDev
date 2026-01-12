import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
