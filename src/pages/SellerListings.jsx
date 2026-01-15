import { useEffect, useState } from 'react';
import { Eye, PauseCircle, PlayCircle, FolderOpen, Trash2 } from 'lucide-react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import ListingFilter from '../components/ListingFilter';
import ListingsShimmer from '../components/shimmers/ListingsShimmer';

const SellerListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isFilterOpen, businessId } = useOutletContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showSnackbar, confirm } = useUI();

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        status: '', // 'active', 'inactive'
        category: '',
        minPrice: '',
        maxPrice: ''
    });

    const fetchListings = async (params) => {
        if (!businessId) return;
        setLoading(true);
        try {
            const activeFilters = params || filters;
            // Construct query params from filters state
            const queryParams = new URLSearchParams();
            Object.entries(activeFilters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const { data } = await api.get(`/dashboard/business/${businessId}/assets?${queryParams.toString()}`);
            setListings(data);
        } catch (error) {
            console.error("Failed to fetch listings", error);
            showSnackbar("Failed to fetch listings", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilters({ search: '', status: '', category: '', minPrice: '', maxPrice: '' });
        fetchListings({}); // Pass empty to override potential stale state
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId]);

    const handleApplyFilters = () => {
        fetchListings();
        // Optional: Close filter panel here if desired
        // navigate(/dashboard/seller/${businessId}/listings);
    };

    const handleClearFilters = () => {
        const emptyFilters = { search: '', status: '', category: '', minPrice: '', maxPrice: '' };
        setFilters(emptyFilters);
        // Trigger fetch with empty filters immediately
        fetchListings(emptyFilters);
    };

    const handleStatusChange = async (id, newStatus) => {
        const isActivating = newStatus === 'active';

        confirm({
            title: isActivating ? "Activate Listing" : "Deactivate Listing",
            message: isActivating
                ? "Are you sure you want to activate this listing? It will be visible to buyers."
                : "Are you sure you want to deactivate this listing? It will be hidden from buyers.",
            confirmText: isActivating ? "Activate" : "Deactivate",
        }).then(async (confirmed) => {
            if (confirmed) {
                try {
                    // Optimistic update
                    const updatedListings = listings.map(item =>
                        item._id === id ? { ...item, status: newStatus } : item
                    );

                    // If filtering by status, remove it from view if it no longer matches
                    if (filters.status && filters.status !== newStatus) {
                        setListings(listings.filter(item => item._id !== id));
                    } else {
                        setListings(updatedListings);
                    }

                    const response = await api.put(`/assets/${id}/status`, { status: newStatus });
                    console.log("[Frontend] Status update success:", response.data);
                    showSnackbar(`Asset ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
                } catch (error) {
                    console.error("[Frontend] Failed to update status", error);
                    // Revert optimistic update on failure
                    fetchListings();
                    showSnackbar(`Failed to update status: ${error.message}`, "error");
                }
            }
        });
    };

    const handleDelete = (id) => {
        confirm({
            title: "Delete Asset",
            message: "Are you sure you want to delete this asset? This action cannot be undone.",
            isDangerous: true,
            confirmText: "Delete",
        }).then(async (confirmed) => {
            if (confirmed) {
                try {
                    await api.delete(`/assets/${id}`);
                    showSnackbar("Asset deleted successfully", "success");
                    setListings(listings.filter(item => item._id !== id));
                } catch (error) {
                    console.error("Failed to delete asset", error);
                    showSnackbar("Failed to delete asset", "error");
                }
            }
        });
    };

    return (
        <div className="">
            <div className="flex flex-col md:flex-row-reverse gap-8 items-start">
                {/* Filter Sidebar */}
                {isFilterOpen && (
                    <div className="w-full md:w-1/4 flex-shrink-0 transition-all duration-300 ease-in-out block animate-fade-in">
                        <ListingFilter
                            filters={filters}
                            onFilterChange={setFilters}
                            onClear={handleClearFilters}
                            onApply={handleApplyFilters}
                            onClose={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.delete('filter');
                                setSearchParams(newParams);
                            }}
                        />
                    </div>
                )}

                <div className="flex-grow">
                    {loading ? (
                        <ListingsShimmer />
                    ) : (
                        <div className="grid gap-6 animate-fade-in">
                            {listings.length > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{listings.length} listings found</p>
                            )}

                            {listings.map(asset => (
                                <div
                                    key={asset._id}
                                    onClick={() => navigate(`/dashboard/seller/${businessId}/listings/${asset._id}`)}
                                    className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                                        <div className="h-24 w-24 rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 relative transition-colors duration-300">
                                            {asset.images?.[0] ? (
                                                <img src={asset.images[0]} alt={asset.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-zinc-600">
                                                    <FolderOpen size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white bluish:text-white group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-500 transition-colors">
                                                {asset.title}
                                            </h3>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 bluish:text-slate-400 bg-gray-50 dark:bg-zinc-800 bluish:bg-slate-800 px-3 py-1 rounded-lg border border-gray-100 dark:border-zinc-700 bluish:border-slate-700">
                                                <span className="font-semibold text-gray-900 dark:text-gray-200 bluish:text-slate-200">₹{asset.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 bluish:text-slate-400 mt-1">
                                                <span>•</span>
                                                <span>{asset.condition}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 text-xs">
                                                <span className="bg-slate-100 dark:bg-zinc-800 bluish:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1 text-gray-600 dark:text-gray-300 bluish:text-slate-300 transition-colors">
                                                    <Eye size={12} /> {asset.views || 0} views
                                                </span>
                                                <span className="text-gray-400 dark:text-gray-500 bluish:text-slate-500">
                                                    Listed {new Date(asset.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="mt-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${asset.status === 'active'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 bluish:bg-blue-50 bluish:text-blue-700 bluish:border-blue-200 bluish:dark:bg-blue-900/30 bluish:dark:text-blue-300 bluish:dark:border-blue-800'
                                                    : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                                                    } transition-colors duration-300`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${asset.status === 'active' ? 'bg-blue-500 dark:bg-emerald-500' : 'bg-red-500'
                                                        }`}></span>
                                                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                                        {/* Dynamic Actions based on Status */}
                                        {asset.status === 'active' ? (
                                            <button
                                                onClick={() => handleStatusChange(asset._id, 'inactive')}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
                                                title="Deactivate Listing"
                                            >
                                                <PauseCircle size={16} /> <span className="hidden md:inline">Deactivate</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(asset._id, 'active')}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-emerald-900/20 text-blue-600 dark:text-emerald-400 hover:bg-blue-100 dark:hover:bg-emerald-900/40 bluish:bg-blue-50 bluish:dark:bg-blue-900/20 bluish:text-blue-600 bluish:dark:text-blue-400 bluish:hover:bg-blue-100 bluish:dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                                                title="Re-activate Listing"
                                            >
                                                <PlayCircle size={16} /> <span className="hidden md:inline">Activate</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(asset._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 size={16} /> <span className="hidden md:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {listings.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 transition-colors duration-300">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                                        <FolderOpen size={32} />
                                    </div>
                                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">
                                        No listings match your filters
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                        Try adjusting the status or clearing filters.
                                    </p>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={handleClearFilters}
                                            className="px-6 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
                                        >
                                            Clear Filters
                                        </button>
                                        <button
                                            onClick={() => navigate('/post-asset')}
                                            className="px-6 py-2 bg-blue-600 dark:bg-emerald-600 bluish:bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 dark:shadow-emerald-600/30 bluish:shadow-blue-600/30 hover:shadow-xl hover:translate-y-[-2px] transition-all"
                                        >
                                            Post New Asset
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerListings;
