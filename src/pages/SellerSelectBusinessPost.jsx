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
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your businesses...</p>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                        Seller Dashboard
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight transition-colors duration-300">Post a New Asset</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto transition-colors duration-300">Select the business entity you want to list this asset under.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Business List */}
                    {businesses.map((business) => (
                        <div
                            key={business._id}
                            onClick={() => navigate(`/post-assets/${business._id}`)}
                            className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-emerald-900/10 dark:hover:shadow-emerald-900/20 border border-gray-100 dark:border-zinc-800 p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="h-16 w-16 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center transition-colors duration-300">
                                    <img
                                        src={(business.images && business.images.length > 0) ? business.images[0] : 'https://cdn-icons-png.freepik.com/512/1465/1465439.png'}
                                        alt={business.businessName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 border border-gray-100 dark:border-zinc-700 dark:text-gray-400">
                                    <ArrowRight size={16} />
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{business.businessName}</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                        <Briefcase size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                                        <span className="truncate">{business.industry || 'No Industry'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                        <MapPin size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
                                        <span className="truncate">{business.location?.city || 'No Location'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between transition-colors duration-300">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Select & Post</span>
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    Proceed &rarr;
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Create New */}
                    {businesses.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-700 p-12 text-center flex flex-col items-center transition-colors duration-300">
                                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-full flex items-center justify-center mb-6">
                                    <Building2 size={40} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Businesses Found</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    You need to establish a business profile before you can list assets on the marketplace.
                                </p>
                                <button
                                    onClick={() => navigate('/my-businesses')}
                                    className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5"
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
