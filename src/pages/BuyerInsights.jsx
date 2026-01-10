import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, ArrowLeft, Percent, Wallet } from 'lucide-react';
import KPICard from '../components/KPICard';
import OverviewShimmer from '../components/shimmers/OverviewShimmer';

const BuyerInsights = () => {
    const { range, userId } = useParams();
    const navigate = useNavigate();
    const activeRange = range || '1m';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const timeRangeLabels = {
        '24h': 'Last 24 Hours',
        '15d': 'Last 15 Days',
        '1m': 'Last 30 Days',
        '1y': 'Last 1 Year',
        'all': 'All Time'
    };

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/analytics/buyer/overview/${activeRange}`);
                setData(data);
            } catch (error) {
                console.error("Failed to fetch buyer insights", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [activeRange]);

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <OverviewShimmer timeRange={activeRange} />
        </div>
    );

    if (!data) return (
        <div className="text-center py-20 mt-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Unable to load insights</h3>
            <button onClick={() => navigate(`/dashboard/buyer/${userId}`)} className="mt-4 text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Return to Dashboard</button>
        </div>
    );

    const { kpi, chartData, trends } = data;

    const handleRangeChange = (newRange) => {
        navigate(`/dashboard/buyer/${userId}/insights/${newRange}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/dashboard/buyer/${userId}`)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Buyer Insights</h1>
                        <p className="text-gray-500 dark:text-gray-400">Track your spending, savings, and acquisition metrics.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-1 border border-gray-200 dark:border-zinc-700 flex text-xs font-medium shadow-sm transition-colors duration-300">
                    {['24h', '15d', '1m', '1y', 'all'].map(r => (
                        <button
                            key={r}
                            onClick={() => handleRangeChange(r)}
                            className={`px-3 py-1.5 rounded-md transition-all ${activeRange === r ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                        >
                            {r === '24h' ? '24h' : r === 'all' ? 'All' : r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Spent" value={`$${kpi.totalSpent.toLocaleString()}`} icon={Wallet} color="emerald" highlight />
                <KPICard title="Total Savings" value={`$${kpi.totalSavings.toLocaleString()}`} icon={TrendingUp} color="blue" subtitle="Negotiated discounts" />
                <KPICard title="Acquisitions" value={kpi.acquisitions} icon={ShoppingBag} color="indigo" subtitle="Completed orders" />
                <KPICard title="Conversion Rate" value={`${kpi.conversionRate}%`} icon={Percent} color="purple" subtitle="Interests to deals" />
            </div>

            {/* Main Spending Chart */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Spending Pattern</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Analysis of expenditure and savings over {timeRangeLabels[activeRange].toLowerCase()}</p>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#e5e7eb' }} />
                            <Area type="monotone" dataKey="spent" name="Spent" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                            <Area type="monotone" dataKey="savings" name="Savings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trends Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Expenditure */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
                        <DollarSign size={18} className="text-gray-400 dark:text-zinc-500" /> Spending by Category
                    </h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trends.categorySpend || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(trends.categorySpend || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#ef4444'][index % 5]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center transition-colors duration-300 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 dark:from-emerald-900/10 dark:to-blue-900/10">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Buying Habit</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        Purchasing negotiated assets has saved you <span className="text-emerald-600 dark:text-emerald-400 font-bold">${kpi.totalSavings.toLocaleString()}</span> so far.
                        Your focus on <span className="font-bold text-gray-900 dark:text-white">{trends.categorySpend[0]?.name || 'diverse'}</span> categories shows a strategic acquisition pattern.
                    </p>
                    <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/20">
                        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                            <TrendingUp size={20} />
                            <span className="font-bold">Insight Tracker</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Regularly reviewing these patterns helps you optimize your acquisition budget and identify high-value categories.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerInsights;
