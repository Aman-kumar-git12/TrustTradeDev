import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link, useLocation, useParams, Outlet, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag,
    Clock,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Building2,
    ShoppingBag,
    TrendingUp,
    ChevronDown,
    MapPin,
    ArrowRight,
    Trash2,
    Search,
    Filter as FilterIcon,
    BarChart2,
    ShieldCheck,
    Zap
} from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import Hover from '../components/Hover';
import { useUI } from '../context/UIContext';
import Filter from '../components/Filter';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon size={20} className="text-white" />
        </div>
    </div>
);

const InterestCard = ({ interest, isExpanded, onToggle, onDelete }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-100/80 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
            case 'rejected': return 'bg-rose-100/80 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
            case 'negotiating': return 'bg-blue-100/80 text-blue-900 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            default: return 'bg-amber-100/80 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800';
        }
    };

    return (
        <div className={`bg-white dark:bg-[#161616] rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded
            ? 'border-emerald-500 shadow-xl ring-1 ring-emerald-500/10'
            : 'border-gray-100 dark:border-zinc-800 hover:border-emerald-500/30 shadow-sm hover:shadow-md'
            }`}>
            <div
                className="p-5 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer"
                onClick={onToggle}
            >
                {/* Asset Image/Icon */}
                <div className="h-16 w-16 rounded-xl bg-gray-50 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-700">
                    {interest.asset?.images?.[0] ? (
                        <img src={interest.asset.images[0]} alt={interest.asset.title} className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="text-gray-400" size={24} />
                    )}
                </div>

                {/* Info Area */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                        <Tag size={10} />
                        <span>{interest.asset?.category || 'General'}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {interest.asset?.title}
                    </h4>
                    <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-zinc-500 mb-2">
                        <Building2 size={12} className="mr-1 text-emerald-500" />
                        <span>{interest.asset?.business?.businessName || 'Independent Seller'}</span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                        <span className="text-gray-900 dark:text-gray-200">${interest.asset?.price?.toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <MapPin size={14} className="mr-1" />
                        <span>{interest.asset?.location}</span>
                        <span className="mx-2">•</span>
                        <ShoppingBag size={14} className="mr-1 text-emerald-500" />
                        <span>Qty: {interest.quantity}</span>
                    </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                    {interest.salesStatus === 'sold' ? (
                        <span className="flex items-center px-3 py-1 text-[10px] font-extrabold rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                            <CheckCircle size={12} className="mr-1" />
                            Paid & Secure
                        </span>
                    ) : (
                        <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${getStatusColor(interest.status)}`}>
                            {interest.status}
                        </span>
                    )}
                    <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-180 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'text-gray-400'}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-5 pb-6 pt-2 border-t border-gray-50 dark:border-zinc-800">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Message Sent */}
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Your Message</h5>
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-300 italic border border-gray-100 dark:border-zinc-700 h-32 overflow-y-auto">
                                        "{interest.message || 'No message provided.'}"
                                    </div>

                                    {/* Sold Details for Analysis */}
                                    {(interest.status === 'accepted' || interest.salesStatus === 'sold') && (
                                        <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                            <h6 className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Deal Summary</h6>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase">Unit Price</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">${(interest.soldPrice || interest.asset?.price || 0).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase">Qty</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">{interest.soldQuantity || interest.quantity}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase">Total</p>
                                                    <p className="font-bold text-emerald-600 dark:text-emerald-400">${(interest.soldTotalAmount || (interest.soldPrice * interest.soldQuantity) || 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Next Steps / Seller Contact */}
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Seller Details</h5>
                                    {interest.status === 'accepted' || interest.salesStatus === 'sold' ? (
                                        <div className="space-y-4">
                                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/50 mb-2">
                                                🎉 Your request has been accepted! Contact the number below, otherwise our team will contact you in a while.
                                            </div>

                                            <div className="flex items-center p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm">
                                                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white mr-4 shadow-md font-bold text-lg">
                                                    {interest.seller?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{interest.seller?.fullName}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{interest.seller?.companyName || 'Seller'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <a href={`mailto:${interest.seller?.email}`} className="flex items-center p-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                                                    <Mail size={16} className="mr-3 text-emerald-500" />
                                                    {interest.seller?.email}
                                                </a>
                                                {interest.seller?.phone && (
                                                    <a href={`tel:${interest.seller?.phone}`} className="flex items-center p-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                                                        <Phone size={16} className="mr-3 text-emerald-500" />
                                                        {interest.seller.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-800 border-dashed p-6 text-center">
                                            <Clock className="text-gray-400 mb-2" size={24} />
                                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                                Contact details will be visible once the seller accepts your request.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Deletion/Retraction Option */}
                                {['pending', 'negotiating'].includes(interest.status) && (
                                    <div className="md:col-span-2 pt-4 border-t border-gray-50 dark:border-zinc-800 flex justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(interest._id);
                                            }}
                                            className="flex items-center text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                        >
                                            <Trash2 size={14} className="mr-2" />
                                            Retract Interest
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const OrderCard = ({ order, isExpanded, onToggle }) => {
    return (
        <div className={`bg-white dark:bg-[#161616] rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded
            ? 'border-emerald-500 shadow-xl ring-1 ring-emerald-500/10'
            : 'border-gray-100 dark:border-zinc-800 hover:border-emerald-500/30 shadow-sm hover:shadow-md'
            }`}>
            <div
                className="p-5 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer"
                onClick={onToggle}
            >
                {/* Asset Image/Icon */}
                <div className="h-16 w-16 rounded-xl bg-gray-50 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-700">
                    {order.asset?.images?.[0] ? (
                        <img src={order.asset.images[0]} alt={order.asset?.title} className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="text-gray-400" size={24} />
                    )}
                </div>

                {/* Info Area */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                        <CheckCircle size={10} />
                        <span>Completed Order</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {order.asset?.title}
                    </h4>
                    <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-zinc-500 mb-2">
                        <Building2 size={12} className="mr-1 text-emerald-500" />
                        <span>{order.asset?.business?.businessName || 'Independent Seller'}</span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                        <span className="text-gray-900 dark:text-white font-bold">${order.price?.toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <ShoppingBag size={14} className="mr-1 text-emerald-500" />
                        <span>Qty: {order.quantity}</span>
                        <span className="mx-2">•</span>
                        <Clock size={14} className="mr-1" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                    <span className="flex items-center px-3 py-1 text-[10px] font-extrabold rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                        <CheckCircle size={12} className="mr-1" />
                        Paid & Secured
                    </span>
                    <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-180 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'text-gray-400'}`}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-5 pb-6 pt-4 border-t border-gray-50 dark:border-zinc-800">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Transaction Summary</h5>
                                    <div className="p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-gray-100 dark:border-zinc-800">
                                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 dark:border-zinc-700">
                                            <span className="text-xs text-gray-400 font-mono">ID: #{order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">PAID</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-500">Unit Price</span>
                                            <span className="text-sm font-bold dark:text-white">${order.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-500">Quantity Sold</span>
                                            <span className="text-sm font-bold dark:text-white">{order.quantity}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase">Total Paid</span>
                                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">${(order.totalAmount || (order.price * order.quantity)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Seller Contact</h5>
                                    <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                                                {order.seller?.fullName?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold dark:text-white">{order.seller?.fullName}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <a href={`mailto:${order.seller?.email}`} className="flex items-center text-xs text-emerald-500 font-bold hover:underline mb-2">
                                                <Mail size={12} className="mr-2" />
                                                {order.seller?.email}
                                            </a>
                                            {order.seller?.phone && (
                                                <a href={`tel:${order.seller?.phone}`} className="flex items-center text-xs text-emerald-500 font-bold hover:underline">
                                                    <Phone size={12} className="mr-2" />
                                                    {order.seller.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BuyerDashboard = () => {
    const { userId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [interests, setInterests] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('interests'); // 'interests' | 'orders'
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [activityCounts, setActivityCounts] = useState({ interests: 0, orders: 0 });

    useEffect(() => {
        const fetchActivityCounts = async () => {
            try {
                const { data } = await api.get('/auth/activity-counts');
                setActivityCounts(data);
            } catch (error) {
                console.error("Failed to fetch activity counts", error);
            }
        };
        fetchActivityCounts();
    }, []);

    // Derived state from URL query param
    const isFilterOpen = searchParams.get('filter') === 'true';

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        status: ''
    });
    const { showSnackbar, confirm } = useUI();

    // The backend handles the filtering.
    const displayData = activeTab === 'interests' ? interests : orders;

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: '',
            status: ''
        };
        setFilters(clearedFilters);
        fetchAllData(activeTab, clearedFilters);
    };

    useEffect(() => {
        fetchAllData(activeTab, filters);
    }, [activeTab]);

    useEffect(() => {
        // No-op: handled by searchParams
    }, [searchParams]);

    useEffect(() => {
        if (showStats && !dashboardStats) {
            const fetchStats = async () => {
                try {
                    const { data } = await api.get('/analytics/buyer/overview/all');
                    setDashboardStats(data);
                } catch (error) {
                    console.error("Failed to fetch dashboard stats", error);
                }
            };
            fetchStats();
        }
    }, [showStats]);

    const fetchAllData = async (tab, appliedFilters = {}) => {
        setLoading(true);
        try {
            // Convert filters to query string
            const params = new URLSearchParams();
            Object.entries(appliedFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            if (tab === 'interests') {
                const res = await api.get(`/interests/buyer?${params.toString()}`);
                setInterests(res.data);
            } else {
                const res = await api.get(`/sales/buyer?${params.toString()}`);
                setOrders(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            showSnackbar("Failed to refresh data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInterest = async (id) => {
        const confirmed = await confirm({
            title: 'Retract Interest',
            message: 'Are you sure you want to retract your interest? This action cannot be undone.',
            confirmText: 'Retract Interest',
            isDangerous: true
        });

        if (!confirmed) return;

        try {
            await api.delete(`/interests/${id}`);
            showSnackbar('Interest retracted successfully', 'success');
            setInterests(prev => prev.filter(i => i._id !== id));
            if (expandedId === id) setExpandedId(null);
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to retract interest', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#050505] transition-colors duration-300 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header & Tabs Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Buyer Command</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">Track your interests and finalized acquisitions.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                    {/* Navigation Hub: Interests, Orders, Intelligence Grouped */}
                    <div className="flex p-1.5 bg-gray-100 dark:bg-zinc-900 rounded-[1.2rem] border border-gray-200 dark:border-zinc-800/50 items-center gap-1">
                        <button
                            onClick={() => { setActiveTab('interests'); setExpandedId(null); }}
                            className={`px-5 py-2 rounded-[0.9rem] text-sm font-bold transition-all flex items-center ${activeTab === 'interests'
                                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <Tag size={16} className="mr-2" />
                            My Interests
                            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-emerald-500/10 rounded-md">
                                {activityCounts.interests}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('orders'); setExpandedId(null); }}
                            className={`px-5 py-2 rounded-[0.9rem] text-sm font-bold transition-all flex items-center ${activeTab === 'orders'
                                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <ShoppingBag size={16} className="mr-2" />
                            My Orders
                            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-emerald-500/10 rounded-md">
                                {activityCounts.orders}
                            </span>
                        </button>

                        <div className="w-px h-5 bg-gray-200 dark:bg-zinc-800 mx-1 md:block hidden" />

                        <Hover text="Intelligence Hub">
                            <button
                                onClick={() => navigate(`/dashboard/buyer/${userId}/insights/1m`)}
                                className={`flex items-center px-5 py-2.5 rounded-[0.9rem] font-bold text-sm transition-all shadow-sm group ${location.pathname.includes('/insights')
                                    ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
                            >
                                <Zap size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                                Intelligence Hub
                            </button>
                        </Hover>
                    </div>

                    {/* Right Side: Actions Group */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className={`flex items-center px-4 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md ${showStats ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500'}`}
                        >
                            <TrendingUp size={18} className={`mr-2 transition-transform ${showStats ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            {showStats ? 'Hide Insights' : 'View Insights'}
                        </button>

                        <button
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                if (isFilterOpen) {
                                    newParams.delete('filter');
                                } else {
                                    newParams.set('filter', 'true');
                                }
                                setSearchParams(newParams);
                            }}
                            className={`flex items-center px-5 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md group ${isFilterOpen ? 'bg-gray-900 dark:bg-emerald-600 text-white border-gray-900 dark:border-emerald-600' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500'}`}
                        >
                            <FilterIcon size={18} className={`mr-2 transition-transform group-hover:scale-110 ${isFilterOpen ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {showStats && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <StatCard
                                    title="Total Requests"
                                    value={dashboardStats?.kpi?.totalInterests || 0}
                                    icon={ShoppingBag}
                                    colorClass="bg-emerald-500"
                                />
                                <StatCard
                                    title="Accepted"
                                    value={dashboardStats?.kpi?.acceptedInterests || 0}
                                    icon={CheckCircle}
                                    colorClass="bg-blue-500"
                                />
                                <StatCard
                                    title="Total Value Paid"
                                    value={`$${(dashboardStats?.kpi?.totalSpent || 0).toLocaleString()}`}
                                    icon={TrendingUp}
                                    colorClass="bg-indigo-500"
                                />
                                <StatCard
                                    title="Trust Score"
                                    value={dashboardStats?.trustScore?.totalScore || 0}
                                    icon={ShieldCheck}
                                    colorClass="bg-amber-500"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
                    {isFilterOpen && (
                        <div className="w-full lg:w-80 flex-shrink-0 animate-fade-in">
                            <Filter
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClear={handleClearFilters}
                                onApply={() => fetchAllData(activeTab, filters)}
                                onClose={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete('filter');
                                    setSearchParams(newParams);
                                }}
                            />
                        </div>
                    )}

                    <div className="flex-grow space-y-4 relative min-h-[400px]">
                        {loading ? (
                            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-50 rounded-3xl flex items-start justify-center pt-20 backdrop-blur-[1px] transition-all duration-300">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                            </div>
                        ) : displayData.length === 0 ? (
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 p-20 text-center shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? <Search size={40} /> : <ShoppingBag size={40} />}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? 'No matches found' : activeTab === 'interests' ? 'No interests yet' : 'No orders yet'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition)
                                        ? 'Try adjusting your search query or filters to find what you are looking for.'
                                        : activeTab === 'interests'
                                            ? 'Explore the marketplace and reach out to sellers to start your acquisition journey.'
                                            : 'Once your interests are accepted and finalized by sellers, they will appear here as orders.'}
                                </p>
                                {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? (
                                    <button
                                        onClick={handleClearFilters}
                                        className="inline-flex items-center px-8 py-3 bg-zinc-800 hover:bg-zinc-900 text-white rounded-xl font-bold transition-all"
                                    >
                                        Clear Filters
                                    </button>
                                ) : activeTab === 'interests' && (
                                    <a
                                        href="/marketplace"
                                        className="inline-flex items-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-1"
                                    >
                                        Browse Marketplace
                                        <ArrowRight className="ml-2" size={18} />
                                    </a>
                                )}
                            </div>
                        ) : (
                            displayData.map((item) => (
                                activeTab === 'interests' ? (
                                    <InterestCard
                                        key={item._id}
                                        interest={item}
                                        isExpanded={expandedId === item._id}
                                        onToggle={() => setExpandedId(expandedId === item._id ? null : item._id)}
                                        onDelete={handleDeleteInterest}
                                    />
                                ) : (
                                    <OrderCard
                                        key={item._id}
                                        order={item}
                                        isExpanded={expandedId === item._id}
                                        onToggle={() => setExpandedId(expandedId === item._id ? null : item._id)}
                                    />
                                )
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
