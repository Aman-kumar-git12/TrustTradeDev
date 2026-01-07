import { NavLink, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Filter as FilterIcon } from 'lucide-react';

const SellerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to leads if exactly on /dashboard/seller
    if (location.pathname === '/dashboard/seller' || location.pathname === '/dashboard/seller/') {
        return <Navigate to="leads" replace />;
    }

    const showFilterButton = location.pathname.includes('/leads');
    const isFilterOpen = location.pathname.endsWith('/filter');

    const toggleFilter = () => {
        if (isFilterOpen) {
            navigate('leads');
        } else {
            navigate('leads/filter');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">Seller Dashboard</h1>

            {/* Navigation Tabs & Actions */}
            <div className="flex justify-between items-center border-b mb-8">
                <div className="flex space-x-6">
                    <NavLink
                        to="leads"
                        end={false} // Match starts with leads
                        className={({ isActive }) => `pb-4 px-2 font-bold text-lg transition-colors ${location.pathname.includes('leads') ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Incoming Leads
                    </NavLink>
                    <NavLink
                        to="listings"
                        className={({ isActive }) => `pb-4 px-2 font-bold text-lg transition-colors ${isActive ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Listings
                    </NavLink>
                    <NavLink
                        to="overview"
                        className={({ isActive }) => `pb-4 px-2 font-bold text-lg transition-colors ${isActive ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Overview & Analytics
                    </NavLink>
                </div>

                {/* Filter Button (Only for Leads) */}
                {showFilterButton && (
                    <button
                        onClick={toggleFilter}
                        className={`flex items-center px-4 py-2 mb-2 rounded-lg border font-bold transition-all ${isFilterOpen ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        <FilterIcon size={18} className="mr-2" />
                        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                )}
            </div>

            {/* Render Content with Context */}
            <Outlet context={{ isFilterOpen }} />
        </div>
    );
};

export default SellerDashboard;
