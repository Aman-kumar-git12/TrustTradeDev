import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Tag, Filter as FilterIcon } from 'lucide-react';
import Filter from '../components/Filter';
import GridShimmer from '../components/shimmers/GridShimmer';
import { useTheme } from '../context/ThemeContext';
import { useMarketplace } from '../context/MarketplaceContext';


const Marketplace = () => {
    const { theme, mode: themeMode } = useTheme();

    // Use Global Context State
    const {
        assets, setAssets,
        hasMore, setHasMore,
        scrollPosition, setScrollPosition,
        filters, setFilters,
        clearMarketplaceState
    } = useMarketplace();

    const [loading, setLoading] = useState(assets.length === 0); // Only load if empty
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // URL-based filter state
    const location = useLocation();
    const navigate = useNavigate();
    const isFilterOpen = location.pathname.endsWith('/filter');

    // Ref to track if we should fetch more
    const shouldFetchRef = useRef(true);

    // Save scroll position on unmount / navigation away
    useEffect(() => {
        // Restore scroll on mount if we have assets
        if (assets.length > 0) {
            window.scrollTo(0, scrollPosition);
        }

        return () => {
            // Save scroll position when leaving
            setScrollPosition(window.scrollY);
            if (observer.current) observer.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount/unmount

    // Intersection Observer
    const observer = useRef();
    const lastAssetElementRef = useCallback(node => {
        if (loading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && shouldFetchRef.current) {
                shouldFetchRef.current = false;
                fetchAssets(filters, true);
            }
        }, { rootMargin: '200px' });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, hasMore, filters]);

    const toggleFilter = () => {
        if (isFilterOpen) {
            navigate('/marketplace');
        } else {
            navigate('/marketplace/filter');
        }
    };

    const fetchAssets = async (activeFilters = filters, isLoadMore = false) => {
        if (isLoadMore) {
            setIsFetchingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const params = new URLSearchParams();
            if (activeFilters.search) params.append('search', activeFilters.search);
            if (activeFilters.category) params.append('category', activeFilters.category);
            if (activeFilters.minPrice) params.append('minPrice', activeFilters.minPrice);
            if (activeFilters.maxPrice) params.append('maxPrice', activeFilters.maxPrice);
            if (activeFilters.condition) params.append('condition', activeFilters.condition);
            params.append('limit', '9');

            if (isLoadMore) {
                const currentIds = assets.map(a => a._id).join(',');
                if (currentIds) {
                    params.append('excludeIds', currentIds);
                }
            }

            params.append('_t', Date.now());

            const { data } = await api.get(`/assets?${params.toString()}`);
            const newAssets = Array.isArray(data) ? data : (data.assets || []);

            if (newAssets.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
                if (isLoadMore) {
                    setAssets(prev => {
                        const existingIds = new Set(prev.map(a => a._id));
                        const uniqueNewAssets = newAssets.filter(a => !existingIds.has(a._id));
                        return [...prev, ...uniqueNewAssets];
                    });
                } else {
                    setAssets(newAssets);
                }
            }
        } catch (error) {
            console.error("Failed to fetch assets", error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
            shouldFetchRef.current = true;
        }
    };

    // Initial load logic
    useEffect(() => {
        // If we have assets and no filters changed (checked via simplified logic or assuming filters persist in context), don't refetch
        // We know filters persist in context.
        // We only fetch if assets are empty (refresh or first load) OR if filters effectively changed locally?
        // Actually, if we just rely on `assets.length === 0`, that handles the "refresh" case.
        // What if user changes filters? `handleFilterChange` updates context filters. 
        // We need an effect that watches `filters`.

        // Strategy: 
        // 1. If assets are empty, fetch.
        // 2. If filters change, we MUST fetch fresh. But we need to distinguish "initial mount with existing filters" vs "user changed filters".
        // The context stores the *current* filters.

        if (assets.length === 0) {
            fetchAssets(filters, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]); // If filters change, this runs. If mount with existing filters & empty assets, runs. 
    // BUT if mount with existing filters & existing assets, we skip? 
    // Problem: `[filters]` dependency will run on mount. If `assets` is not empty, it won't fetch. Correct.
    // What if user changes filter? `setFilters` updates context. This effect runs. `assets` is NOT empty. We MUST fetch.

    // Correction: We need to know if this is a "mount" or a "change".
    // Alternatively, `handleFilterChange` can trigger the fetch or clear assets.
    // Let's modify `handleFilterChange` to clear assets, which trips the effect.

    const handleClearFilters = () => {
        const emptyFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: ''
        };
        setFilters(emptyFilters);
        setAssets([]); // Clear assets to trigger refetch
        setHasMore(true);
        // Effect will run because filters changed OR assets is empty is checked?
        // Let's rely on explicitly calling fetch or clearing assets.
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => {
            const updated = { ...prev, ...newFilters };
            // We should also clear assets/reset here to force a refetch in the Effect?
            // Doing it in setState callback or immediately after?
            return updated;
        });
        // Side effect: We want to refetch when filters update.
        // Better: Make the useEffect *always* fetch if it's a filter change, but GUARD against the "mount restoration" case.

        // For now, let's keep it simple:
        // If the user *interacts* to change filters, we call `fetchAssets` directly or reset `assets`.
        setAssets([]);
        setHasMore(true);
    };

    const handleApplyFilters = () => {
        // Handled by logic above
    };

    const isDark = theme === 'dark';
    const isBluish = theme === 'bluish' || themeMode === 'bluish';
    const accentColor = isDark && !isBluish ? 'emerald' : 'blue';

    return (
        <div className="min-h-screen bg-transparent dark:bg-black bluish:bg-[#0a0f1d] text-gray-900 dark:text-gray-200 transition-colors duration-300 relative overflow-x-hidden">
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>
            {/* Dynamic Background Elements - Bluish Theme Only */}
            {/* Dynamic Background Elements - Bluish Theme Only - Removed to align with Dark theme performance */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden bluish:block">
                {/* Simplified gradient for Bluish theme instead of expensive blobs/images */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d] via-[#111827] to-[#0a0f1d]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Marketplace</h1>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Discover premium business assets available for acquisition.</p>
                    </div>
                    <button
                        onClick={toggleFilter}
                        className={`flex items-center px-4 py-2 rounded-lg border font-bold transition-all ${isFilterOpen ? 'bg-blue-600 border-blue-600 text-white bluish:bg-blue-600 bluish:border-blue-500 bluish:shadow-lg bluish:shadow-blue-600/20' : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 bluish:bg-white/5 bluish:text-gray-300 bluish:border-white/10 bluish:hover:bg-white/10'}`}
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
                                accentColor={accentColor}
                            />
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className={`flex-grow transition-all duration-300 ${isFilterOpen ? 'md:w-3/4' : 'w-full'}`}>
                        {/* Initial Loading */}
                        {loading && assets.length === 0 ? (
                            <GridShimmer />
                        ) : (
                            <>
                                <div className={`grid gap-8 ${isFilterOpen ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                                    {assets.map((asset, index) => {
                                        if (assets.length === index + 1) {
                                            return (
                                                <Link ref={lastAssetElementRef} to={`/assets/${asset._id}`} key={asset._id} className="group opacity-100 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e] rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 overflow-hidden hover:shadow-lg dark:hover:border-blue-500/50 bluish:hover:border-blue-500/50 bluish:hover:shadow-blue-500/10 transition-all h-full flex flex-col relative hover:-translate-y-2">
                                                    <div className="h-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-[#0a0f1d] relative overflow-hidden">
                                                        {asset.images && asset.images.length > 0 ? (
                                                            <img src={asset.images[0]} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bluish:opacity-90 bluish:group-hover:opacity-100" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-zinc-600 bluish:bg-[#0f1629]">No Image</div>
                                                        )}

                                                        {/* Bluish Theme Overlays - Reduced for performance */}
                                                        <div className="hidden bluish:block absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-40 pointer-events-none"></div>

                                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 bluish:bg-[#0a0f1d] px-3 py-1 rounded-full bluish:rounded-lg text-sm font-bold text-gray-900 dark:text-white bluish:text-white shadow-sm bluish:shadow-lg bluish:border bluish:border-white/10">
                                                            ${asset.price.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="p-6 flex flex-col flex-grow">
                                                        <div className="flex items-center text-xs text-blue-600 dark:text-emerald-400 bluish:text-white font-bold uppercase tracking-wider mb-2 bluish:bg-blue-600 bluish:px-2.5 bluish:py-1 bluish:rounded-md bluish:w-fit bluish:shadow-md">
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
                                            );
                                        } else {
                                            return (
                                                <Link to={`/assets/${asset._id}`} key={asset._id} className="group opacity-100 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e] rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 overflow-hidden hover:shadow-lg dark:hover:border-blue-500/50 bluish:hover:border-blue-500/50 bluish:hover:shadow-blue-500/10 transition-all h-full flex flex-col relative hover:-translate-y-2">
                                                    <div className="h-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-[#0a0f1d] relative overflow-hidden">
                                                        {asset.images && asset.images.length > 0 ? (
                                                            <img src={asset.images[0]} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bluish:opacity-90 bluish:group-hover:opacity-100" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-zinc-600 bluish:bg-[#0f1629]">No Image</div>
                                                        )}

                                                        {/* Bluish Theme Overlays - Reduced for performance */}
                                                        <div className="hidden bluish:block absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-40 pointer-events-none"></div>

                                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 bluish:bg-[#0a0f1d] px-3 py-1 rounded-full bluish:rounded-lg text-sm font-bold text-gray-900 dark:text-white bluish:text-white shadow-sm bluish:shadow-lg bluish:border bluish:border-white/10">
                                                            ${asset.price.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="p-6 flex flex-col flex-grow">
                                                        <div className="flex items-center text-xs text-blue-600 dark:text-emerald-400 bluish:text-white font-bold uppercase tracking-wider mb-2 bluish:bg-blue-600 bluish:px-2.5 bluish:py-1 bluish:rounded-md bluish:w-fit bluish:shadow-md">
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
                                            );
                                        }
                                    })}
                                </div>
                                {isFetchingMore && (
                                    <div className="w-full py-8 flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-white bluish:border-white"></div>
                                    </div>
                                )}
                            </>
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
        </div >
    );
};

export default Marketplace;
