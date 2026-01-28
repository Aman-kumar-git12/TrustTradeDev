import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    ArrowUpRight,
    User,
    Mail,
    Tag,
    History,
    CheckCircle,
    ChevronDown,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    Calendar,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import AdminUsersShimmer from '../../components/shimmers/AdminUsersShimmer';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import SupportDetailModal from '../../components/admin/SupportDetailModal';

const CustomDropdown = ({ options, value, onChange, icon: Icon, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm font-medium transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 min-w-[160px] justify-between text-gray-700 dark:text-gray-200"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span>{selectedLabel}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full mt-2 left-0 w-full min-w-[200px] z-50 origin-top-left"
                    >
                        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 bluish:from-[#1a243a] bluish:to-[#141b2d] border border-gray-100 dark:border-white/5 rounded-xl shadow-2xl p-1 overflow-hidden">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${value === opt.value
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {opt.label}
                                    {value === opt.value && <CheckCircle className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminSupport = () => {
    const { queryId } = useParams();
    const navigate = useNavigate();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [confirmingResolve, setConfirmingResolve] = useState(null);
    const [confirmingDelete, setConfirmingDelete] = useState(null);
    const [selectedQuery, setSelectedQuery] = useState(null);

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });

    const showSnackbar = (message, type = 'success') => {
        setSnackbar({ show: true, message, type });
        setTimeout(() => setSnackbar(prev => ({ ...prev, show: false })), 3000);
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    useEffect(() => {
        if (!loading && queries.length > 0 && queryId) {
            const query = queries.find(q => q._id === queryId);
            if (query) {
                setSelectedQuery(query);
            }
        } else if (!queryId) {
            setSelectedQuery(null);
        }
    }, [queryId, queries, loading]);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/support/admin/all');
            setQueries(data);
        } catch (error) {
            console.error('Error fetching queries:', error);
            showSnackbar("Failed to load support queries", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (queryId) => {
        try {
            const { data } = await api.put(`/support/admin/${queryId}`, {
                status: 'resolved'
            });
            setQueries(prev => prev.map(q => q._id === queryId ? data : q));
            showSnackbar("Query marked as resolved! ✅", "success");
            setConfirmingResolve(null);
        } catch (error) {
            showSnackbar("Failed to resolve query", "error");
        }
    };

    const handleDelete = async (queryId) => {
        try {
            await api.delete(`/support/admin/${queryId}`);
            setQueries(prev => prev.filter(q => q._id !== queryId));
            showSnackbar("Query deleted successfully! 🗑️", "success");
            setConfirmingDelete(null);
            if (selectedQuery && selectedQuery._id === queryId) {
                setSelectedQuery(null);
            }
        } catch (error) {
            showSnackbar("Failed to delete query", "error");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredQueries = queries
        .filter(q => {
            const matchesSearch =
                q.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filters.status === 'all' || q.status === filters.status;
            const matchesPriority = filters.priority === 'all' || q.priority === filters.priority;

            return matchesSearch && matchesStatus && matchesPriority;
        })
        .sort((a, b) => {
            const { sortBy, sortOrder } = filters;
            let comparison = 0;
            if (sortBy === 'createdAt') {
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'closed': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="flex-1 h-full p-8 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-400 uppercase tracking-tighter">Support Terminal</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Review and resolve user support queries</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative z-20 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find query..."
                            className="pl-11 pr-4 py-2.5 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-64 shadow-sm hover:shadow-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <CustomDropdown
                        label="All Status"
                        icon={Filter}
                        value={filters.status}
                        onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Resolved', value: 'resolved' },
                        ]}
                    />

                    <CustomDropdown
                        label="Sort By"
                        icon={ArrowUpDown}
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(val) => {
                            const [sortBy, sortOrder] = val.split('-');
                            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                        }}
                        options={[
                            { label: 'Newest First', value: 'createdAt-desc' },
                            { label: 'Oldest First', value: 'createdAt-asc' },
                        ]}
                    />
                </div>
            </header>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-[32px] border border-white/20 dark:border-white/5 shadow-xl overflow-hidden relative z-10">
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Query Detail</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">User Identity</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Date & Time</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Priority</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-0">
                                        <AdminUsersShimmer />
                                    </td>
                                </tr>
                            ) : filteredQueries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-400 font-medium">No queries match your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredQueries.map((query, idx) => (
                                    <motion.tr
                                        key={query._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        onClick={() => navigate(`/admin/support/${query._id}`)}
                                        className="group hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-4 max-w-md">
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {query.subject}
                                                </div>
                                                <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                                                    {query.message}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-105">
                                                    {query.user?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900 dark:text-white">{query.user?.fullName}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono italic">{query.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatDate(query.createdAt).split(',')[0]}</span>
                                                <span className="text-[10px] text-gray-400 font-mono">{formatDate(query.createdAt).split(',')[1]}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${query.priority === 'urgent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                                query.priority === 'high' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/20' :
                                                    'bg-gray-100 dark:bg-white/5 text-gray-500'
                                                }`}>
                                                {query.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(query.status)}`}>
                                                {query.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            {query.status !== 'resolved' ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmingResolve(query);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Resolve
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 text-emerald-500">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Settled</span>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Support Detail Modal */}
            <AnimatePresence>
                {selectedQuery && (
                    <SupportDetailModal
                        isOpen={!!selectedQuery}
                        onClose={() => navigate('/admin/support')}
                        query={selectedQuery}
                        onDelete={() => {
                            setConfirmingDelete(selectedQuery);
                            // We keep the detail modal open so the confirmation appears over it
                            // Or we can close it. Let's keep it open for context.
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmingResolve && (
                    <ConfirmationModal
                        isOpen={!!confirmingResolve}
                        onClose={() => setConfirmingResolve(null)}
                        onConfirm={() => handleResolve(confirmingResolve._id)}
                        title="Mark Query as Resolved?"
                        message={`Are you sure you want to mark "${confirmingResolve.subject}" as resolved? This will signal the user that their request has been settled.`}
                        confirmText="Yes, Resolve it"
                        isDestructive={false}
                    />
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {confirmingDelete && (
                    <ConfirmationModal
                        isOpen={!!confirmingDelete}
                        onClose={() => setConfirmingDelete(null)}
                        onConfirm={() => handleDelete(confirmingDelete._id)}
                        title="Delete Support Query?"
                        message={`Are you sure you want to delete this query from "${confirmingDelete.user?.fullName}"? This action cannot be undone.`}
                        confirmText="Yes, Delete it"
                        isDestructive={true}
                    />
                )}
            </AnimatePresence>

            {/* Snackbar */}
            <AnimatePresence>
                {snackbar.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${snackbar.type === 'success'
                            ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                            : 'bg-red-500/90 text-white border-red-400/50'
                            }`}
                    >
                        {snackbar.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span className="text-sm font-bold uppercase tracking-wider">{snackbar.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSupport;
