import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, DollarSign, Activity, ShoppingBag, Clock, Users, TrendingUp, ArrowUpRight, Shield } from 'lucide-react';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminDashboardShimmer from '../../components/shimmers/AdminDashboardShimmer';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        recentSales: []
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/activity')
                ]);
                setStats(statsRes.data);
                setActivities(activityRes.data);
            } catch (error) {
                console.error("Failed to fetch admin dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Format time helper (e.g. "2M AGO")
    const formatTimeAgo = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}S AGO`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}M AGO`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}H AGO`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}D AGO`;
    };

    // ... (rest of code)

    // Mock data for the chart - in a real app, this would come from the backend
    const chartData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 5000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 1890 },
        { name: 'Sat', revenue: 2390 },
        { name: 'Sun', revenue: 3490 },
    ];

    // Helper for status badge colors
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'sold':
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'refunded':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'disputed':
                return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            default:
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };



    // ... (existing imports)

    // ... (inside component)

    if (loading) return <AdminDashboardShimmer />;

    return (
        <div className="flex-1 h-full p-8">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-emerald-400 dark:to-teal-500">Platform Command</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Real-time metrics and administrative controls.</p>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Gross Sales"
                    value={stats.totalSales}
                    icon={<ShoppingBag className="w-6 h-6" />}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                    delay={0.1}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6" />}
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                    delay={0.2}
                />
                <StatCard
                    title="Growth"
                    value="+12.5%"
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                    delay={0.3}
                />
                <StatCard
                    title="New Users"
                    value="24"
                    icon={<Users className="w-6 h-6" />}
                    color="text-orange-500"
                    bg="bg-orange-500/10"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 text-gray-100">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl relative z-10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" /> Revenue Analytics
                        </h2>
                        <span className="text-xs bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full text-gray-500">Last 7 Days</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#3b82f6' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl relative z-10"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" /> Recent Activity
                    </h2>
                    <div className="space-y-6">
                        {activities.length > 0 ? (
                            activities.map((activity, i) => {
                                const userName = activity.user?.fullName || 'System';
                                const description = activity.description.replace(userName, '').trim();

                                return (
                                    <div key={activity._id || i} className="flex gap-4 items-start group">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 group-hover:scale-150 transition-transform"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-200">
                                                <span className="text-blue-400 font-bold">{userName}</span> {description || activity.description}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{formatTimeAgo(activity.createdAt)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-500 py-4">No recent activity</div>
                        )}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="p-4 bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/20 rounded-2xl">
                            <p className="font-bold text-blue-400 text-sm">Real-time Syncing</p>
                            <p className="text-[10px] text-gray-400 mt-1">Listening for platform-wide events...</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden relative z-10"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                    <button className="text-xs text-blue-500 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="pb-4 px-2">Asset</th>
                                <th className="pb-4 px-2">Buyer</th>
                                <th className="pb-4 px-2">Value</th>
                                <th className="pb-4 px-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {stats.recentSales?.length > 0 ? (
                                stats.recentSales.map((sale) => (
                                    <tr key={sale._id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                                        <td className="py-5 px-2 font-bold uppercase tracking-tighter text-gray-900 dark:text-gray-100">{sale.asset?.title}</td>
                                        <td className="py-5 px-2 text-gray-500">{sale.buyer?.fullName}</td>
                                        <td className="py-5 px-2 font-bold text-blue-600 dark:text-emerald-400">₹{(sale.totalAmount || 0).toLocaleString()}</td>
                                        <td className="py-5 px-2">
                                            <span className={`px-2 py-1 rounded-full font-bold uppercase text-[10px] border ${getStatusColor(sale.status)}`}>
                                                {sale.status || 'SENT'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">No recent transactions</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, bg, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 group relative z-10"
    >
        <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight">{value}</h3>
    </motion.div>
);

const ActionButton = ({ icon, label }) => (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-all group">
        <div className="flex items-center gap-3">
            <span className="text-blue-500 group-hover:text-white">{icon}</span>
            <span className="font-medium text-sm">{label}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
);

export default AdminDashboard;
