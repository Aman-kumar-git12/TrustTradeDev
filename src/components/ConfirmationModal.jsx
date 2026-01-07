import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, confirmText, cancelText, isDangerous, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
                <div className="p-6">
                    <div className="flex items-start">
                        {isDangerous && (
                            <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-4">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-colors ${isDangerous
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
