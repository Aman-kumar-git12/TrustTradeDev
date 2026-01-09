import { useState } from 'react';
import { NavLink, Outlet, useOutletContext, useLocation } from 'react-router-dom';
import Snackbar from '../components/Snackbar';

const SellerAnalytics = () => {
    const { businessId } = useOutletContext();
    const location = useLocation();
    const isProductPage = location.pathname.includes('/product/');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });

    const handleNavClick = (e, path, name) => {
        // Check if we are already on this path
        // Use 'includes' to handle sub-paths if necessary, or check end of string
        if (location.pathname.includes(path)) {
            e.preventDefault();
            setSnackbar({ open: true, message: `You are already at ${name}`, type: 'dark' });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Navigation Tabs - Hide on Product Page */}
            {!isProductPage && (
                <div className="flex space-x-1 bg-gray-100/50 dark:bg-zinc-900 border dark:border-zinc-800 p-1 rounded-xl w-fit transition-colors duration-300">
                    <NavLink
                        to="overview"
                        onClick={(e) => handleNavClick(e, 'overview', 'Business Overview')}
                        className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${isActive ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-800'}`}
                    >
                        Business Overview
                    </NavLink>
                    <NavLink
                        to="products"
                        onClick={(e) => handleNavClick(e, 'products', 'Product Performance')}
                        className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${isActive ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-800'}`}
                    >
                        Product Performance
                    </NavLink>
                    <NavLink
                        to="customers"
                        onClick={(e) => handleNavClick(e, 'customers', 'Customer Insights')}
                        className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${isActive ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-800'}`}
                    >
                        Customer Insights
                    </NavLink>
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
