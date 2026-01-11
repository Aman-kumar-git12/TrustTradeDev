import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Briefcase, MapPin } from 'lucide-react';
import api from '../utils/api';

const SellerSelectBusinessPost = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const { data } = await api.get('/businesses');
                setBusinesses(data);
            } catch (error) {
                console.error('Failed to fetch businesses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBusinesses();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-emerald-500 bluish:border-blue-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 font-medium">Loading your businesses...</p>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Dynamic Background Elements - Bluish Theme Only */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden bluish:block">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

                {/* Background Image & Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1555449363-15a32002dd2e?q=80&w=2546&auto=format&fit=crop"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1d] via-[#0a0f1d]/95 to-[#0f1629]"></div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 dark:bg-emerald-900/30 dark:text-emerald-400 bluish:bg-blue-500/10 bluish:text-blue-400 bluish:border-blue-500/20 border border-blue-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 bluish:shadow-[0_0_15px_rgba(59,130,246,0.3)] bluish:backdrop-blur-sm">
                        Seller Dashboard
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white bluish:text-white mb-3 tracking-tight transition-colors duration-300 bluish:drop-shadow-lg">Post a New Asset</h1>
                    <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 text-lg max-w-2xl mx-auto transition-colors duration-300 font-light">Select the business entity you want to list this asset under.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Business List */}
                    {businesses.map((business) => (
                        <div
                            key={business._id}
                            onClick={() => navigate(`/post-assets/${business._id}`)}
                            className="group bg-white dark:bg-zinc-900 bluish:bg-gradient-to-bl bluish:from-[#1e293b] bluish:to-[#0f172a] rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 dark:hover:shadow-blue-900/20 bluish:hover:shadow-blue-900/20 border border-gray-100 dark:border-zinc-800 bluish:border-white/5 bluish:hover:border-blue-500/50 p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden h-full"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-emerald-500 dark:to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bluish:from-blue-500 bluish:to-indigo-400"></div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="h-16 w-16 bg-slate-100 dark:bg-zinc-800 bluish:bg-[#1e293b] rounded-xl overflow-hidden shadow-inner flex items-center justify-center transition-colors duration-300 bluish:border bluish:border-white/5">
                                    <img
                                        src={(business.images && business.images.length > 0) ? business.images[0] : 'https://cdn-icons-png.freepik.com/512/1465/1465439.png'}
                                        alt={business.businessName}
                                        className="w-full h-full object-cover bluish:opacity-90 bluish:group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-zinc-800 bluish:bg-white/5 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-emerald-500 bluish:group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 border border-gray-100 dark:border-zinc-700 bluish:border-white/10 dark:text-gray-400 bluish:text-gray-400">
                                    <ArrowRight size={16} />
                                </div>
                            </div>

                            <div className="flex-grow relative z-10">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors">{business.businessName}</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 bluish:text-gray-400 text-sm">
                                        <Briefcase size={14} className="mr-2 text-gray-400 dark:text-gray-500 bluish:text-blue-500/70" />
                                        <span className="truncate">{business.industry || 'No Industry'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 bluish:text-gray-400 text-sm">
                                        <MapPin size={14} className="mr-2 text-gray-400 dark:text-gray-500 bluish:text-blue-500/70" />
                                        <span className="truncate">{business.location?.city || 'No Location'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800 bluish:border-white/5 flex items-center justify-between transition-colors duration-300 relative z-10">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bluish:text-gray-500 uppercase tracking-wider">Select & Post</span>
                                <span className="text-xs font-medium text-blue-600 dark:text-emerald-400 bluish:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    Proceed &rarr;
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Create New */}
                    {businesses.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3">
                            <div className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/80 bluish:backdrop-blur-md rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-700 bluish:border-white/10 p-12 text-center flex flex-col items-center transition-colors duration-300">
                                <div className="w-20 h-20 bg-blue-50 dark:bg-emerald-900/10 bluish:bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                                    <Building2 size={40} className="text-blue-600 dark:text-emerald-400 bluish:text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2">No Businesses Found</h3>
                                <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 mb-8 max-w-md mx-auto">
                                    You need to establish a business profile before you can list assets on the marketplace.
                                </p>
                                <button
                                    onClick={() => navigate('/my-businesses')}
                                    className="bg-blue-600 dark:bg-emerald-600 bluish:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/30 dark:shadow-emerald-600/30 bluish:shadow-blue-600/30 hover:shadow-blue-600/50 dark:hover:shadow-emerald-600/50 bluish:hover:shadow-blue-600/50 hover:bg-blue-700 dark:hover:bg-emerald-700 bluish:hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                                >
                                    Create Your First Business
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerSelectBusinessPost;
