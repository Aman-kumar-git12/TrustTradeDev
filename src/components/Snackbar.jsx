import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Snackbar = ({ open, message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            // Dismiss on any user click/action
            const handleUserAction = () => onClose();
            // Delay adding listener to avoid immediate close from the trigger click
            const clickTimer = setTimeout(() => {
                window.addEventListener('click', handleUserAction);
            }, 100);

            return () => {
                clearTimeout(timer);
                clearTimeout(clickTimer);
                window.removeEventListener('click', handleUserAction);
            };
        }
    }, [open, duration, onClose]);

    const styles = {
        success: {
            bg: 'bg-emerald-50 dark:bg-white',
            border: 'border-emerald-200 dark:border-gray-200',
            text: 'text-emerald-800 dark:text-gray-900',
            icon: <CheckCircle size={20} className="text-emerald-500" />
        },
        error: {
            bg: 'bg-red-50 dark:bg-white',
            border: 'border-red-200 dark:border-gray-200',
            text: 'text-red-800 dark:text-gray-900',
            icon: <AlertCircle size={20} className="text-red-500" />
        },
        warning: {
            bg: 'bg-amber-50 dark:bg-white',
            border: 'border-amber-200 dark:border-gray-200',
            text: 'text-amber-800 dark:text-gray-900',
            icon: <AlertTriangle size={20} className="text-amber-500" />
        },
        info: {
            bg: 'bg-blue-50 dark:bg-white',
            border: 'border-blue-200 dark:border-gray-200',
            text: 'text-blue-800 dark:text-gray-900',
            icon: <Info size={20} className="text-blue-500" />
        },
        dark: {
            bg: 'bg-zinc-950 dark:bg-white',
            border: 'border-zinc-800 dark:border-gray-200',
            text: 'text-zinc-100 dark:text-gray-900',
            icon: <Info size={18} className="text-zinc-400 dark:text-gray-500" />,
            shadow: 'shadow-2xl shadow-black/50 ring-1 ring-white/10 dark:ring-black/5'
        }
    };

    const style = styles[type] || styles.info;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`flex items-center px-5 py-4 rounded-lg border shadow-xl max-w-sm w-full backdrop-blur-md ${style.bg} ${style.border} ${style.shadow || 'shadow-lg'}`}
                    >
                        <div className="flex-shrink-0 mr-3">
                            {style.icon}
                        </div>
                        <div className={`flex-1 text-sm font-medium ${style.text}`}>
                            {message}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering window click
                                onClose();
                            }}
                            className={`ml-4 flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity`}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Snackbar;
