import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, MapPin, Tag } from 'lucide-react';
import api from '../utils/api';
import GridShimmer from '../components/shimmers/GridShimmer';

const PublicBusinessListings = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetsRes, businessRes] = await Promise.all([
                    api.get(`/businesses/${businessId}/assets`),
                    api.get(`/businesses/${businessId}`)
                ]);
                setAssets(assetsRes.data);
                setBusiness(businessRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        if (businessId) {
            fetchData();
        }
    }, [businessId]);

    if (loading) return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 font-sans">
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-6 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                    <div className="h-8 w-32 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <GridShimmer />
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-300 relative z-0">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 py-6 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Business
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-md">
                        {business?.businessName ? `Listings by ${business.businessName}` : 'Business Listings'}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {assets.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Listings</h2>
                        <p className="text-gray-500 dark:text-gray-400">This business currently has no assets listed for sale.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {assets.map((asset) => (
                            <div
                                key={asset._id}
                                onClick={() => navigate(`/assets/${asset._id}`)}
                                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 border border-gray-100 dark:border-zinc-800 overflow-hidden cursor-pointer group transition-all duration-300"
                            >
                                <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                                    <img
                                        src={asset.images[0]}
                                        alt={asset.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                                        {asset.condition}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {asset.title}
                                        </h3>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            ${asset.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <Tag size={12} className="mr-1" />
                                        {asset.category}
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center text-xs text-gray-400">
                                        <MapPin size={12} className="mr-1" />
                                        <span className="truncate">{asset.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicBusinessListings;
