import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { user } = useAuth();
    // 'mode' is the preference: 'light', 'dark', or 'default'
    const [mode, setModeState] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('themeMode') || 'default';
        }
        return 'default';
    });

    // 'theme' is the actual applied class: 'light' or 'dark'
    const [theme, setTheme] = useState('light');

    // Resolve the actual theme based on mode and system preference
    // Resolve the actual theme based on mode and system preference
    useEffect(() => {
        const resolveTheme = () => {
            if (mode === 'default') {
                return 'bluish'; // System default is now Bluish
            }
            return mode;
        };

        const resolvedTheme = resolveTheme();
        setTheme(resolvedTheme);

        const root = window.document.documentElement;

        // Reset classes
        root.classList.remove('dark', 'bluish');

        if (resolvedTheme === 'dark') {
            root.classList.add('dark');
        } else if (resolvedTheme === 'bluish') {
            root.classList.add('bluish');
            // Bluish is technically a dark theme, so we might want some dark utilities to work?
            // User said "do not touch code of Dark".
            // If we want existing dark: utilities to work in bluish, we should add 'dark' too?
            // "apply every where in the code this theme"
            // If I add 'dark' class, then dark:bg-zinc-950 applies. 
            // If I want bluish background, I need bluish:bg-slate-900 to override zinc-950.
            // Tailwind classes order matters.
            // Let's treat 'bluish' as a distinct mode that also enables 'dark' utilities BUT
            // we will use the specific 'bluish' variant to override colors.
            root.classList.add('dark');
        }

    }, [mode]);

    // Sync with backend when user logs in or specific mode changes
    const setMode = async (newMode) => {
        setModeState(newMode);
        localStorage.setItem('themeMode', newMode);

        if (user) {
            try {
                await api.put('/auth/theme', { mode: newMode });
            } catch (error) {
                console.error('Failed to sync theme preference:', error);
            }
        }
    };

    // Initialize from user profile if available
    useEffect(() => {
        if (user?.mode) {
            setModeState(user.mode);
            localStorage.setItem('themeMode', user.mode);
        }
    }, [user]);

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
