import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, TrendingUp, Clock, Star, Award, Zap, ShieldCheck, Globe, ChevronRight, ChevronLeft, Sparkles, Building2 } from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';

const Home = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        topMarket: null,
        trendingAssets: [],
        newArrivals: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeStats = async () => {
            try {
                const { data } = await api.get('/home/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch home stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1d] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-emerald-500 bluish:border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-blue-500/30 pb-20 overflow-x-hidden relative transition-colors duration-300 bluish:bg-[#0a0f1d]">
            {/* Page Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-5 dark:opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/90 to-gray-50 dark:from-black dark:via-black/90 dark:to-black bluish:from-[#0a0f1d] bluish:via-[#0a0f1d]/90 bluish:to-[#0a0f1d]"></div>
            </div>

            {/* 1. Hero / Billboard (Netflix Style) */}
            <div className="relative h-[75vh] w-full overflow-hidden group z-10">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-80 dark:opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/40 to-transparent dark:from-black dark:via-black/40 dark:to-transparent bluish:from-[#0a0f1d] bluish:via-[#0a0f1d]/40 bluish:to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent bluish:from-[#0a0f1d] bluish:via-transparent bluish:to-transparent"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-12 max-w-4xl pt-20">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 animate-fade-in flex items-center space-x-3"
                    >
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg shadow-red-600/20 tracking-wider">FEATURED EVENT</span>
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-emerald-400 bluish:text-blue-400 font-bold border-l border-gray-300 dark:border-white/20 pl-3">
                            <Clock className="w-4 h-4" />
                            <span className="uppercase tracking-widest text-sm">Industrial Robotics Auction</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl text-gray-900 dark:text-white"
                    >
                        Global Industrial
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 dark:from-emerald-400 dark:to-emerald-600 bluish:from-blue-400 bluish:to-indigo-400">Liquidation Event</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl text-shadow-sm font-light leading-relaxed"
                    >
                        Access exclusive heavy machinery, IT infrastructure, and fleet vehicles directly from top enterprises.
                    </motion.p>

                    <div className="flex gap-4">
                        <Link to="/marketplace" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-emerald-600 dark:to-emerald-500 bluish:from-blue-700 bluish:to-indigo-800 text-white rounded-full font-bold text-lg transition-all flex items-center shadow-[0_0_20px_rgba(16,185,129,0.3)] dark:shadow-[0_0_20px_rgba(16,185,129,0.3)] bluish:shadow-[0_0_20px_rgba(30,58,138,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] bluish:hover:shadow-[0_0_30px_rgba(30,58,138,0.6)] hover:scale-105 active:scale-95">
                            <Zap className="fill-current w-5 h-5 mr-2" /> Explore Marketplace
                        </Link>
                        {user && user.role === 'seller' && (
                            <Link
                                to='/dashboard/seller'
                                className="px-8 py-4 bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full font-bold text-lg transition-all flex items-center shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 backdrop-blur-sm"
                            >
                                My Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative bg-white dark:bg-black dark:bg-gradient-to-r dark:from-blue-900/10 dark:to-teal-900/10 bluish:bg-[#0a0f1d] border-y border-gray-200 dark:border-white/5 py-10 overflow-hidden shadow-sm dark:shadow-none">
                <div className="flex animate-marquee whitespace-nowrap min-w-full">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 px-6 flex-shrink-0">
                            <MarqueeItem icon={<ShieldCheck />} text="Bank-Grade Escrow Protection" />
                            <MarqueeItem icon={<Globe />} text="Global Logistics Support" />
                            <MarqueeItem icon={<Award />} text="Verified Business Sellers Only" />
                            <MarqueeItem icon={<Zap />} text="Instant AI Valuations" />
                            <MarqueeItem icon={<Clock />} text="24/7 Deal Support" />
                        </div>
                    ))}
                </div>
                {/* Fade edges - Dynamic for Light (White) and Dark (Black) */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-black dark:to-transparent bluish:from-[#0a0f1d] bluish:to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-black dark:to-transparent bluish:from-[#0a0f1d] bluish:to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* 3. Top Market Leader Section (Moved Up) */}
            {stats.topMarket && (
                <div className="px-4 sm:px-6 lg:px-12 py-12">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 bluish:text-slate-200 mb-4 px-1 drop-shadow-md">Market Leader of the Month</h2>
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-950 bluish:from-slate-800 bluish:to-slate-950 border border-gray-200 dark:border-white/10 bluish:border-slate-700 p-8 md:p-12 flex items-center justify-between group cursor-pointer  transition-all shadow-xl dark:shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 dark:opacity-20"></div>
                        <div className="relative z-10">
                            <div className="text-blue-600 dark:text-emerald-400 bluish:text-blue-400 font-bold tracking-widest uppercase text-sm mb-2">Highest Revenue Generator</div>
                            <h3 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2">{stats.topMarket.name}</h3>
                            <p className="text-gray-600 dark:text-white flex items-center mb-6">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                                Verified Top Seller
                            </p>
                            {/* Link to Business Details if exists, otherwise potentially User Profile (or disable) */}
                            {stats.topMarket._id ? (
                                <Link
                                    to={`/businessdetails/${stats.topMarket._id}`}
                                    className="inline-flex items-center px-6 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-blue-600/10 dark:hover:bg-emerald-600/20 bluish:hover:bg-blue-600/20 text-blue-600 dark:text-emerald-100 bluish:text-blue-100 hover:text-blue-700 dark:hover:text-emerald-300 bluish:hover:text-blue-300 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-emerald-500/50 bluish:hover:border-blue-500/50 rounded-lg font-bold transition-all backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] bluish:hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-500"
                                >
                                    View Business <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            ) : (
                                <Link
                                    to={`/user/${stats.topMarket.sellerId}`}
                                    className="inline-flex items-center px-6 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-blue-600/10 dark:hover:bg-emerald-600/20 bluish:hover:bg-blue-600/20 text-blue-600 dark:text-emerald-100 bluish:text-blue-100 hover:text-blue-700 dark:hover:text-emerald-300 bluish:hover:text-blue-300 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-emerald-500/50 bluish:hover:border-blue-500/50 rounded-lg font-bold transition-all backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] bluish:hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-500"
                                >
                                    View Seller Profile <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            )}
                        </div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500/30 dark:border-emerald-500/30 flex items-center justify-center bg-blue-500/10 dark:bg-emerald-500/10 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.3)] dark:shadow-[0_0_50px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
                                <Award className="w-12 h-12 md:w-16 md:h-16 text-blue-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Content Sections */}
            <div className="space-y-20 px-4 sm:px-6 lg:px-12 mt-8 relative z-20 pb-20">

                {stats.trendingAssets.length > 0 && (
                    <ProductSection
                        title="Trending Now"
                        items={stats.trendingAssets}
                        badge={{ text: "Hot", icon: <TrendingUp className="w-3 h-3 text-white" /> }}
                    />
                )}

                {stats.newArrivals.length > 0 && (
                    <ProductSection
                        title="New Arrivals"
                        items={stats.newArrivals}
                        badge={{ text: "New", icon: <Zap className="w-3 h-3 text-white" /> }}
                    />
                )}

                {/* 5. CTA / Interstitial Image Section */}
                <div className="rounded-2xl overflow-hidden relative h-[350px] flex items-center justify-center text-center mt-12 group shadow-2xl shadow-black/10 dark:shadow-black/50 border border-transparent dark:border-white/5 bluish:border-blue-500/20 transition-all duration-300">

                    {/* Light Mode Background: Role Based */}
                    <img
                        src={user && user.role && user.role.toLowerCase() === 'seller'
                            ? "https://images.unsplash.com/photo-1565514020176-db79339a6a5d?q=80&w=2070&auto=format&fit=crop" // Industrial/Warehouse
                            : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" // Corporate/Tech
                        }
                        className="absolute inset-0 w-full h-full object-cover opacity-40 dark:hidden group-hover:scale-105 transition-transform duration-1000"
                        alt="CTA Background Light"
                    />

                    {/* Dark Mode Background: Solid Dark Theme Color + Gradient (No Image) */}
                    <div className="absolute inset-0 hidden dark:block bg-zinc-950 bluish:bg-[#0a0f1d] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 dark:from-emerald-900/10 via-transparent to-transparent bluish:from-blue-900/10 bluish:via-transparent bluish:to-transparent"></div>
                    <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-zinc-900/40 dark:from-emerald-900/20 to-black/40 bluish:from-[#0a0f1d]/60 bluish:to-black/60"></div>

                    {/* Subtle Pattern Overlay for Depth (Optional, keeps it interesting but blue) */}
                    <div className="absolute inset-0 hidden dark:block opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                    {/* Overlay: White Fade for Light Mode */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-white/90 dark:hidden mix-blend-normal"></div>

                    <div className="relative z-10 p-8 max-w-2xl">
                        {user && user.role && user.role.toLowerCase() === 'seller' ? (
                            <>
                                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">Ready to liquidize assets?</h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 drop-shadow-sm dark:drop-shadow-md">List your surplus industrial assets and connect with thousands of verified buyers.</p>
                                <Link to="/post-asset" className="inline-flex px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 bluish:from-blue-700 bluish:to-indigo-800 text-white rounded-lg font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] bluish:hover:shadow-[0_0_20px_rgba(30,58,138,0.5)] hover:scale-105 transition-all active:scale-95 border border-transparent dark:border-white/10 shadow-lg">
                                    Post Asset
                                </Link>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">Can&apos;t find what you need?</h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 drop-shadow-sm dark:drop-shadow-md">Post a generic buy request and let sellers come to you.</p>
                                <Link to={user ? "/dashboard/buyer" : "/login"} className="inline-flex px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-emerald-600 dark:to-emerald-500 bluish:from-blue-700 bluish:to-indigo-800 text-white rounded-lg font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] bluish:hover:shadow-[0_0_20px_rgba(30,58,138,0.5)] hover:scale-105 transition-all active:scale-95 border border-transparent dark:border-white/10 shadow-lg">
                                    Create Buy Request
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

// --- Components ---

const MarqueeItem = ({ icon, text }) => (
    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 font-medium text-lg">
        <span className="text-blue-600 dark:text-emerald-500 bluish:text-blue-500">{icon}</span>
        <span>{text}</span>
    </div>
);

const ProductCard = ({ item, badge }) => (
    <Tilt options={{ max: 10, scale: 1.02, speed: 400, glare: true, 'max-glare': 0.05 }} style={{ height: '100%' }}>
        <Link to={`/assets/${item._id || item.id}`} className="group block bg-white dark:bg-[#141414] bluish:bg-[#1e293b] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 bluish:border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 h-full flex flex-col transform-style-3d">
            {/* Image Container */}
            <div className="aspect-[4/3] relative overflow-hidden transform-style-3d">
                <img
                    src={item.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={item.title}
                    className="w-full h-full object-cover transform-z-20"
                />
                {/* Subtle gradient only for depth, not for text overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 dark:bg-emerald-600 border border-blue-500 dark:border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] px-3 py-1 rounded-full flex items-center gap-1.5 z-10 transform-z-30">
                    {badge.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">{badge.text}</span>
                </div>
            </div>

            {/* Details Container - Below Image */}
            <div className="p-4 flex flex-col flex-grow bg-white dark:bg-[#141414] bluish:bg-[#1e293b] group-hover:bg-gray-50 dark:group-hover:bg-[#1a1a1a] bluish:group-hover:bg-[#0a0f1d] transition-colors transform-style-3d">
                <h3 className="text-gray-900 dark:text-white bluish:text-white font-bold text-lg line-clamp-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors transform-z-20">{item.title}</h3>

                <div className="flex justify-between items-center text-sm mb-4 transform-z-10">
                    <span className="text-blue-600 dark:text-blue-400 bluish:text-blue-400 font-bold text-xl">${item.price?.toLocaleString()}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded"><Clock className="w-3 h-3" /> 2h left</span>
                </div>

                {/* Action Buttons - Static/Always visible or transition in */}
                <div className="grid grid-cols-4 gap-2 mt-auto transform-z-20">
                    <button className="col-span-3 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-emerald-600 dark:to-emerald-500 bluish:from-blue-700 bluish:to-indigo-800 text-white hover:from-blue-500 hover:to-teal-500 dark:hover:from-emerald-500 dark:hover:to-emerald-400 bluish:hover:from-blue-600 bluish:hover:to-indigo-700 py-2 rounded font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-lg shadow-blue-900/20 dark:shadow-emerald-900/20 bluish:shadow-blue-900/20 hover:shadow-blue-500/30 dark:hover:shadow-emerald-500/30 bluish:hover:shadow-blue-900/40 active:scale-95">
                        Place Bid
                    </button>
                    <button className="col-span-1 border border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white dark:hover:text-emerald-400 text-gray-600 dark:text-white rounded flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-white/10 active:scale-95"><TrendingUp size={16} /></button>
                </div>
            </div>
        </Link>
    </Tilt>
);

const ProductSection = ({ title, items, badge }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bluish:from-white bluish:to-slate-400">{title}</span>
                <ChevronRight className="text-gray-600 dark:text-gray-400 bluish:text-slate-500" />
            </h2>
        </div>

        {/* Responsive Layout: Scrollable on mobile/tablet, Grid on Desktop */}
        <div className="flex overflow-x-auto snap-x scrollbar-hide pb-4 gap-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
            {items.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex-none w-[280px] snap-center lg:w-auto">
                    <ProductCard item={item} badge={badge} />
                </div>
            ))}
        </div>
    </div>
);

export default Home;
