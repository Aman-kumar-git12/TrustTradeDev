import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import {
    DollarSign, ShoppingBag, TrendingUp, ArrowLeft, Percent, Wallet,
    ShieldCheck, Activity, Award, Calendar, ChevronRight, Info,
    Zap, X, Target, Rocket, Star, Medal, Crown, ShieldAlert,
    CheckCircle2, Download, Share2
} from 'lucide-react';
import KPICard from '../components/KPICard';
import BuyerInsightsShimmer from '../components/shimmers/BuyerInsightsShimmer';
// ... (keep other imports)

const chartColors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6'
};

const timeRangeLabels = {
    '24h': 'Last 24 Hours',
    '15d': 'Last 15 Days',
    '1m': 'Last Month',
    '1y': 'Last Year',
    'all': 'All Time'
};

const eduContent = [
    { title: 'Consistent Activity', color: 'blue', icon: Activity, desc: 'Maintain regular browsing and purchasing habits to show reliability.', boost: '+5 pts' },
    { title: 'Verified Identity', color: 'indigo', icon: ShieldCheck, desc: 'Complete all identity verification steps (ID, Phone, Email).', boost: '+10 pts' },
    { title: 'Positive Interactions', color: 'amber', icon: Star, desc: 'Receive 5-star ratings from sellers on your communications.', boost: '+15 pts' },
    { title: 'High Value Orders', color: 'blue', icon: Wallet, desc: 'Complete orders over $10k securely via platform escrow.', boost: '+8 pts' }
];

const getMilestoneBadge = (score, achievements) => {
    if (score >= 90) return { label: "Sentinel of Truth", color: "from-amber-400 to-yellow-600", text: "white", shadow: "shadow-amber-500/50", icon: Crown };
    if (score >= 75) return { label: "Elite Buyer", color: "from-blue-500 to-indigo-600", text: "white", shadow: "shadow-blue-500/50", icon: Medal };
    return null;
};

const TrustScoreGauge = ({ score }) => {
    // Simple gauge visualization
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg className="transform -rotate-90 w-48 h-48">
                <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200/10" />
                <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`text-blue-500 transition-all duration-1000 ease-out`} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Trust Score</span>
            </div>
        </div>
    );
};

const BreakdownItem = ({ label, score, max, icon: Icon, color }) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-[#0a0f1d] ${color}`}>
                <Icon size={16} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <div className="h-1.5 w-24 bg-gray-700/50 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${(score / max) * 100}%` }}></div>
                </div>
            </div>
        </div>
        <span className={`text-lg font-black ${color}`}>{score}<span className="text-xs text-gray-500 font-medium">/{max}</span></span>
    </div>
);

