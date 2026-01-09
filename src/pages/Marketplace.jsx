import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Tag, Filter as FilterIcon } from 'lucide-react';
import Filter from '../components/Filter';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Marketplace</h1>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Discover premium business assets available for acquisition.</p>
                </div>
                <button
                    onClick={toggleFilter}
                    className={`flex items-center px-4 py-2 rounded-lg border font-bold transition-all ${isFilterOpen ? 'bg-gray-900 dark:bg-emerald-600 text-white border-gray-900 dark:border-emerald-600' : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                    <FilterIcon size={18} className="mr-2" />
                    {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 align-top">
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
                        <div className="flex justify-center py-20 text-gray-500 dark:text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mr-3"></div>
                            Loading assets...
                        </div>
                    ) : (
                        <div className={`grid gap-8 ${isFilterOpen ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                            {assets.map((asset) => (
                                <Link to={`/assets/${asset._id}`} key={asset._id} className="group bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg dark:hover:border-emerald-500/50 transition-all h-full flex flex-col">
                                    <div className="h-48 bg-gray-200 dark:bg-zinc-800 relative overflow-hidden">
                                        {asset.images && asset.images.length > 0 ? (
                                            <img src={asset.images[0]} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-zinc-600">No Image</div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-sm">
                                            ${asset.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">
                                            <Tag size={12} className="mr-1" /> {asset.category}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{asset.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{asset.description}</p>

                                        <div className="flex items-center text-gray-500 dark:text-gray-500 text-sm border-t border-gray-100 dark:border-zinc-800 pt-4 mt-auto">
                                            <MapPin size={16} className="mr-1" /> {asset.location}
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
                            <button onClick={handleClearFilters} className="mt-4 text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
