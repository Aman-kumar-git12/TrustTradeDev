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
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] font-sans">
            <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 border-b border-gray-200 dark:border-zinc-800 bluish:border-white/5 py-6 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse"></div>
                    <div className="h-8 w-32 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <GridShimmer />
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] selection:bg-blue-500/30 dark:selection:bg-emerald-500/30 bluish:selection:bg-blue-500/30 font-sans transition-colors duration-300 relative z-0 overflow-hidden">
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
                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 bluish:border-white/5 py-6 px-4 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bluish:text-slate-400 bluish:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} className="mr-2" /> Back to Business
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white truncate max-w-md">
                            {business?.businessName ? `Listings by ${business.businessName}` : 'Business Listings'}
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {assets.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 bluish:bg-slate-900/50 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 backdrop-blur-sm">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 bluish:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 bluish:text-slate-500">
                                <ShoppingBag size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2">No Active Listings</h2>
                            <p className="text-gray-500 dark:text-gray-400 bluish:text-slate-400">This business currently has no assets listed for sale.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {assets.map((asset) => (
                                <div
                                    key={asset._id}
                                    onClick={() => navigate(`/assets/${asset._id}`)}
                                    className="bg-white dark:bg-zinc-900 bluish:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 bluish:hover:shadow-blue-900/10 border border-gray-100 dark:border-zinc-800 bluish:border-white/5 overflow-hidden cursor-pointer group transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-800 bluish:bg-slate-800 relative overflow-hidden">
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
                                            <h3 className="font-bold text-gray-900 dark:text-white bluish:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors">
                                                {asset.title}
                                            </h3>
                                            <span className="text-sm font-bold text-blue-600 dark:text-emerald-400 bluish:text-blue-400">
                                                ${asset.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bluish:text-slate-400 mb-3">
                                            <Tag size={12} className="mr-1" />
                                            {asset.category}
                                        </div>
                                        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex items-center text-xs text-gray-400 bluish:text-slate-500">
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
        </div>
    );
};

export default PublicBusinessListings;
