import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Snackbar = ({ open, message, type = 'info', onClose }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto-dismiss after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    const styles = {
        success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: <CheckCircle size={20} className="text-emerald-500" /> },
        error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: <AlertCircle size={20} className="text-red-500" /> },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: <AlertTriangle size={20} className="text-amber-500" /> },
        info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: <Info size={20} className="text-blue-500" /> }
    };

    const style = styles[type] || styles.info;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
            <div className={`flex items-center p-4 rounded-xl border shadow-lg max-w-sm w-full ${style.bg} ${style.border}`}>
                <div className="flex-shrink-0 mr-3">
                    {style.icon}
                </div>
                <div className={`flex-1 text-sm font-medium ${style.text}`}>
                    {message}
                </div>
                <button
                    onClick={onClose}
                    className={`ml-3 flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity`}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Snackbar;
