import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Mail, MessageSquare, Clock, CheckCircle, AlertCircle, HelpCircle, Trash2 } from 'lucide-react';

const SupportDetailModal = ({ isOpen, onClose, query, onDelete }) => {
    if (!isOpen || !query) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'closed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'medium': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-[#111] bluish:bg-[#0f1623] w-full max-w-2xl rounded-[32px] shadow-2xl border border-gray-200 dark:border-white/10 relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support Request Details</h2>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {query._id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Status & Priority Badge Row */}
                    {/* Status & Priority Badge Row */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${getStatusColor(query.status)}`}>
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">{query.status}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${getPriorityColor(query.priority)}`}>
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">{query.priority} Priority</span>
                        </div>

                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-red-500/20 active:scale-95 group"
                                title="Delete Query"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        <div className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatDate(query.createdAt)}</span>
                        </div>
                    </div>

                    {/* User Details Box */}
                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> User Information
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {query.user?.fullName?.charAt(0) || '?'}
                            </div>
                            <div>
                                <div className="font-bold text-lg text-gray-900 dark:text-white">{query.user?.fullName || 'Unknown User'}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                                    <Mail className="w-3.5 h-3.5" />
                                    {query.user?.email || 'No Email'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Subject</h3>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-6">{query.subject}</p>

                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Message Body</h3>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {query.message}
                        </div>
                    </div>

                    {/* Footer / Timestamps */}
                    {query.resolvedAt && (
                        <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Resolved on {formatDate(query.resolvedAt)}</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default SupportDetailModal;
