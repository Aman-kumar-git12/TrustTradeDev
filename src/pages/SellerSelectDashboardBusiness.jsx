import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowRight, Briefcase, MapPin, Tag, ShoppingBag, BarChart2, TrendingUp, Filter } from 'lucide-react';
import api from '../utils/api';
import DashboardSelectionShimmer from '../components/shimmers/DashboardSelectionShimmer';

const SellerSelectDashboardBusiness = () => {
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

    if (loading) return <DashboardSelectionShimmer />;

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

            <div className="max-w-7xl mx-auto relative z-10">
                {businesses.length === 0 ? (
                    <>
                        {/* Header Section for Empty State (Commands Center Style) */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white bluish:text-white tracking-tight mb-2 bluish:drop-shadow-lg transition-colors duration-300">Seller Hub</h1>
                                <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 font-semibold text-sm md:text-base transition-colors duration-300">Manage your businesses, track leads, and optimize your listings.</p>
                            </div>
                        </div>

                        {/* Navigation Hub & Actions (Matching Buyer Experience) */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                            <div className="w-full lg:w-fit overflow-x-auto custom-scrollbar-hide flex p-1 bg-gray-100 dark:bg-zinc-900 bluish:bg-[#1e293b]/50 rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/5 relative no-scrollbar">
                                <div className="flex min-w-max">
                                    {[
                                        { icon: Tag, label: 'Incoming Leads', count: 0, active: true },
                                        { icon: ShoppingBag, label: 'My Listings', count: 0 },
                                        { icon: BarChart2, label: 'Overview' }
                                    ].map((tab, idx) => (
                                        <div
                                            key={idx}
                                            className="relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center z-10 cursor-default"
                                        >
                                            {tab.active && (
                                                <div className="absolute inset-0 bg-white dark:bg-zinc-800 bluish:bg-blue-500/20 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 bluish:border-blue-500/20" />
                                            )}
                                            <span className={`relative flex items-center z-20 whitespace-nowrap ${tab.active ? 'text-blue-600 dark:text-emerald-400 bluish:text-blue-400' : 'text-gray-400 dark:text-zinc-600'}`}>
                                                <tab.icon size={16} className="mr-2" />
                                                {tab.label}
                                                {tab.count !== undefined && (
                                                    <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md ${tab.active ? 'bg-blue-100 dark:bg-emerald-900/30 bluish:bg-blue-500/20' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full lg:w-fit">
                                <div className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 bg-white/50 dark:bg-zinc-900/50 text-gray-400 dark:text-zinc-600 font-bold text-sm cursor-not-allowed">
                                    <TrendingUp size={18} className="mr-2 opacity-50" />
                                    <span className="whitespace-nowrap">View Insights</span>
                                </div>
                                <div className="flex-1 lg:flex-none flex items-center justify-center px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 bg-white/50 dark:bg-zinc-900/50 text-gray-400 dark:text-zinc-600 font-bold text-sm cursor-not-allowed">
                                    <Filter size={18} className="mr-2 opacity-50" />
                                    <span className="whitespace-nowrap">Show Filters</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 dark:bg-emerald-900/30 dark:text-emerald-400 bluish:bg-blue-500/10 bluish:text-blue-400 bluish:border-blue-500/20 border border-blue-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 bluish:shadow-[0_0_15px_rgba(59,130,246,0.3)] bluish:backdrop-blur-sm transition-colors">
                            Seller Workspace
                        </span>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white bluish:text-white mb-3 tracking-tight transition-colors duration-300">Select Business Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 text-lg max-w-2xl mx-auto transition-colors duration-300">Choose a business entity to view its performance, leads, and manage its listings.</p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Business List */}
                    {businesses.map((business) => (
                        <div
                            key={business._id}
                            onClick={() => navigate(`/dashboard/seller/${business._id}/leads`)}
                            className="group bg-white dark:bg-zinc-900 bluish:bg-gradient-to-bl bluish:from-[#1e293b] bluish:to-[#0f172a] rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 dark:hover:shadow-emerald-900/20 bluish:hover:shadow-blue-900/20 border border-gray-100 dark:border-zinc-800 bluish:border-white/5 bluish:hover:border-blue-500/50 p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden h-full"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-emerald-500 dark:to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bluish:from-blue-500 bluish:to-indigo-400"></div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="h-16 w-16 bg-slate-100 dark:bg-zinc-800 bluish:bg-[#1e293b] rounded-xl overflow-hidden shadow-inner flex items-center justify-center transition-colors">
                                    <img
                                        src={(business.images && business.images.length > 0) ? business.images[0] : 'https://cdn-icons-png.freepik.com/512/1465/1465439.png'}
                                        alt={business.businessName}
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                    />
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-zinc-800 bluish:bg-white/5 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-emerald-500 bluish:group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 border border-gray-100 dark:border-zinc-700 bluish:border-white/10 dark:text-gray-400 bluish:text-gray-400">
                                    <ArrowRight size={16} />
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors">{business.businessName}</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 bluish:text-gray-400 text-sm transition-colors">
                                        <Briefcase size={14} className="mr-2 text-gray-400 dark:text-gray-500 bluish:text-blue-500/70" />
                                        <span className="truncate">{business.industry || 'No Industry'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400 bluish:text-gray-400 text-sm transition-colors">
                                        <MapPin size={14} className="mr-2 text-gray-400 dark:text-gray-500 bluish:text-blue-500/70" />
                                        <span className="truncate">{business.location?.city || 'No Location'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800 bluish:border-white/5 flex items-center justify-between transition-colors duration-300">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bluish:text-gray-500 uppercase tracking-wider">Launch Dashboard</span>
                                <span className="text-xs font-medium text-blue-600 dark:text-emerald-400 bluish:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    Open &rarr;
                                </span>
                            </div>
                        </div>
                    ))}

                    {businesses.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:col-span-2 lg:col-span-3"
                        >
                            <div className="bg-white/60 dark:bg-zinc-900/40 bluish:bg-[#1e293b]/30 backdrop-blur-3xl rounded-[2.5rem] border border-dashed border-gray-300 dark:border-zinc-800 bluish:border-blue-500/20 p-12 sm:p-20 text-center shadow-2xl shadow-blue-500/5 relative overflow-hidden group">
                                {/* Decorative Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 bluish:bg-blue-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>

                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800/80 dark:to-zinc-900/80 bluish:from-blue-500/10 bluish:to-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-gray-400 dark:text-zinc-500 bluish:text-blue-400/70 border border-gray-100 dark:border-zinc-800 bluish:border-blue-500/20 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <Building2 size={48} strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white bluish:text-white mb-4 tracking-tight">
                                        No businesses established
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 mb-10 max-w-md mx-auto text-lg font-medium leading-relaxed">
                                        To start selling, you'll need to create your first business profile. It only takes a minute to set up your digital storefront.
                                    </p>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button
                                            onClick={() => navigate('/my-businesses')}
                                            className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-emerald-600 dark:to-emerald-500 bluish:from-blue-600 bluish:to-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-500/25 dark:shadow-emerald-500/20 bluish:shadow-blue-500/30 hover:shadow-blue-500/50 dark:hover:shadow-emerald-500/40 bluish:hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 text-base tracking-wide"
                                        >
                                            Establish Business
                                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} strokeWidth={2.5} />
                                        </button>

                                        <button
                                            onClick={() => navigate('/dashboard/interests')}
                                            className="group inline-flex items-center px-10 py-4 bg-white dark:bg-zinc-800 bluish:bg-white/5 text-gray-700 dark:text-white bluish:text-blue-200 rounded-2xl font-black transition-all border border-gray-200 dark:border-zinc-800 bluish:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-700 bluish:hover:bg-white/10 hover:-translate-y-1 active:scale-95 text-base tracking-wide"
                                        >
                                            <ShoppingBag className="mr-2 group-hover:-rotate-12 transition-transform" size={20} strokeWidth={2.5} />
                                            Buying Hub
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerSelectDashboardBusiness;
