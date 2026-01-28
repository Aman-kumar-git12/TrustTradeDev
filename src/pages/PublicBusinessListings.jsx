import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, MapPin, Tag, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import GridShimmer from '../components/shimmers/GridShimmer';
import OptimizedImage from '../components/OptimizedImage';

const PublicBusinessListings = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();

    // Data State
    const [assets, setAssets] = useState([]);
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true); // Initial load
    const [isFetchingMore, setIsFetchingMore] = useState(false); // Pagination load

    // UI State
    const [viewMode, setViewMode] = useState('grid');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 12;

    // Observer for infinite scroll
    const observer = useRef();
    const lastAssetElementRef = useCallback(node => {
        if (loading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isFetchingMore, hasMore]);

    // Initial Fetch (Business + First Page of Assets)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setPage(1); // Reset page
            try {
                // Fetch business details
                const businessRes = await api.get(`/businesses/${businessId}`);
                setBusiness(businessRes.data);

                // Fetch first page of assets
                const assetsRes = await api.get(`/businesses/${businessId}/assets?page=1&limit=${ITEMS_PER_PAGE}`);
                const newAssets = assetsRes.data || [];

                setAssets(newAssets);
                setHasMore(newAssets.length === ITEMS_PER_PAGE);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        if (businessId) {
            fetchInitialData();
        }
    }, [businessId]);

    // Load More Assets (Pagination)
    useEffect(() => {
        const fetchMoreAssets = async () => {
            if (page === 1) return; // Already handled by initial fetch

            setIsFetchingMore(true);
            try {
                const { data } = await api.get(`/businesses/${businessId}/assets?page=${page}&limit=${ITEMS_PER_PAGE}`);
                const newAssets = data || [];

                if (newAssets.length === 0) {
                    setHasMore(false);
                } else {
                    setAssets(prev => {
                        // Filter out duplicates just in case
                        const existingIds = new Set(prev.map(a => a._id));
                        const uniqueNewAssets = newAssets.filter(a => !existingIds.has(a._id));
                        return [...prev, ...uniqueNewAssets];
                    });
                    if (newAssets.length < ITEMS_PER_PAGE) {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch more assets", error);
            } finally {
                setIsFetchingMore(false);
            }
        };

        if (businessId && page > 1) {
            fetchMoreAssets();
        }
    }, [page, businessId]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <GridShimmer />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] selection:bg-blue-500/30 dark:selection:bg-emerald-500/30 bluish:selection:bg-blue-500/30 font-sans transition-colors duration-300 relative overflow-x-hidden">
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>

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

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    {/* Header Section - Clean & Static */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bluish:text-slate-400 bluish:hover:text-white transition-colors w-fit group"
                            >
                                <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                Back to Business
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white bluish:text-white tracking-tight">
                                {business?.businessName ? `Listings by ${business.businessName}` : 'Business Listings'}
                            </h1>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-white dark:bg-zinc-900 bluish:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 shadow-sm self-start md:self-end">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid'
                                    ? 'bg-gray-100 dark:bg-zinc-800 bluish:bg-slate-700 text-blue-600 dark:text-emerald-400 bluish:text-blue-400 font-bold shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                                title="Grid View"
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-lg transition-all ${viewMode === 'list'
                                    ? 'bg-gray-100 dark:bg-zinc-800 bluish:bg-slate-700 text-blue-600 dark:text-emerald-400 bluish:text-blue-400 font-bold shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                                title="List View"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {assets.length === 0 ? (
                        <div className="text-center py-24 bg-white/50 dark:bg-zinc-900/50 bluish:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bluish:border-white/10">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 bluish:text-slate-500">
                                <ShoppingBag size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white bluish:text-white mb-3">No Active Listings</h2>
                            <p className="text-gray-500 dark:text-gray-400 bluish:text-slate-400 max-w-sm mx-auto">This business currently has no assets listed for sale. Please check back later.</p>
                        </div>
                    ) : (
                        <>
                            <div className={`grid gap-3 sm:gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'grid-cols-1 max-w-4xl mx-auto'
                                }`}>
                                {assets.map((asset, index) => {
                                    // Attach ref to the last element
                                    const isLast = assets.length === index + 1;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.4, delay: index % ITEMS_PER_PAGE * 0.05 }}
                                            ref={isLast ? lastAssetElementRef : null}
                                            key={asset._id}
                                            onClick={() => navigate(`/assets/${asset._id}`)}
                                            className={`bg-white dark:bg-zinc-900 bluish:bg-[#131b2e] rounded-2xl border border-gray-200 dark:border-zinc-800 bluish:border-white/5 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:hover:border-emerald-500/30 bluish:hover:border-blue-500/30 ${viewMode === 'list'
                                                ? 'flex flex-row relative min-h-[140px]' // Force flex-row for both mobile and desktop in list view
                                                : 'flex flex-col h-full'
                                                }`}
                                        >
                                            {/* Image Container */}
                                            <div className={`relative overflow-hidden bg-gray-100 dark:bg-zinc-800 bluish:bg-slate-900 ${viewMode === 'list'
                                                ? 'w-32 sm:w-72 flex-shrink-0' // Fixed width for mobile (w-32) and larger for desktop
                                                : 'aspect-[4/3]'
                                                }`}>
                                                <OptimizedImage
                                                    src={asset.images[0]}
                                                    alt={asset.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-white/20 shadow-sm z-10">
                                                    {asset.condition}
                                                </div>
                                            </div>

                                            {/* Content Container */}
                                            <div className={`p-3 sm:p-5 flex flex-col flex-grow ${viewMode === 'list' ? 'justify-between' : ''}`}>
                                                <div>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1 sm:mb-2">
                                                        <h3 className="font-bold text-gray-900 dark:text-white bluish:text-white group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors text-sm sm:text-lg leading-tight line-clamp-2">
                                                            {asset.title}
                                                        </h3>
                                                        <span className="text-sm sm:text-lg font-bold text-blue-600 dark:text-emerald-400 bluish:text-blue-400 whitespace-nowrap">
                                                            ${asset.price.toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 bluish:text-slate-400 mb-2 sm:mb-3 uppercase tracking-wide">
                                                        <Tag size={10} className="mr-1 sm:mr-1.5 text-blue-500 dark:text-emerald-500" />
                                                        {asset.category}
                                                    </div>

                                                    {viewMode === 'list' && (
                                                        <p className="text-gray-600 dark:text-gray-400 bluish:text-slate-400 text-sm line-clamp-2 mb-4 hidden sm:block leading-relaxed">
                                                            {asset.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className={`pt-2 sm:pt-4 border-t border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 bluish:text-slate-500 mt-auto`}>
                                                    <MapPin size={12} className="mr-1 sm:mr-1.5" />
                                                    <span className="truncate max-w-[140px] sm:max-w-none">{asset.location}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Loading More Spinner */}
                            {isFetchingMore && (
                                <div className="w-full py-8 flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-white bluish:border-white"></div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PublicBusinessListings;
