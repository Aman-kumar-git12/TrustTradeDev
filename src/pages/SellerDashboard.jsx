import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Filter as FilterIcon, ArrowLeft, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import Hover from '../components/Hover';

const SellerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [businesses, setBusinesses] = useState([]);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all businesses for the dropdown
                const { data: businessesData } = await api.get('/businesses');
                setBusinesses(businessesData);

                // Find current business
                const found = businessesData.find(b => b._id === businessId);
                if (found) {
                    setCurrentBusiness(found);
                } else if (businessesData.length > 0 && !businessId) {
                    // Should be handled by redirect, but safety check
                    setCurrentBusiness(businessesData[0]);
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
        <div className="max-w-7xl mx-auto px-4 py-8">
            {!location.pathname.includes('/analytics/product/') && (
                <>
                    <div className="flex items-center justify-between mb-8">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 transition-opacity"
                            >
                                <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold text-xl">
                                    {currentBusiness?.businessName?.charAt(0) || 'B'}
                                </div>
                                <div className="text-left">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {currentBusiness ? currentBusiness.businessName : 'Loading...'}
                                        <Hover text="Switch Business">
                                            <svg
                                                className={`w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Hover>
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Seller Dashboard</p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 z-50 animate-fade-in divide-y divide-gray-100 dark:divide-zinc-800">
                                    <div className="p-2">
                                        <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase px-3 py-2">Switch Business</p>
                                        {businesses.map(b => (
                                            <button
                                                key={b._id}
                                                onClick={() => handleBusinessSwitch(b._id)}
                                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${b._id === businessId && location.pathname.includes('/leads') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200'}`}
                                            >
                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${b._id === businessId ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'}`}>
                                                    {b.businessName.charAt(0)}
                                                </div>
                                                <span className="font-medium truncate">{b.businessName}</span>
                                                {b._id === businessId && <span className="ml-auto text-emerald-600 dark:text-emerald-400">✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-b-xl">
                                        <button
                                            onClick={() => navigate('/my-businesses')}
                                            className="w-full text-center py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            Manage All Businesses
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs & Actions */}
                    <div className="flex justify-between items-end border-b border-gray-200 dark:border-zinc-800 mb-8 transition-colors duration-300">
                        <div className="flex space-x-8">
                            <NavLink
                                to="leads"
                                className={({ isActive }) => `pb-3 px-1 font-bold text-lg tracking-tight transition-all border-b-[3px] ${location.pathname.includes('leads') ? 'border-gray-900 dark:border-emerald-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-zinc-700'}`}
                            >
                                Incoming Leads
                            </NavLink>
                            <NavLink
                                to="listings"
                                className={({ isActive }) => `pb-3 px-1 font-bold text-lg tracking-tight transition-all border-b-[3px] ${location.pathname.includes('listings') ? 'border-gray-900 dark:border-emerald-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-zinc-700'}`}
                            >
                                My Listings
                            </NavLink>
                            <NavLink
                                to="analytics"
                                className={({ isActive }) => `pb-3 px-1 font-bold text-lg tracking-tight transition-all border-b-[3px] ${isActive || location.pathname.includes('analytics') ? 'border-gray-900 dark:border-emerald-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-200 dark:hover:border-zinc-700'}`}
                            >
                                Overview & Analytics
                            </NavLink>
                        </div>

                        {/* Filter & Insights Buttons */}
                        <div className="flex items-center gap-3 mb-2">
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
                </>
            )}

            {/* Render Content with Context */}
            <Outlet context={{ isFilterOpen, businessId, showStats }} />
        </div>
    );
};

export default SellerDashboard;

