import { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, PauseCircle, PlayCircle, FolderOpen } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import ListingFilter from '../components/ListingFilter';

const SellerListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isFilterOpen, businessId } = useOutletContext();
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

    const fetchListings = async () => {
        if (!businessId) return;
        setLoading(true);
        try {
            // Construct query params from filters state
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
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

    // Debounce search effect (optional, or rely on Apply button)
    // Here we'll stick to 'Apply' button for expensive filters, but maybe search is instant?
    // LeadFilter checks on mount. Let's trigger on mount.
    // However, the user might expect live search. Let's make search live via debounce, but other filters via 'Apply'?
    // SellerLeads example uses `handleApplyFilters`. Let's follow that pattern for consistency.

    useEffect(() => {
        fetchListings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId]);

    const handleApplyFilters = () => {
        fetchListings();
    };

    const handleClearFilters = () => {
        setFilters({ search: '', status: '', category: '', minPrice: '', maxPrice: '' });
        // Trigger fetch with empty filters immediately
        api.get(`/dashboard/business/${businessId}/assets`).then(res => setListings(res.data));
    };

    // Auto-clear filters when sidebar is closed
    useEffect(() => {
        if (!isFilterOpen) {
            handleClearFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFilterOpen]);

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
                    // console.log("frontend is doing their work plss wait ")
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
            <div className="flex flex-col md:flex-row-reverse gap-8 align-top">
                {/* Filter Sidebar */}
                {isFilterOpen && (
                    <div className="w-full md:w-1/4 flex-shrink-0 transition-all duration-300 ease-in-out block animate-fade-in">
                        <ListingFilter
                            filters={filters}
                            onFilterChange={setFilters}
                            onClear={handleClearFilters}
                            onApply={handleApplyFilters}
                            onClose={() => navigate(`/dashboard/seller/${businessId}/listings`)}
                        />
                    </div>
                )}

                <div className="flex-grow">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-3"></div>
                            <p className="text-gray-500">Loading your assets...</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 animate-fade-in">
                            {listings.length > 0 && (
                                <p className="text-sm text-gray-500 mb-2">{listings.length} listings found</p>
                            )}

                            {listings.map(asset => (
                                <div
                                    key={asset._id}
                                    onClick={() => navigate(`/dashboard/seller/${businessId}/listings/${asset._id}`)}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                                        <div className="h-24 w-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                            {asset.images?.[0] ? (
                                                <img src={asset.images[0]} alt={asset.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <FolderOpen size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                                                {asset.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span className="font-semibold text-gray-900">${asset.price.toLocaleString()}</span>
                                                <span>•</span>
                                                <span>{asset.condition}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 text-xs">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 text-gray-600">
                                                    <Eye size={12} /> {asset.views || 0} views
                                                </span>
                                                <span className="text-gray-400">
                                                    Listed {new Date(asset.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="mt-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${asset.status === 'active'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-red-50 text-red-600 border-red-200'
                                                    }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${asset.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
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
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
                                                title="Deactivate Listing"
                                            >
                                                <PauseCircle size={16} /> <span className="hidden md:inline">Deactivate</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(asset._id, 'active')}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                                                title="Re-activate Listing"
                                            >
                                                <PlayCircle size={16} /> <span className="hidden md:inline">Activate</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(asset._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 size={16} /> <span className="hidden md:inline">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {listings.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <FolderOpen size={32} />
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-lg mb-1">
                                        No listings match your filters
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        Try adjusting the status or clearing filters.
                                    </p>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={handleClearFilters}
                                            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                                        >
                                            Clear Filters
                                        </button>
                                        {/* Only show 'Post New' if we are not deep filtering, or just always show it? Always good to show. */}
                                        <button
                                            onClick={() => navigate('/post-asset')}
                                            className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:translate-y-[-2px] transition-all"
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
