import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Tag, Filter as FilterIcon } from 'lucide-react';
import Filter from '../components/Filter';
import GridShimmer from '../components/shimmers/GridShimmer';

const Marketplace = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    // URL-based filter state
    const location = useLocation();
    const navigate = useNavigate();
    const isFilterOpen = location.pathname.endsWith('/filter');

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: ''
    });

    const toggleFilter = () => {
        if (isFilterOpen) {
            navigate('/marketplace');
        } else {
            navigate('/marketplace/filter');
        }
    };

    const fetchAssets = async (activeFilters = filters) => {
        setLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams();
            if (activeFilters.search) params.append('search', activeFilters.search);
            if (activeFilters.category) params.append('category', activeFilters.category);
            if (activeFilters.minPrice) params.append('minPrice', activeFilters.minPrice);
            if (activeFilters.maxPrice) params.append('maxPrice', activeFilters.maxPrice);
            if (activeFilters.condition) params.append('condition', activeFilters.condition);
            params.append('_t', Date.now()); // Prevent caching

            const { data } = await api.get(`/assets?${params.toString()}`);
            setAssets(data);
        } catch (error) {
            console.error("Failed to fetch assets", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load only
    useEffect(() => {
        fetchAssets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClearFilters = () => {
        const emptyFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: ''
        };
        setFilters(emptyFilters);
        fetchAssets(emptyFilters);
    };

    // Auto-clear filters when sidebar is closed (URL changes away from /filter)
    useEffect(() => {
        if (!isFilterOpen) {
            handleClearFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFilterOpen]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleApplyFilters = () => {
        fetchAssets();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] bluish:bg-[#0a0f1d] selection:bg-blue-500/30 bluish:selection:bg-blue-500/30 overflow-hidden relative">
            {/* Dynamic Background Elements - Bluish Theme Only */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden bluish:block">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

                {/* Background Image & Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/90 via-[#0a0f1d]/80 to-[#0a0f1d]"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Marketplace</h1>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Discover premium business assets available for acquisition.</p>
                    </div>
                    <button
                        onClick={toggleFilter}
                        className={`flex items-center px-4 py-2 rounded-lg border font-bold transition-all ${isFilterOpen ? 'bg-blue-600 border-blue-600 text-white bluish:bg-blue-600 bluish:border-blue-500 bluish:shadow-lg bluish:shadow-blue-600/20' : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 bluish:bg-white/5 bluish:text-gray-300 bluish:border-white/10 bluish:hover:bg-white/10 bluish:backdrop-blur-sm'}`}
                    >
                        <FilterIcon size={18} className="mr-2" />
                        {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-8 items-start">
                    {/* Filter Sidebar */}
                    {isFilterOpen && (
                        <div className="w-full md:w-1/4 flex-shrink-0 transition-all duration-300 ease-in-out block animate-fade-in">
                            <Filter
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClear={handleClearFilters}
                                onApply={handleApplyFilters}
                                onClose={() => navigate('/marketplace')}
                            />
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className={`flex-grow transition-all duration-300 ${isFilterOpen ? 'md:w-3/4' : 'w-full'}`}>
                        {loading ? (
                            <GridShimmer />
                        ) : (
                            <div className={`grid gap-8 ${isFilterOpen ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                                {assets.map((asset) => (
                                    <Link to={`/assets/${asset._id}`} key={asset._id} className="group bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/80 bluish:backdrop-blur-md rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 overflow-hidden hover:shadow-lg dark:hover:border-blue-500/50 bluish:hover:border-blue-500/50 bluish:hover:shadow-blue-500/10 transition-all h-full flex flex-col relative bluish:animate-fade-in-up hover:-translate-y-2">
                                        <div className="h-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-[#0a0f1d] relative overflow-hidden">
                                            {asset.images && asset.images.length > 0 ? (
                                                <img src={asset.images[0]} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bluish:opacity-90 bluish:group-hover:opacity-100" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 dark:text-zinc-600 bluish:bg-[#0f1629]">No Image</div>
                                            )}

                                            {/* Bluish Theme Overlays */}
                                            <div className="hidden bluish:block absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-60"></div>
                                            <div className="hidden bluish:block absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 bluish:bg-black/60 bluish:backdrop-blur-md px-3 py-1 rounded-full bluish:rounded-lg text-sm font-bold text-gray-900 dark:text-white bluish:text-white shadow-sm bluish:shadow-xl bluish:border bluish:border-white/10">
                                                ${asset.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center text-xs text-blue-600 dark:text-emerald-400 bluish:text-white font-bold uppercase tracking-wider mb-2 bluish:bg-blue-600/90 bluish:backdrop-blur-md bluish:px-2.5 bluish:py-1 bluish:rounded-md bluish:w-fit bluish:shadow-lg">
                                                <Tag size={12} className="mr-1" /> {asset.category}
                                            </div>
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 bluish:text-gray-300 mb-1 truncate">
                                                {asset.business?.businessName || asset.seller?.companyName || asset.seller?.fullName}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors line-clamp-1">{asset.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 bluish:text-gray-400 text-sm truncate mb-4 flex-grow font-light leading-relaxed">{asset.description}</p>

                                            <div className="flex items-center text-gray-500 dark:text-gray-500 bluish:text-gray-500 text-sm border-t border-gray-100 dark:border-zinc-800 bluish:border-white/5 pt-4 mt-auto">
                                                <MapPin size={16} className="mr-1 bluish:text-blue-500" /> {asset.location}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!loading && assets.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700">
                                <h3 className="text-xl font-bold text-gray-400 dark:text-gray-600">No assets found</h3>
                                <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filters.</p>
                                <button onClick={handleClearFilters} className="mt-4 text-blue-600 dark:text-emerald-400 bluish:text-blue-400 font-bold hover:underline">Clear all filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
