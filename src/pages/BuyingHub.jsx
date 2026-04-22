import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation, useSearchParams, Outlet, NavLink, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag,
    Clock,
    CheckCircle,
    Building2,
    ShoppingBag,
    TrendingUp,
    Filter as FilterIcon,
    ShieldCheck,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import Filter from '../components/Filter';
import BuyerDashboardShimmer from '../components/shimmers/BuyerDashboardShimmer';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800 bluish:to-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 bluish:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white bluish:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon size={20} className="text-white" />
        </div>
    </div>
);

const BuyingHub = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState(false);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [activityCounts, setActivityCounts] = useState({ interests: 0, orders: 0 });
    const { showSnackbar } = useUI();

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        status: ''
    });

    const isFilterOpen = searchParams.get('filter') === 'true';
    const isOrdersTab = location.pathname.includes('/orders');

    useEffect(() => {
        const fetchActivityCounts = async () => {
            try {
                const { data } = await api.get('/auth/activity-counts?scope=buying');
                setActivityCounts(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch activity counts", error);
                setLoading(false);
            }
        };
        fetchActivityCounts();
    }, [location.pathname]);

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

    const handleClearFilters = () => {
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: '',
            status: ''
        });
    };

    const toggleFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        if (isFilterOpen) {
            newParams.delete('filter');
        } else {
            newParams.set('filter', 'true');
        }
        setSearchParams(newParams);
    };

    if (loading) return <BuyerDashboardShimmer />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#0a0f1d] selection:bg-blue-500/30 bluish:selection:bg-blue-500/30 overflow-hidden relative pb-20">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-5 dark:opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/90 to-gray-50 dark:from-black dark:via-black/90 dark:to-black bluish:from-[#0a0f1d] bluish:via-[#0a0f1d]/90 bluish:to-[#0a0f1d]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white bluish:text-white tracking-tight mb-2 bluish:drop-shadow-lg">My Activity</h1>
                        <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 font-semibold">Track your interests and finalized acquisitions across TrustTrade.</p>
                    </div>

                    {user?.role === 'seller' && (
                        <Link 
                            to="/dashboard/seller/select"
                            className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group"
                        >
                            <Building2 className="mr-2 group-hover:rotate-12 transition-transform" size={18} />
                            SELLER HUB
                        </Link>
                    )}
                </div>

                {/* Sub-Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                    {/* Modern Tab Pill Navigation */}
                    <div className="bg-gray-100 dark:bg-zinc-900 bluish:bg-[#1e293b]/50 p-1.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bluish:border-white/5 flex gap-1 self-center lg:self-start relative no-scrollbar overflow-x-auto min-w-max">
                        {[
                            { path: 'orders', icon: ShoppingBag, label: 'My Orders', count: activityCounts.orders },
                            { path: 'interest', icon: Tag, label: 'My Interests', count: activityCounts.interests },
                            { path: 'intelligence', icon: TrendingUp, label: 'Intelligence' }
                        ].map((tab) => {
                            const isActive = location.pathname.includes(tab.path);
                            return (
                                <NavLink
                                    key={tab.path}
                                    to={tab.path}
                                    className="relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center group"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="buyer-nav-pill"
                                            className="absolute inset-0 bg-white dark:bg-zinc-800 bluish:bg-blue-500/20 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 bluish:border-blue-500/20"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className={`relative flex items-center z-10 whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-blue-600 dark:text-emerald-400 bluish:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
                                        <tab.icon size={16} className={`mr-2 transition-transform group-hover:scale-110`} />
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md ${isActive ? 'bg-blue-100 dark:bg-emerald-900/30' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className={`flex-1 lg:flex-none flex items-center justify-center px-5 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md ${showStats ? 'bg-blue-50 dark:bg-emerald-900/20 text-blue-700 dark:text-emerald-400 border-blue-200 dark:border-emerald-800 bluish:bg-blue-50 bluish:dark:bg-[#1e293b] bluish:text-blue-400 bluish:border-blue-500/30' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500'}`}
                        >
                            <TrendingUp size={18} className={`mr-2 transition-transform ${showStats ? 'text-blue-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            {showStats ? 'Hide Insights' : 'View Insights'}
                        </button>

                        <button
                            onClick={toggleFilter}
                            className={`flex items-center px-6 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md group ${isFilterOpen ? 'bg-gray-900 dark:bg-emerald-600 text-white border-gray-900 dark:border-emerald-600' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500'}`}
                        >
                            <FilterIcon size={18} className={`mr-2 transition-transform group-hover:scale-110 ${isFilterOpen ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                </div>

                {/* Stats Section with Animation */}
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
                                    colorClass="bg-blue-500 dark:bg-emerald-500"
                                />
                                <StatCard
                                    title="Accepted"
                                    value={dashboardStats?.kpi?.acceptedInterests || 0}
                                    icon={CheckCircle}
                                    colorClass="bg-blue-500 dark:bg-emerald-500"
                                />
                                <StatCard
                                    title="Total Value Paid"
                                    value={`₹${(dashboardStats?.kpi?.totalSpent || 0).toLocaleString()}`}
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

                {/* Main Content Area with Routing & Filter Sidebar */}
                <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
                    {isFilterOpen && (
                        <div className="w-full lg:w-80 flex-shrink-0 animate-fade-in">
                            <Filter
                                filters={filters}
                                onFilterChange={setFilters}
                                onClear={handleClearFilters}
                                onApply={() => {}} // Now handled by child components responding to state changes
                                accentColor="blue"
                                hideStatus={isOrdersTab}
                                onClose={toggleFilter}
                            />
                        </div>
                    )}
                    
                    <div className="flex-grow w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                                <Outlet context={{ userId, filters, isFilterOpen, handleClearFilters }} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyingHub;
