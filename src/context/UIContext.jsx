import { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '../components/Snackbar';
import ConfirmationModal from '../components/ConfirmationModal';

const UIContext = createContext();

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};

export const UIProvider = ({ children }) => {
    // Snackbar State
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        type: 'info' // 'success', 'error', 'info', 'warning'
    });

    // Confirmation Modal State
    const [confirmation, setConfirmation] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isDangerous: false
    });

    // Show Snackbar
    const showSnackbar = useCallback((message, type = 'info') => {
        setSnackbar({ open: true, message, type });
        // Auto-close handled in component or via timeout here if needed, 
        // but typically better in component to reset state on close.
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    // Request Confirmation
    const confirm = useCallback(({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
        return new Promise((resolve) => {
            setConfirmation({
                open: true,
                title,
                message,
                confirmText,
                cancelText,
                isDangerous,
                onConfirm: async () => {
                    setConfirmation(prev => ({ ...prev, open: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmation(prev => ({ ...prev, open: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <UIContext.Provider value={{ showSnackbar, confirm }}>
            {children}
            <Snackbar
                open={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                onClose={hideSnackbar}
            />
            {confirmation.open && (
                <ConfirmationModal
                    isOpen={confirmation.open}
                    title={confirmation.title}
                    message={confirmation.message}
                    confirmText={confirmation.confirmText}
                    cancelText={confirmation.cancelText}
                    isDangerous={confirmation.isDangerous}
                    onConfirm={confirmation.onConfirm}
                    onCancel={confirmation.onCancel}
                />
            )}
        </UIContext.Provider>
    );
};
