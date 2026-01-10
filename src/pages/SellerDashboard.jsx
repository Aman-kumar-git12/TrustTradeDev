import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Filter as FilterIcon, ArrowLeft, TrendingUp, Tag, ShoppingBag, BarChart2, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import Hover from '../components/Hover';

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

const SellerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [businesses, setBusinesses] = useState([]);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [leadsCount, setLeadsCount] = useState(0);
    const [listingsCount, setListingsCount] = useState(0);
    const [dashboardStats, setDashboardStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!businessId) return;
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
            }
        };
        fetchData();
    }, [businessId]);

    const handleBusinessSwitch = (newId) => {
        navigate(`/dashboard/seller/${newId}/leads`);
        setIsDropdownOpen(false);
    };

    const showFilterButton = location.pathname.includes('/leads') || location.pathname.includes('/listings');
    const isFilterOpen = location.pathname.endsWith('/filter');

    const toggleFilter = () => {
        if (isFilterOpen) {
            const newPath = location.pathname.replace('/filter', '');
            navigate(newPath);
        } else {
            navigate(`${location.pathname}/filter`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#050505] transition-colors duration-300 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {!location.pathname.includes('/analytics/product/') && (
                    <>
                        {/* Header & Business Switcher Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Seller Command</h1>
                                <p className="text-gray-500 dark:text-gray-400 font-semibold">Manage your businesses, track leads, and optimize your listings.</p>
                            </div>

                            <div className="relative inline-block">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 p-2 pr-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        {currentBusiness?.businessName?.charAt(0) || 'B'}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">Active Business</p>
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
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
                                    <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 z-50 animate-fade-in divide-y divide-gray-100 dark:divide-zinc-800 overflow-hidden">
                                        <div className="p-2">
                                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest px-3 py-2">Switch Business</p>
                                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                {businesses.map(b => (
                                                    <button
                                                        key={b._id}
                                                        onClick={() => handleBusinessSwitch(b._id)}
                                                        className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${b._id === businessId ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200'}`}
                                                    >
                                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${b._id === businessId ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'}`}>
                                                            {b.businessName.charAt(0)}
                                                        </div>
                                                        <span className="font-bold truncate">{b.businessName}</span>
                                                        {b._id === businessId && <span className="ml-auto text-emerald-600 dark:text-emerald-400">✓</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-zinc-800/30">
                                            <button
                                                onClick={() => navigate('/my-businesses')}
                                                className="w-full py-2 text-xs font-black text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors uppercase tracking-widest"
                                            >
                                                Manage All Businesses
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Tabs (Pill Style) & Actions */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div className="flex p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl w-fit border border-gray-200 dark:border-zinc-800">
                                <NavLink
                                    to="leads"
                                    className={({ isActive }) => `px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${isActive || location.pathname.includes('leads')
                                        ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Tag size={16} className="mr-2" />
                                            Incoming Leads
                                            <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md ${isActive || location.pathname.includes('leads') ? 'bg-emerald-500/10' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                                                {leadsCount}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                                <NavLink
                                    to="listings"
                                    className={({ isActive }) => `px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${location.pathname.includes('listings')
                                        ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <ShoppingBag size={16} className="mr-2" />
                                            My Listings
                                            <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md ${location.pathname.includes('listings') ? 'bg-emerald-500/10' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                                                {listingsCount}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                                <NavLink
                                    to="analytics"
                                    className={({ isActive }) => `px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${isActive || location.pathname.includes('analytics')
                                        ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <BarChart2 size={16} className="mr-2" />
                                    Overview
                                </NavLink>
                            </div>

                            {/* Filter & Insights Buttons */}
                            <div className="flex items-center gap-3">
                                {/* Insights Button - Only for Leads */}
                                {location.pathname.includes('/leads') && (
                                    <button
                                        onClick={() => setShowStats(!showStats)}
                                        className={`flex items-center px-4 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md ${showStats ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500'}`}
                                    >
                                        <TrendingUp size={18} className={`mr-2 transition-transform ${showStats ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`} />
                                        {showStats ? 'Hide Insights' : 'View Insights'}
                                    </button>
                                )}

                                {showFilterButton && (
                                    <button
                                        onClick={toggleFilter}
                                        className={`flex items-center px-5 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm hover:shadow-md group ${isFilterOpen ? 'bg-gray-900 dark:bg-emerald-600 text-white border-gray-900 dark:border-emerald-600' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500'}`}
                                    >
                                        <FilterIcon size={18} className={`mr-2 transition-transform group-hover:scale-110 ${isFilterOpen ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                                        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
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
                                            value={`$${(dashboardStats?.totalRevenue || 0).toLocaleString()}`}
                                            icon={TrendingUp}
                                            colorClass="bg-emerald-500"
                                        />
                                        <StatCard
                                            title="Active Leads"
                                            value={dashboardStats?.activeLeads || 0}
                                            icon={Tag}
                                            colorClass="bg-blue-500"
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

                {/* Render Content with Context */}
                <div className="mt-2">
                    <Outlet context={{ isFilterOpen, businessId, showStats }} />
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;

