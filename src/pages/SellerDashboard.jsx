import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Filter as FilterIcon, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import Hover from '../components/Hover';

const SellerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { businessId } = useParams();
    const [businesses, setBusinesses] = useState([]);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            <div className="flex items-center justify-between mb-8">
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 transition-opacity"
                    >
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            {currentBusiness?.businessName?.charAt(0) || 'B'}
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                {currentBusiness ? currentBusiness.businessName : 'Loading...'}
                                <Hover text="Switch Business">
                                    <svg
                                        className={`w-5 h-5 text-gray-400 hover:text-gray-900 transition-colors transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Hover>
                            </h1>
                            <p className="text-sm text-gray-500">Seller Dashboard</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in divide-y divide-gray-100">
                            <div className="p-2">
                                <p className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Switch Business</p>
                                {businesses.map(b => (
                                    <button
                                        key={b._id}
                                        onClick={() => handleBusinessSwitch(b._id)}
                                        className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${b._id === businessId ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${b._id === businessId ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                            {b.businessName.charAt(0)}
                                        </div>
                                        <span className="font-medium truncate">{b.businessName}</span>
                                        {b._id === businessId && <span className="ml-auto text-primary">✓</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 bg-gray-50 rounded-b-xl">
                                <button
                                    onClick={() => navigate('/my-businesses')}
                                    className="w-full text-center py-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors"
                                >
                                    Manage All Businesses
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Tabs & Actions */}
            <div className="flex justify-between items-center border-b mb-8">
                <div className="flex space-x-6">
                    <NavLink
                        to="leads"
                        className={({ isActive }) => `pb-4 px-2 font-bold text-lg transition-colors ${location.pathname.includes('leads') ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Incoming Leads
                    </NavLink>
                    <NavLink
                        to="listings"
                        className={({ isActive }) => `pb-4 px-2 font-bold text-lg transition-colors ${location.pathname.includes('listings') ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
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

                {/* Filter Button (Only for Leads/Listings) */}
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
            <Outlet context={{ isFilterOpen, businessId }} />
        </div>
    );
};

export default SellerDashboard;