const BuyerInsights = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeRange, setActiveRange] = useState('1m');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showEduModal, setShowEduModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/analytics/buyer/overview/${activeRange}`);
                setData(response.data);
            } catch (err) {
                console.error("Failed to load insights", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [activeRange, userId]);

    const handleRangeChange = (range) => setActiveRange(range);

    // Helper to render content safely
    const renderContent = () => {
        if (loading) {
            return <BuyerInsightsShimmer timeRange={activeRange} />;
        }

        if (!data) {
            return (
                <div className="text-center py-20 mt-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Unable to load insights</h3>
                    <button onClick={() => navigate(`/dashboard/buyer/${userId}`)} className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline">Return to Dashboard</button>
                </div>
            );
        }

        const { kpi, chartData, trends, trustScore, achievements, milestones } = data;
        const activeBadge = getMilestoneBadge(trustScore.totalScore, achievements?.length || 0);

        return (
            <div className="space-y-8 animate-fade-in">
                {/* Elite Trust Score Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 bluish:border-white/10 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck size={120} className="text-white" />
                        </div>
                        <TrustScoreGauge score={trustScore.totalScore} />
                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white blush:text-white">Elite Standing</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 mt-2">
                                {trustScore.totalScore >= 75
                                    ? "You're doing amazing! Your high reliability has unlocked platform-wide benefits."
                                    : "You're on your way! Complete more successful deals to unlock Elite status."}
                            </p>
                        </div>
                        {activeBadge && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => activeBadge.label === "Sentinel of Truth" ? setShowProofModal(true) : null}
                                className={`mt-6 px-4 py-2 bg-gradient-to-r ${activeBadge.color} rounded-xl text-${activeBadge.text} text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${activeBadge.shadow} flex items-center gap-2 border border-white/20`}
                            >
                                <activeBadge.icon size={14} className={activeBadge.label === "Sentinel of Truth" ? "animate-bounce" : ""} />
                                {activeBadge.label}
                            </motion.button>
                        )}

                        {trustScore.isEligible && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 dark:shadow-blue-500/20 flex items-center gap-2"
                            >
                                <Award size={16} /> Eligible for Gold Discount
                            </motion.div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 bluish:border-white/10 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white bluish:text-white">Trust Breakdown</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">How your score is calculated (passing is 75)</p>
                            </div>
                            <button
                                onClick={() => setShowEduModal(true)}
                                className="p-2 bg-blue-500/10 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                                <Info size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                            <BreakdownItem label="Reliability" score={trustScore.breakdown.reliability} max={40} icon={ShieldCheck} color="text-blue-500" />
                            <BreakdownItem label="Platform Activity" score={trustScore.breakdown.activity} max={20} icon={Activity} color="text-blue-500" />
                            <BreakdownItem label="Spending Volume" score={trustScore.breakdown.volume} max={20} icon={TrendingUp} color="text-indigo-500" />
                            <BreakdownItem label="Account Tenure" score={trustScore.breakdown.tenure} max={20} icon={Calendar} color="text-amber-500" />
                        </div>
                        <div className="mt-8 p-4 bg-white/5 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#0a0f1d] flex items-center justify-center text-blue-400 shadow-sm border border-white/5">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Next Milestone</p>
                                    <p className="text-sm font-bold text-white">Platinum Discount at Score 90</p>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Spent" value={`$${kpi.totalSpent.toLocaleString()}`} icon={Wallet} color="blue" />
                    <KPICard title="Total Savings" value={`$${kpi.totalSavings.toLocaleString()}`} icon={TrendingUp} color="blue" subtitle="Negotiated discounts" />
                    <KPICard title="Acquisitions" value={kpi.acquisitions} icon={ShoppingBag} color="indigo" subtitle="Completed orders" />
                    <KPICard title="Conversion Rate" value={`${kpi.conversionRate}%`} icon={Percent} color="purple" subtitle="Interests to deals" />
                </div>

                {/* Main Spending Chart */}
                <div className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/10 transition-colors duration-300">
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white bluish:text-white tracking-tight">Financial Flow</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Analysis of expenditure and savings over {timeRangeLabels[activeRange].toLowerCase()}</p>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-500"></div>
                                <span className="text-xs font-bold text-gray-400">Expenditure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                                <span className="text-xs font-bold text-gray-400">Savings</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.05} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: '1px solid #27272a', backgroundColor: '#111', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }} cursor={{ stroke: '#ffffff20', strokeWidth: 2 }} />
                                <Area type="monotone" dataKey="spent" name="Spent" stroke={chartColors.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorSpent)" animationDuration={1500} />
                                <Area type="monotone" dataKey="savings" name="Savings" stroke={chartColors.secondary} strokeWidth={4} fillOpacity={1} fill="url(#colorSavings)" animationDuration={1500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Expenditure */}
                    <div className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/10 transition-colors duration-300 flex flex-col">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white bluish:text-white mb-8">Category Diversification</h3>
                        <div className="h-64 flex-grow flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={trends.categorySpend || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        animationDuration={1500}
                                    >
                                        {(trends.categorySpend || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? chartColors.primary : chartColors.secondary} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '15px', border: '1px solid #27272a', backgroundColor: '#111', color: '#fff' }}
                                        formatter={(value) => `$${value.toLocaleString()}`}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/10 transition-colors duration-300">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white bluish:text-white mb-8">Platform Engagement</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Interests', count: kpi.totalInterests, color: chartColors.primary },
                                    { name: 'Accepted', count: kpi.acceptedInterests, color: chartColors.secondary },
                                    { name: 'Orders', count: kpi.acquisitions, color: chartColors.accent }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.05} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ borderRadius: '15px', backgroundColor: '#111', border: 'none' }} />
                                    <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                                        {[0, 1, 2].map((i) => <Cell key={i} fill={[chartColors.primary, chartColors.secondary, chartColors.accent][i]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#0a0f1d] selection:bg-blue-500/30 bluish:selection:bg-blue-500/30 overflow-hidden relative">
            {/* Dynamic Background Elements - Bluish Theme Style */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/90 to-gray-50 dark:from-black dark:via-black/90 dark:to-black bluish:from-[#0a0f1d] bluish:via-[#0a0f1d]/90 bluish:to-[#0a0f1d]"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in pb-20 relative z-10">
                {/* Top Navigation Row - Persists during loading */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/dashboard/buyer/${userId}`)}
                            className="p-3 bg-white dark:bg-zinc-900 bluish:bg-white/5 border border-gray-200 dark:border-zinc-800 bluish:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-900 dark:text-white bluish:text-white hover:text-blue-400"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white bluish:text-white tracking-tight">Buyer Intelligence</h1>
                            <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-300 font-medium">Analytics, patterns, and your trust reputation.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black/50 bluish:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-zinc-800 bluish:border-white/10 flex text-[10px] font-black uppercase tracking-widest transition-colors duration-300">
                        {['24h', '15d', '1m', '1y', 'all'].map(r => (
                            <button
                                key={r}
                                onClick={() => handleRangeChange(r)}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg transition-all ${activeRange === r ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area - Switches between Data and Shimmer */}
                {renderContent()}

                {/* Education Modal */}
                <AnimatePresence>
                    {showEduModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowEduModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-200 dark:border-zinc-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10"
                            >
                                <div className="p-8 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-500/20">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Trust Intelligence</h2>
                                            <p className="text-sm text-gray-500">How to achieve and benefit from Elite Standing</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowEduModal(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-gray-400"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-zinc-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {eduContent.map((item, idx) => (
                                            <div key={idx} className="p-5 bg-gray-50 dark:bg-zinc-800/50 rounded-[1.5rem] border border-gray-100 dark:border-zinc-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm ${item.color === 'blue' ? 'text-blue-500' : item.color === 'blue' ? 'text-blue-500' : item.color === 'indigo' ? 'text-indigo-500' : 'text-amber-500'}`}>
                                                        <item.icon size={18} />
                                                    </div>
                                                    <h4 className="font-black text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{item.desc}</p>
                                                <div className="flex items-start gap-2 p-3 bg-white/50 dark:bg-zinc-900/50 rounded-xl border border-gray-100/50 dark:border-zinc-800/50">
                                                    <Rocket size={14} className="text-blue-500 dark:text-blue-400 mt-0.5" />
                                                    <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                                        <span className="text-blue-500 dark:text-blue-400 uppercase">Boost:</span> {item.boost}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-[2rem] text-white">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Star size={24} className="text-white fill-white" />
                                            <h4 className="text-lg font-black italic tracking-tight">Elite Benefits (Score 75+)</h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                                    <Percent size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Priority Discounts</p>
                                                    <p className="text-[10px] opacity-80">Unlock exclusive negotiation ceilings and lower fees.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                                    <ShieldCheck size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Trusted Badge</p>
                                                    <p className="text-[10px] opacity-80">Increased visibility and instant trust with top sellers.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                                    <Activity size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Early Access</p>
                                                    <p className="text-[10px] opacity-80">Get notified of hot listings 6 hours before others.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                                    <Rocket size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Concierge Support</p>
                                                    <p className="text-[10px] opacity-80">Fast-track mediation and dedicated platform support.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowEduModal(false)}
                                    className="m-8 p-4 bg-blue-600 dark:bg-emerald-600 hover:bg-blue-700 dark:hover:bg-emerald-700 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20 dark:shadow-emerald-600/20"
                                >
                                    Got it, let&apos;s boost my score!
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Perfect Score Proof Modal */}
                <AnimatePresence>
                    {showProofModal && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowProofModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, rotateX: 15 }}
                                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                                exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
                                className="bg-white dark:bg-zinc-900 rounded-[3rem] border-4 border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] w-full max-w-lg overflow-hidden flex flex-col relative z-10"
                            >
                                <div className="bg-gradient-to-b from-amber-500/10 to-transparent p-12 text-center relative">
                                    <div className="absolute top-4 right-4">
                                        <button onClick={() => setShowProofModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/40 relative">
                                        <Crown size={48} className="text-white fill-white" />
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-2 border-2 border-dashed border-amber-500/50 rounded-full"
                                        />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Sentinel of Truth</h2>
                                    <p className="text-amber-500 font-bold tracking-[0.3em] text-xs mt-2 uppercase">Certificate of Excellence</p>
                                </div>

                                <div className="px-12 pb-12 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-amber-500/20">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="text-blue-500 dark:text-emerald-400" size={20} />
                                                <span className="text-sm font-bold opacity-70">Reliability Index</span>
                                            </div>
                                            <span className="text-lg font-black text-blue-500 dark:text-emerald-400">100/100</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-amber-500/20">
                                            <div className="flex items-center gap-3">
                                                <Activity className="text-blue-500 dark:text-emerald-400" size={20} />
                                                <span className="text-sm font-bold opacity-70">Engagement Velocity</span>
                                            </div>
                                            <span className="text-lg font-black text-blue-500 dark:text-emerald-400">100/100</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-amber-500/20">
                                            <div className="flex items-center gap-3">
                                                <TrendingUp className="text-indigo-500" size={20} />
                                                <span className="text-sm font-bold opacity-70">Economic Volume</span>
                                            </div>
                                            <span className="text-lg font-black text-indigo-500">100/100</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-amber-500/20">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="text-amber-500" size={20} />
                                                <span className="text-sm font-bold opacity-70">Account Maturity</span>
                                            </div>
                                            <span className="text-lg font-black text-amber-500">100/100</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-loose">
                                            This user has demonstrated absolute integrity across every transaction.
                                            They currently hold the highest attainable rank on the TruthTrade platform.
                                        </p>
                                        <div className="mt-8 flex gap-3">
                                            <button className="flex-1 py-4 bg-zinc-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                <Download size={14} /> Download Proof
                                            </button>
                                            <button className="p-4 bg-gray-100 dark:bg-zinc-800 dark:text-white rounded-2xl hover:scale-105 transition-all">
                                                <Share2 size={18} />
                                            </button>
                                        </div>
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

export default BuyerInsights;
