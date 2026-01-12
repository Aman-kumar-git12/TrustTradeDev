import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import api from '../utils/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    ArrowLeft, DollarSign, Clock,
    TrendingUp, AlertTriangle, CheckCircle, Package, Users, MessageCircle
} from 'lucide-react';
import KPICard from '../components/KPICard';
import ProductDetailsShimmer from '../components/shimmers/ProductDetailsShimmer';

const SellerProductAnalytics = () => {
    const { assetId, range } = useParams();
    const { businessId } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const productTitle = location.state?.productTitle;

    // Default to '30d' if no range param exists
    const activeRange = range || '30d';

    useEffect(() => {
        if (!range) {
            navigate('30d', { replace: true, state: location.state });
        }
    }, [range, navigate, location.state]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const endpoint = activeRange === '30d' ? '30d' : 'all';
                const res = await api.get(`/analytics/product/${assetId}/${endpoint}`);
                if (!res.data || !res.data.asset) {
                    // Handle error gracefully
                    console.error("Invalid data received", res.data);
                    return;
                }
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch product analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [assetId, activeRange]);

    if (loading) return <ProductDetailsShimmer productName={productTitle} />;
    if (!data) return <div className="text-center mt-20 text-gray-500 dark:text-gray-400">Product not found</div>;

    const { asset, metrics, funnel, trends, priceIntelligence, negotiation } = data;

    const formatDuration = (val) => {
        const days = parseFloat(val);
        if (!days || days === 0) return '0.0 Days';
        if (days < 1) {
            return `${(days * 24).toFixed(1)} Hrs`;
        }
        return `${days.toFixed(1)} Days`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6 transition-colors duration-300">
                <button
                    onClick={() => navigate(`/dashboard/seller/${businessId}/analytics/products`)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{asset.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-semibold text-xs uppercase border border-indigo-200 dark:border-indigo-800">
                            {asset.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Package size={14} className="text-gray-400 dark:text-gray-500" /> Stuck: {asset.availableQty} Units
                        </span>
                        <span>Listed on {new Date(asset.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            {/* Financial Performance */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Financial Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <KPICard
                        title="Total Revenue"
                        value={`$${metrics.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        color="blue"
                        subtitle={`${metrics.totalOrders} Orders Completed`}
                    />
                    <KPICard
                        title="Total Profit"
                        value={`$${metrics.totalProfit.toLocaleString()}`}
                        icon={TrendingUp}
                        color={metrics.totalProfit >= 0 ? "blue" : "red"}
                        subtitle={metrics.totalProfit >= 0 ? "Net Gain" : "Net Loss"}
                    />
                    <KPICard
                        title="Avg Profit / Order"
                        value={`$${metrics.avgProfit.toLocaleString()}`}
                        icon={DollarSign}
                        color={metrics.avgProfit >= 0 ? "blue" : "red"}
                        subtitle="Per unit margin"
                    />
                    <KPICard
                        title="Avg Neg. Price"
                        value={`$${metrics.avgNegotiatedFinalPrice.toLocaleString()}`}
                        icon={MessageCircle}
                        color="indigo"
                        subtitle="On negotiated deals"
                    />
                </div>
            </div>

            {/* Efficiency & Timing */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Efficiency & Funnel</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <KPICard
                        title="Interest to Sold"
                        value={formatDuration(metrics.avgTimeInterestToSold)}
                        icon={Clock}
                        color="amber"
                        subtitle="Avg conversion time"
                    />
                    <KPICard
                        title="Negotiation to Sold"
                        value={formatDuration(metrics.avgTimeNegToSold)}
                        icon={Clock}
                        color="purple"
                        subtitle="Avg negotiation duration"
                    />
                    <KPICard
                        title="Deals / 100 Interest"
                        value={metrics.dealsPer100}
                        icon={Users}
                        color="pink"
                        subtitle="Funnel Efficiency Score"
                    />
                    <KPICard
                        title="Conversion Rate"
                        value={`${metrics.conversionRate}%`}
                        icon={TrendingUp}
                        color="blue"
                        subtitle="Views to Sales Ratio"
                    />
                </div>
            </div>

            {/* Negotiation Health */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">Negotiation Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KPICard
                        title="Passed Negotiations"
                        value={negotiation.passed}
                        icon={CheckCircle}
                        color="blue"
                        subtitle="Successfully closed deals"
                    />
                    <KPICard
                        title="Failed Negotiations"
                        value={negotiation.failed}
                        icon={AlertTriangle}
                        color="red"
                        subtitle="Rejected or stalled"
                    />
                    <KPICard
                        title="Avg Listing Lifecycle"
                        value={`${metrics.avgTimeToSell} Days`}
                        icon={Package}
                        color="blue"
                        subtitle="Created to Sold Time"
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Revenue & Engagement Charts */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Chart */}
                    <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 transition-colors duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white bluish:text-white transition-colors duration-300">Profitability Analysis</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 bluish:text-slate-400">Revenue vs. Net Profit over time</p>
                            </div>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends.revenue}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} stroke="#9ca3af" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={d => new Date(d).getDate()}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        tickFormatter={v => `$${v}`}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'amount' ? 'Revenue' : 'Profit']}
                                        contentStyle={{
                                            backgroundColor: '#18181b', // zinc-900
                                            borderColor: '#27272a', // zinc-800
                                            color: '#fff',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Total Revenue" />
                                    <Area type="monotone" dataKey="profit" stroke="#F59E0B" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} name="Net Profit" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Funnel Visualization */}
                    <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white bluish:text-white mb-6 transition-colors duration-300">Conversion Funnel</h3>
                        <div className="space-y-6">
                            <FunnelStep
                                label="Total Views (Impressions)"
                                value={funnel.impressions}
                                sublabel="Target Audience Reached"
                                colorClass="bg-gray-400 dark:bg-gray-500"
                                percentage={100}
                            />
                            <FunnelStep
                                label="Interested Leads"
                                value={funnel.attract}
                                sublabel={`${((funnel.attract / (funnel.impressions || 1)) * 100).toFixed(1)}% Click-through`}
                                colorClass="bg-blue-500 dark:bg-emerald-500 bluish:bg-blue-500"
                                percentage={Math.max(((funnel.attract / (funnel.impressions || 1)) * 100), 2)}
                            />
                            <FunnelStep
                                label="Active Negotiations"
                                value={funnel.interact}
                                sublabel={`${((funnel.interact / (funnel.attract || 1)) * 100).toFixed(1)}% Qualified`}
                                colorClass="bg-indigo-500"
                                percentage={Math.max(((funnel.interact / (funnel.impressions || 1)) * 100), 2)}
                            />
                            <FunnelStep
                                label="Closed Sales"
                                value={funnel.convert}
                                sublabel={`${((funnel.convert / (funnel.interact || 1)) * 100).toFixed(1)}% Closed`}
                                colorClass="bg-blue-500 dark:bg-emerald-500 bluish:bg-blue-500"
                                percentage={Math.max(((funnel.convert / (funnel.impressions || 1)) * 100), 2)}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar: Price Intelligence & Health */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800 bluish:to-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white bluish:text-white mb-4 transition-colors duration-300">Price Intelligence</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 bluish:bg-slate-800 rounded-xl transition-colors duration-300">
                                <span className="text-gray-500 dark:text-gray-400 bluish:text-slate-400 text-sm">Your Price</span>
                                <span className="font-bold text-gray-900 dark:text-white bluish:text-white transition-colors duration-300">${asset.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 bluish:bg-slate-800 rounded-xl transition-colors duration-300">
                                <span className="text-gray-500 dark:text-gray-400 bluish:text-slate-400 text-sm">Market Avg</span>
                                <span className="font-bold text-gray-600 dark:text-gray-300 bluish:text-slate-300 transition-colors duration-300">${priceIntelligence.marketAvgPrice.toLocaleString()}</span>
                            </div>

                            <div className={`p-4 rounded-xl border ${priceIntelligence.pricePosition === 'Overpriced' ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' : 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'} transition-colors duration-300`}>
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={20} className="mt-0.5 shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-bold mb-1">
                                            {priceIntelligence.pricePosition === 'Overpriced' ? 'Recommendation: Lower Price' : 'Price is Competitive'}
                                        </p>
                                        <p className="opacity-90">
                                            {priceIntelligence.pricePosition === 'Overpriced'
                                                ? `You are ${priceIntelligence.deviation}% above market average. Consider lowering to $${priceIntelligence.marketAvgPrice} to sell faster.`
                                                : `Great job! You are priced competitively. This usually leads to 2x faster sales.`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white bluish:text-white mb-4 transition-colors duration-300">Product Health</h3>
                        <div className="space-y-3">
                            <HealthItem label="Visibility" status={asset.views > 500 ? 'good' : 'warning'} text={asset.views > 500 ? 'High Traffic' : 'Needs Boost'} />
                            <HealthItem label="Inventory" status={asset.availableQty > 5 ? 'good' : 'warning'} text={asset.availableQty > 5 ? 'In Stock' : 'Low Stock'} />
                            <HealthItem label="Conversion" status={metrics.conversionRate > 2 ? 'good' : 'bad'} text={`${metrics.conversionRate}% Conv. Rate`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const HealthItem = ({ label, status, text }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${status === 'good' ? 'text-blue-600 dark:text-emerald-400' : status === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                {text}
            </span>
            <CheckCircle size={16} className={status === 'good' ? 'text-blue-500 dark:text-emerald-400' : 'text-gray-300 dark:text-zinc-700'} />
        </div>
    </div>
);

const FunnelStep = ({ label, value, sublabel, colorClass, percentage }) => (
    <div className="group">
        <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">{label}</span>
            <div className="text-right">
                <span className="block text-lg font-bold text-gray-900 dark:text-white leading-none transition-colors duration-300">{value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">{sublabel}</span>
            </div>
        </div>
        <div className="h-3 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-300">
            <div
                className={`h-full ${colorClass} rounded-full transition-all duration-1000`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    </div>
);

export default SellerProductAnalytics;
