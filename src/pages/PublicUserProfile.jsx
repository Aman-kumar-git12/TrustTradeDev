import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ArrowLeft, Building2, ShieldCheck, ShoppingBag, Medal, Star, Activity, Crown, Zap, TrendingUp, Rocket, DollarSign, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import ProfileShimmer from '../components/shimmers/ProfileShimmer';

const PublicUserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [modalType, setModalType] = useState('all'); // 'trust', 'milestones', 'achievements', 'all'

    const badgeInfo = {
        trust: [
            { label: "Reliability", desc: "How to earn: Maintain consistent and fair interactions across all deal phases, ensuring that your commitments are always fulfilled with integrity." },
            { label: "Performance Activity", desc: "How to earn: Demonstrate high engagement by actively participating in the marketplace and successfully moving inquiries toward closure." },
            { label: "Spending Volume", desc: "How to earn: Establish yourself as a significant market actor by engaging in large-scale transactions and high-value acquisitions." }
        ],
        milestones: [
            { label: "Active Inquirer", icon: Activity, desc: "Requirement: Initiate your first deal or inquiry to start your journey as an active participant." },
            { label: "Verified Trader", icon: ShieldCheck, desc: "Requirement: Earn established platform badges to verify your market presence and commitment." },
            { label: "Market Stalwart", icon: Star, desc: "Requirement: Maintain consistent participation and achieve several successful acquisition milestones." },
            { label: "Elite Veteran", icon: Medal, desc: "Requirement: Demonstrate long-term reliability by unlocking a significant suite of platform badges." },
            { label: "Sentinel of Truth", icon: Crown, desc: "Requirement: Achieve a flawless reputation and perfect scoring through consistent, high-integrity excellence." }
        ],
        achievements: [
            { id: "first_deal", label: "First Deal", icon: ShoppingBag, desc: "How to earn: Successfully finalize your very first acquisition on the TruthTrade platform." },
            { id: "active_buyer", label: "Active Buyer", icon: Zap, desc: "How to earn: Sustain a regular pattern of successful purchases across multiple categories." },
            { id: "negotiation_pro", label: "Negotiation Pro", icon: TrendingUp, desc: "How to earn: Successfully finalize deals through professional price negotiation and mutual compromise." },
            { id: "high_value", label: "High-Value Trader", icon: DollarSign, desc: "How to earn: Successfully execute significant market transactions and high-value strategic acquisitions." },
            { id: "fast_mover", label: "Fast Mover", icon: Rocket, desc: "How to earn: Demonstrate decisive market action by securing separate deals within a brief time frame." }
        ]
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/auth/public/${userId}`);
                setUser(data.user);
                setBusinesses(data.businesses);
            } catch (error) {
                console.error('Failed to fetch user profile', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    if (loading) return <ProfileShimmer />;

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl max-w-lg w-full">
                <User size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-blue-600 dark:bg-emerald-600 text-white rounded-xl font-bold"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-black bluish:bg-[#0a0f1d] selection:bg-blue-500/30 dark:selection:bg-emerald-500/30 bluish:selection:bg-blue-500/30 font-sans transition-colors duration-300 relative z-0 overflow-hidden">
            {/* Dynamic Background Elements - Bluish Theme Only */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden bluish:block">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

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

            {/* Page Background (Standard Modes) */}
            <div className="fixed inset-0 z-0 pointer-events-none bluish:hidden">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-5 dark:opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/90 to-gray-50 dark:from-black dark:via-black/90 dark:to-black"></div>
            </div>

            {/* Header / Cover */}
            <div className="h-60 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6 relative z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="self-start px-4 py-2 bg-black/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/10 hover:bg-black/30 transition-colors flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
                {/* Profile Card - Overlapping Header */}
                <div className="relative -mt-20 mb-12">
                    <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/80 bluish:backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 p-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 transition-all duration-300">
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-zinc-800 p-1.5 shadow-lg border-4 border-white dark:border-zinc-700 -mt-16 md:-mt-24 flex-shrink-0 relative">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.fullName}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                    <User size={64} className="text-gray-300 dark:text-gray-600" />
                                </div>
                            )}
                            {/* Role Badge on Avatar */}
                            <div className={`absolute bottom-2 right-2 p-2 rounded-full border-4 border-white dark:border-zinc-900 ${user.role === 'seller' ? 'bg-blue-500 dark:bg-emerald-500' : 'bg-blue-500 dark:bg-emerald-500'
                                }`}>
                                <ShieldCheck size={16} className="text-white" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.fullName}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center ${user.role === 'seller'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-blue-100 text-blue-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    }`}>
                                    <ShieldCheck size={14} className="mr-1.5" />
                                    {user.role === 'seller' ? 'Verified Seller' : 'Verified Buyer'}
                                </span>
                                {user.role === 'buyer' && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-full">
                                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                            Badges: {user.masteryBadges || 0}
                                        </span>
                                    </div>
                                )}
                                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center font-bold">
                                    <Calendar size={14} className="mr-1.5" />
                                    Joined: {new Date(user.createdAt).getFullYear()}
                                </span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 md:items-end">
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-blue-500 dark:text-emerald-500" />
                                <span>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-blue-500 dark:text-emerald-500" />
                                    <span>{user.phone}</span>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Seller Content: Businesses */}
                {user.role === 'seller' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Building2 className="mr-3 text-blue-500 dark:text-emerald-500" />
                            Businesses by {user.fullName}
                        </h2>

                        {businesses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {businesses.map((business) => (
                                    <Link
                                        to={`/businessdetails/${business._id}`}
                                        key={business._id}
                                        className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/80 bluish:backdrop-blur-md rounded-2xl p-4 shadow-sm hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 bluish:border-white/5 transition-all group hover:-translate-y-1"
                                    >
                                        <div className="aspect-video bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden mb-4 relative">
                                            <img
                                                src={(business.images && business.images.length > 0) ? business.images[0] : 'https://cdn-icons-png.freepik.com/512/1465/1465439.png'}
                                                alt={business.businessName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {business.businessName}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                            {business.description || 'No description available.'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
                                <Building2 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">This seller hasn&apos;t set up any businesses yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Buyer Content */}
                {user.role === 'buyer' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Reputation Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                <ShieldCheck className="mr-3 text-blue-500 dark:text-emerald-500" />
                                Verified Reputation
                            </h2>
                            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/80 bluish:backdrop-blur-md rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm text-center relative">
                                <button
                                    onClick={() => { setModalType('trust'); setShowInfoModal(true); }}
                                    className="absolute top-6 right-6 p-2 text-blue-500 dark:text-emerald-500 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
                                >
                                    <Info size={16} />
                                </button>
                                {user.trustScore !== null ? (
                                    <>
                                        <div className="relative inline-block mb-6">
                                            <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 dark:border-emerald-500/20 flex items-center justify-center relative">
                                                <span className="text-3xl font-black text-gray-900 dark:text-white">{user.trustScore}</span>
                                                <div className="absolute -inset-2 border-2 border-dashed border-blue-500/30 dark:border-emerald-500/30 rounded-full animate-spin-slow" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-blue-500 dark:bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                                                <ShieldCheck size={16} />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 italic">Elite standing</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                            This buyer maintains an exceptional integrity rating on TruthTrade.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-blue-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 dark:text-emerald-500">
                                            <ShoppingBag size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verified Buyer</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {user.fullName} is an active member of our community.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Earned Milestones */}
                        {user.role === 'buyer' && (
                            <div className="lg:col-span-2 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <Medal className="mr-3 text-amber-500" />
                                            Earned Milestones
                                            <span className="ml-3 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-black rounded-full border border-amber-200 dark:border-amber-900/30 shadow-sm">
                                                {[
                                                    { threshold: 100 },
                                                    { countThresh: 10 },
                                                    { countThresh: 5 },
                                                    { countThresh: 3 },
                                                    { countThresh: 1 }
                                                ].filter(m => {
                                                    const earnedByScore = m.threshold && (user.trustScore || 0) >= m.threshold;
                                                    const earnedByCount = m.countThresh && (user.achievements?.length || 0) >= m.countThresh;
                                                    return earnedByScore || earnedByCount;
                                                }).length}
                                            </span>
                                        </h2>
                                        <button
                                            onClick={() => { setModalType('milestones'); setShowInfoModal(true); }}
                                            className="p-1 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <Info size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { countThresh: 1, label: "Active Inquirer", icon: Activity, color: "bg-gray-100 text-gray-600 dark:bg-zinc-900/30 dark:text-gray-400", desc: "Achieve 1 Badge" },
                                            { countThresh: 3, label: "Verified Trader", icon: ShieldCheck, color: "bg-blue-100 text-blue-600 dark:bg-emerald-900/30 dark:text-emerald-400", desc: "Achieve 3 Badges" },
                                            { countThresh: 5, label: "Market Stalwart", icon: Star, color: "bg-blue-100 text-blue-600 dark:bg-emerald-900/30 dark:text-emerald-400", desc: "Achieve 5 Badges" },
                                            { countThresh: 10, label: "Elite Veteran", icon: Medal, color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900/30 dark:text-zinc-400", desc: "Achieve 10 Badges" },
                                            { threshold: 100, label: "Sentinel of Truth", icon: Crown, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", desc: "Trust Score: 100" }
                                        ].filter(m => {
                                            const earnedByScore = m.threshold && (user.trustScore || 0) >= m.threshold;
                                            const earnedByCount = m.countThresh && (user.achievements?.length || 0) >= m.countThresh;
                                            return earnedByScore || earnedByCount;
                                        }).map((m, idx) => (
                                            <div
                                                key={idx}
                                                className="p-5 rounded-[2rem] border bg-white dark:bg-zinc-900 bluish:bg-slate-900/80 bluish:backdrop-blur-md border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${m.color}`}>
                                                        <m.icon size={22} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase tracking-tight text-gray-900 dark:text-white">
                                                            {m.label}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 font-bold">{m.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {(user.achievements?.length || 0) === 0 && (user.trustScore || 0) < 100 && (
                                        <div className="p-8 bg-gray-50 dark:bg-zinc-950/50 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 text-center">
                                            <p className="text-gray-500 text-sm italic">No milestones unlocked yet.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Achievements Shelf */}
                                <div className="space-y-6 pt-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                            <Zap className="mr-3 text-blue-500 dark:text-emerald-500" />
                                            Earned Achievements
                                            <span className="ml-3 px-2 py-0.5 bg-blue-100 dark:bg-emerald-900/30 text-blue-600 dark:text-emerald-400 text-xs font-black rounded-full border border-blue-200 dark:border-emerald-900/30 shadow-sm">
                                                {user.achievements?.length || 0}
                                            </span>
                                        </h2>
                                        <button
                                            onClick={() => { setModalType('achievements'); setShowInfoModal(true); }}
                                            className="p-1 text-blue-500 dark:text-emerald-500 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            <Info size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                                        {[
                                            { id: 'first_deal', label: 'First Deal', icon: ShoppingBag, color: 'text-blue-500 bg-blue-50 dark:text-emerald-500 dark:bg-emerald-900/10' },
                                            { id: 'active_buyer', label: 'Active Buyer', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/10' },
                                            { id: 'negotiation_pro', label: 'Negotiation Pro', icon: TrendingUp, color: 'text-blue-500 bg-blue-50 dark:text-emerald-500 dark:bg-emerald-900/10' },
                                            { id: 'high_value', label: 'High-Value Trader', icon: DollarSign, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' },
                                            { id: 'fast_mover', label: 'Fast Mover', icon: Rocket, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/10' },
                                        ].filter(badge => user.achievements?.some(a => a.id === badge.id))
                                            .map((badge) => (
                                                <div
                                                    key={badge.id}
                                                    className="p-4 rounded-3xl border bg-white dark:bg-zinc-900 bluish:bg-slate-900/80 bluish:backdrop-blur-md border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm transition-all flex flex-col items-center justify-center gap-2"
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.color}`}>
                                                        <badge.icon size={18} />
                                                    </div>
                                                    <p className="font-black text-[10px] uppercase tracking-tight text-gray-900 dark:text-white">
                                                        {badge.label}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                    {(user.achievements?.length || 0) === 0 && (
                                        <div className="p-8 bg-gray-50 dark:bg-zinc-950/50 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 text-center">
                                            <p className="text-gray-500 text-sm italic">No achievements unlocked yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Reputation Intelligence Modal */}
                <AnimatePresence>
                    {showInfoModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowInfoModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-gray-100 dark:border-zinc-800"
                            >
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="absolute top-6 right-6 p-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl text-gray-500 hover:text-red-500 transition-colors z-10"
                                >
                                    <X size={20} />
                                </button>

                                <div className="p-8 md:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-emerald-400">
                                            {modalType === 'trust' ? <ShieldCheck size={28} /> : modalType === 'milestones' ? <Medal size={28} /> : <Zap size={28} />}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                                {modalType === 'trust' ? 'Trust Intel' : modalType === 'milestones' ? 'Milestone Intel' : 'Achievement Intel'}
                                            </h2>
                                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                                                {modalType === 'trust' ? 'How Score is Calculated' : modalType === 'milestones' ? 'How to reach Milestones' : 'How to get Badges'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Trust Explanation */}
                                        {(modalType === 'trust' || modalType === 'all') && (
                                            <section>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
                                                    <ShieldCheck size={16} /> Understanding Trust
                                                </h3>
                                                <div className="grid gap-4">
                                                    {badgeInfo.trust.map((t, idx) => (
                                                        <div key={idx} className="flex gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/50">
                                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-blue-50 dark:text-emerald-500 shadow-sm shrink-0">
                                                                <Star size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-900 dark:text-white text-sm">{t.label}</p>
                                                                <p className="text-xs text-gray-400 leading-relaxed mt-1">{t.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* Milestones Explanation */}
                                        {(modalType === 'milestones' || modalType === 'all') && (
                                            <section>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-6 flex items-center gap-2">
                                                    <Medal size={16} /> Elite Milestones
                                                </h3>
                                                <div className="grid gap-4">
                                                    {badgeInfo.milestones.map((m, idx) => (
                                                        <div key={idx} className="flex gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/50">
                                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                                                                <m.icon size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-900 dark:text-white text-sm">{m.label}</p>
                                                                <p className="text-xs text-gray-400 leading-relaxed mt-1">{m.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* Achievements Explanation */}
                                        {(modalType === 'achievements' || modalType === 'all') && (
                                            <section>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
                                                    <Zap size={16} /> Achievement Quests
                                                </h3>
                                                <div className="grid gap-4">
                                                    {badgeInfo.achievements.map((a, idx) => (
                                                        <div key={idx} className="flex gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/50">
                                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-blue-50 dark:text-emerald-500 shadow-sm shrink-0">
                                                                <a.icon size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-900 dark:text-white text-sm">{a.label}</p>
                                                                <p className="text-xs text-gray-400 leading-relaxed mt-1">{a.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PublicUserProfile;
