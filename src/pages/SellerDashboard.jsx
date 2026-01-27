import { NavLink, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Filter as FilterIcon, ArrowLeft, TrendingUp, Tag, ShoppingBag, BarChart2, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Hover from '../components/Hover';
import SellerDashboardShimmer from '../components/shimmers/SellerDashboardShimmer';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 bluish:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white bluish:text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon size={20} className="text-white" />
        </div>
    </div>
);

const SellerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [businesses, setBusinesses] = useState([]);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [leadsCount, setLeadsCount] = useState(0);
    const [listingsCount, setListingsCount] = useState(0);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setShowStats(false);
    }, [location.pathname]);

    useEffect(() => {
        const fetchData = async () => {
            if (!businessId) return;
            setLoading(true);
            try {
                // Fetch all data in parallel for speed and UI consistency
                const [bizRes, leadsRes, listingsRes, statsRes] = await Promise.all([
                    api.get('/businesses').catch(err => { console.error("Biz fetch error", err); return { data: [] }; }),
                    api.get(`/dashboard/business/${businessId}/leads`).catch(err => ({ data: [] })),
                    api.get(`/dashboard/business/${businessId}/assets`).catch(err => ({ data: [] })),
                    api.get(`/analytics/${businessId}/overview/all`).catch(err => {
                        console.error("Stats fetch error", err);
                        return { data: null };
                    })
                ]);

                setBusinesses(bizRes.data);
                setLeadsCount(leadsRes.data.length);
                setListingsCount(listingsRes.data.length);
                setDashboardStats(statsRes.data);

                const found = bizRes.data.find(b => b._id === businessId);
                if (found) {
                    setCurrentBusiness(found);
                    localStorage.setItem('lastBusinessId', found._id);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [businessId]);

    const handleBusinessSwitch = (newId) => {
        navigate(`/dashboard/seller/${newId}/leads`);
        setIsDropdownOpen(false);
    };

    const showFilterButton = location.pathname.includes('/leads') || location.pathname.includes('/listings');
    const isFilterOpen = searchParams.get('filter') === 'true';

    const toggleFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        if (isFilterOpen) {
            newParams.delete('filter');
        } else {
            newParams.set('filter', 'true');
        }
        setSearchParams(newParams);
    };

    if (loading) return <SellerDashboardShimmer />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#0a0f1d] transition-colors duration-300 pb-20 relative overflow-hidden">
            {/* Dynamic Background Elements - Bluish Theme Only */}
            {/* Page Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-5 dark:opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/90 to-gray-50 dark:from-black dark:via-black/90 dark:to-black bluish:from-[#0a0f1d] bluish:via-[#0a0f1d]/90 bluish:to-[#0a0f1d]"></div>
            </div>
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>
            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {!location.pathname.includes('/analytics/product/') && (
                    <>
                        {/* Header & Business Switcher Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white bluish:text-white tracking-tight mb-2 bluish:drop-shadow-lg">Seller Command</h1>
                                <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 font-semibold text-sm md:text-base">Manage your businesses, track leads, and optimize your listings.</p>
                            </div>

                            <div className="relative flex justify-center md:block">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 p-2 pr-4 bg-white dark:bg-zinc-900 bluish:bg-[#1e293b]/80 bluish:backdrop-blur-md rounded-2xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 shadow-sm hover:shadow-md transition-all group w-full md:w-auto"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 dark:bg-emerald-500/10 flex items-center justify-center text-blue-600 dark:text-emerald-400 font-bold text-lg group-hover:bg-blue-500 group-hover:dark:bg-emerald-500 group-hover:text-white transition-all">
                                        {currentBusiness?.businessName?.charAt(0) || 'B'}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">Active Business</p>
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white bluish:text-white flex items-center gap-2">
                                            {currentBusiness ? currentBusiness.businessName : 'Loading...'}
                                            <svg
                                                className={`w-4 h-4 text-gray-400 dark:text-gray-500 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </h3>
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-zinc-900 bluish:bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 z-50 animate-fade-in divide-y divide-gray-100 dark:divide-zinc-800 bluish:divide-white/5 overflow-hidden">
                                        <div className="p-2">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest px-3 py-2">Switch Business</p>
                                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                {businesses.map(b => (
                                                    <button
                                                        key={b._id}
                                                        onClick={() => handleBusinessSwitch(b._id)}
                                                        className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${b._id === businessId ? 'bg-blue-50 dark:bg-emerald-900/20 bluish:bg-blue-500/20 text-blue-700 dark:text-emerald-400 bluish:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-zinc-800 bluish:hover:bg-white/5 text-gray-700 dark:text-gray-200 bluish:text-gray-300'}`}
                                                    >
                                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${b._id === businessId ? 'bg-blue-500 dark:bg-emerald-500 text-white shadow-lg shadow-blue-500/20 dark:shadow-emerald-500/20' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'}`}>
                                                            {b.businessName.charAt(0)}
                                                        </div>
                                                        <span className="font-bold truncate">{b.businessName}</span>
                                                        {b._id === businessId && <span className="ml-auto text-blue-600 dark:text-emerald-400">✓</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-zinc-800/30">
                                            <button
                                                onClick={() => navigate('/my-businesses')}
                                                className="w-full py-2 text-xs font-black text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-widest"
                                            >
                                                Manage All Businesses
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Tabs (Pill Style) & Actions */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                            <div className="w-full lg:w-fit overflow-x-auto custom-scrollbar-hide flex p-1 bg-gray-100 dark:bg-zinc-900 bluish:bg-[#1e293b]/50 rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/5 relative no-scrollbar">
                                <div className="flex min-w-max">
                                    {[
                                        { path: 'leads', icon: Tag, label: 'Incoming Leads', count: leadsCount },
                                        { path: 'listings', icon: ShoppingBag, label: 'My Listings', count: listingsCount },
                                        { path: 'analytics', icon: BarChart2, label: 'Overview' }
                                    ].map((tab) => {
                                        const isActive = location.pathname.includes(tab.path);
                                        return (
                                            <NavLink
                                                key={tab.path}
                                                to={tab.path}
                                                className="relative px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center z-10"
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="seller-tab-pill"
                                                        className="absolute inset-0 bg-white dark:bg-zinc-800 bluish:bg-blue-500/20 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 bluish:border-blue-500/20"
                                                        initial={false}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <span className={`relative flex items-center z-20 whitespace-nowrap ${isActive ? 'text-blue-600 dark:text-emerald-400 bluish:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                                                    <tab.icon size={16} className="mr-2" />
                                                    {tab.label}
                                                    {tab.count !== undefined && (
                                                        <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md transition-colors ${isActive ? 'bg-blue-100 dark:bg-emerald-900/30 bluish:bg-blue-500/20' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                                                            {tab.count}
                                                        </span>
                                                    )}
                                                </span>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filter & Insights Buttons */}
                            <div className="flex items-center gap-3 w-full lg:w-fit">
                                {/* Insights Button - Only for Leads */}
                                {location.pathname.includes('/leads') && (
                                    <button
                                        onClick={() => setShowStats(!showStats)}
                                        className={`flex-1 lg:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md ${showStats ? 'bg-blue-50 dark:bg-emerald-900/20 text-blue-700 dark:text-emerald-400 border-blue-200 dark:border-emerald-800 bluish:bg-blue-50 bluish:dark:bg-[#1e293b] bluish:text-blue-400 bluish:border-blue-500/30' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500 bluish:bg-[#1e293b]/50 bluish:border-white/10 bluish:text-blue-200 bluish:hover:bg-blue-500/10 bluish:hover:border-blue-500/30'}`}
                                    >
                                        <TrendingUp size={18} className={`mr-2 transition-transform ${showStats ? 'text-blue-600 dark:text-emerald-400 bluish:text-blue-400' : 'text-gray-500 dark:text-gray-400 bluish:text-blue-300'}`} />
                                        <span className="whitespace-nowrap">{showStats ? 'Hide Insights' : 'View Insights'}</span>
                                    </button>
                                )}

                                {showFilterButton && (
                                    <button
                                        onClick={toggleFilter}
                                        className={`flex-1 lg:flex-none flex items-center justify-center px-5 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md group ${isFilterOpen ? 'bg-gray-900 dark:bg-emerald-600 bluish:bg-blue-600 text-white border-gray-900 dark:border-emerald-600 bluish:border-blue-600' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500 bluish:bg-[#1e293b]/50 bluish:border-white/10 bluish:text-blue-200 bluish:hover:bg-blue-500/10 bluish:hover:border-blue-500/30'}`}
                                    >
                                        <FilterIcon size={18} className={`mr-2 transition-transform group-hover:scale-110 ${isFilterOpen ? 'text-white' : 'text-gray-500 dark:text-gray-400 bluish:text-blue-300'}`} />
                                        <span className="whitespace-nowrap">{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
                                    </button>
                                )}
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
                                            title="Total Revenue"
                                            value={`₹${(dashboardStats?.totalRevenue || 0).toLocaleString()}`}
                                            icon={TrendingUp}
                                            colorClass="bg-blue-500 dark:bg-emerald-500"
                                        />
                                        <StatCard
                                            title="Active Leads"
                                            value={dashboardStats?.activeLeads || 0}
                                            icon={Tag}
                                            colorClass="bg-blue-500 dark:bg-emerald-500"
                                        />
                                        <StatCard
                                            title="Sold Businesses"
                                            value={dashboardStats?.soldCount || 0}
                                            icon={ShoppingBag}
                                            colorClass="bg-indigo-500"
                                        />
                                        <StatCard
                                            title="Success Rate"
                                            value={`${dashboardStats?.successRate || 0}%`}
                                            icon={Clock}
                                            colorClass="bg-amber-500"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}

                {/* Render Content with Context with Smooth Transitions */}
                <div className="mt-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <Outlet context={{ isFilterOpen, businessId, showStats }} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;

