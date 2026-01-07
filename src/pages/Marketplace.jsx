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

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleApplyFilters = () => {
        fetchAssets();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-primary mb-2">Marketplace</h1>
                    <p className="text-gray-600">Discover premium business assets available for acquisition.</p>
                </div>
                <button
                    onClick={toggleFilter}
                    className={`flex items-center px-4 py-2 rounded-lg border font-bold transition-all ${isFilterOpen ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    <FilterIcon size={18} className="mr-2" />
                    {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 align-top">
                {/* Filter Sidebar */}
                {isFilterOpen && (
                    <div className="w-full md:w-1/4 flex-shrink-0 transition-all duration-300 ease-in-out">
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
                        <div className="flex justify-center py-20">Loading assets...</div>
                    ) : (
                        <div className={`grid gap-8 ${isFilterOpen ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                            {assets.map((asset) => (
                                <Link to={`/assets/${asset._id}`} key={asset._id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                                    <div className="h-48 bg-gray-200 relative">
                                        {asset.images && asset.images.length > 0 ? (
                                            <img src={asset.images[0]} alt={asset.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
                                            ${asset.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center text-xs text-accent font-bold uppercase tracking-wider mb-2">
                                            <Tag size={12} className="mr-1" /> {asset.category}
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{asset.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{asset.description}</p>

                                        <div className="flex items-center text-gray-500 text-sm border-t pt-4 mt-auto">
                                            <MapPin size={16} className="mr-1" /> {asset.location}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!loading && assets.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-xl">
                            <h3 className="text-xl font-bold text-gray-400">No assets found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                            <button onClick={handleClearFilters} className="mt-4 text-primary font-bold hover:underline">Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
