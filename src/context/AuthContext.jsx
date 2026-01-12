import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

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
                const { data } = await axios.get('http://localhost:5002/api/auth/me'); // Ensure base URL is correct or configured elsewhere
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
        const { data } = await axios.post('http://localhost:5002/api/auth/login', { email, password });
        setUser(data);
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:5002/api/auth/logout');
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
