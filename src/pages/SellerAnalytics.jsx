import { useState } from 'react';
import { useNavigate, useParams, NavLink, Outlet, useOutletContext, useLocation } from 'react-router-dom';
import Snackbar from '../components/Snackbar';

const SellerAnalytics = () => {
    const { businessId } = useOutletContext();
    const location = useLocation();
    const isProductPage = location.pathname.includes('/product/');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });

    const navigate = useNavigate();
    const { range, assetId } = useParams();
    const isOverview = location.pathname.includes('/overview');
    const isProduct = location.pathname.includes('/product/');

    const currentRange = range || (isProduct ? '30d' : '1m');

    const handleNavClick = (e, path, name) => {
        if (location.pathname.includes(path)) {
            e.preventDefault();
            setSnackbar({ open: true, message: `You are already at ${name}`, type: 'dark' });
        }
    };

    const handleRangeChange = (newRange) => {
        if (isOverview) {
            navigate(`/dashboard/seller/${businessId}/analytics/overview/${newRange}`);
        } else if (isProduct) {
            // Product analytics typically use 30d/all
            const productRange = ['24h', '15d', '1m'].includes(newRange) ? '30d' : 'all';
            navigate(`/dashboard/seller/${businessId}/analytics/product/${assetId}/${productRange}`, {
                state: location.state // Preserve productTitle
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Navigation & Range Header */}
            {!isProductPage && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 bg-gray-100/50 dark:bg-zinc-900 border dark:border-zinc-800 p-1 rounded-xl w-fit transition-colors duration-300">
                        <NavLink
                            to="overview"
                            onClick={(e) => handleNavClick(e, 'overview', 'Business Overview')}
                            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${isActive ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-800'}`}
                        >
                            Business Overview
                        </NavLink>
                        <NavLink
                            to="products"
                            onClick={(e) => handleNavClick(e, 'products', 'Product Performance')}
                            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${isActive ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-800'}`}
                        >
                            Product Performance
                        </NavLink>
                        <NavLink
                            to="customers"
                            onClick={(e) => handleNavClick(e, 'customers', 'Customer Insights')}
                            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${isActive ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-800'}`}
                        >
                            Customer Insights
                        </NavLink>
                    </div>

                    {/* Range Switcher - Visible on Overview or product details */}
                    {(isOverview || isProduct) && (
                        <div className="bg-gray-100/50 dark:bg-zinc-900 rounded-xl p-1 border dark:border-zinc-800 flex text-xs font-bold transition-colors duration-300">
                            {(isProduct ? ['30d', 'all'] : ['24h', '15d', '1m', '1y', 'all']).map(r => (
                                <button
                                    key={r}
                                    onClick={() => handleRangeChange(r)}
                                    className={`px-3 py-1.5 rounded-lg transition-all ${currentRange === r ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                                >
                                    {r === '24h' ? '24h' : r === 'all' ? 'All' : r.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Content Area */}
            <Outlet context={{ businessId }} />

            <Snackbar
                open={snackbar.open}
                message={snackbar.message}
                type={snackbar.type}
                duration={1500}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </div>
    );
};

export default SellerAnalytics;
