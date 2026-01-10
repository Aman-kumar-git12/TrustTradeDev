import { useState, useEffect } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Users, Briefcase, Award, MapPin, Tag, List, BarChart2 } from 'lucide-react';
import KPICard from '../components/KPICard';
import OverviewShimmer from '../components/shimmers/OverviewShimmer';

const SellerAnalyticsOverview = () => {
    const { businessId } = useOutletContext();
    const { range } = useParams();
    const navigate = useNavigate();

    // Default to '1m' if no range param exists, and normalize 1d -> 24h
    const rawRange = range || '1m';
    const timeRange = rawRange === '1d' ? '24h' : rawRange;

    const [performanceView, setPerformanceView] = useState('promote');
    const [viewFormat, setViewFormat] = useState('data');
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
        const fetchData = async () => {
            if (!businessId) return;
            setLoading(true);
            try {
                // Ensure endpoint is valid
                const validRanges = ['24h', '15d', '1m', '1y', 'all'];
                // Handle legacy '1d' just in case, though UI assumes '24h'
                let endpoint = timeRange === '1d' ? '24h' : timeRange;
                if (!validRanges.includes(endpoint)) endpoint = '1m';

                const response = await api.get(`/analytics/${businessId}/overview/${endpoint}`);
                // Removed delay

                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch overview analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [businessId, timeRange]);

    // Enhanced Loading State
    if (loading) return <OverviewShimmer timeRange={timeRange} />;

    if (!data) return <div>No data available</div>;

    const { kpi, chartData } = data;

    const handleRangeChange = (newRange) => {
        navigate(`/dashboard/seller/${businessId}/analytics/overview/${newRange}`);
    };

    return (
        <div className="space-y-6">

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Revenue" value={`$${kpi.totalRevenue.toLocaleString()}`} icon={DollarSign} color="emerald" subtitle="Gross Income" />
                <KPICard title="Net Profit" value={`$${kpi.totalProfit.toLocaleString()}`} icon={Briefcase} color="indigo" subtitle={`Margin: ${kpi.netMargin}%`} highlight />
                <KPICard title="Total Orders" value={kpi.totalUnitsSold} icon={ShoppingBag} color="blue" subtitle={`Avg: $${kpi.avgDealSize}`} />
                <KPICard title="Unique Customers" value={kpi.customers} icon={Users} color="purple" subtitle={`Best Month: ${kpi.bestMonth}`} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Revenue/Profit Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Financial Performance</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Revenue vs Profit over {timeRangeLabels[timeRange].toLowerCase()}</p>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#e5e7eb' }} />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="profit" name="Profit" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Stats Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center space-y-8 transition-colors duration-300">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {timeRange === '1d' ? 'Peak Sales Hour' : timeRange === '15d' ? 'Best Sales Day' : timeRange === '1m' ? 'Best Sales Week' : 'Best Sales Month'}
                        </p>
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl"><Award size={24} /></div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.bestMonth}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Highest Revenue Recorded</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-zinc-800"></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Net Margin Health</p>
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl"><TrendingUp size={24} /></div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.netMargin}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Profitability Ratio</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Insights Section */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white pt-2">Performance Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Efficiency Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <DollarSign size={18} className="text-gray-400 dark:text-zinc-500" /> Financial Efficiency
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg transition-colors">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Avg Profit / Item</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">+${kpi.avgProfit?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg transition-colors">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Avg Discount</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">${kpi.avgDiscount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg transition-colors">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Loss</span>
                            <span className="font-bold text-red-500 dark:text-red-400">-${kpi.totalLoss?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg transition-colors">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Items / Customer</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{kpi.avgProductsPerCustomer || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Volume Leaders */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <ShoppingBag size={18} className="text-gray-400 dark:text-zinc-500" /> Volume Leaders
                    </h4>
                    <div className="space-y-4">
                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg transition-colors">
                            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-bold mb-1 uppercase tracking-wider">Highest Volume</p>
                            <p className="font-bold text-gray-900 dark:text-white truncate">{data.rankings?.topSelling?.title || 'N/A'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{data.rankings?.topSelling?.count || 0} units sold</p>
                        </div>
                        <div className="p-3 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg transition-colors">
                            <p className="text-xs text-orange-500 dark:text-orange-400 font-bold mb-1 uppercase tracking-wider">Lowest Volume</p>
                            <p className="font-bold text-gray-900 dark:text-white truncate">{data.rankings?.leastSelling?.title || 'N/A'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{data.rankings?.leastSelling?.count || 0} units sold</p>
                        </div>
                    </div>
                </div>

                {/* Profit Drivers */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-gray-400 dark:text-zinc-500" /> Profit Drivers
                    </h4>
                    <div className="space-y-4">
                        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg transition-colors">
                            <p className="text-xs text-emerald-500 dark:text-emerald-400 font-bold mb-1 uppercase tracking-wider">Most Profitable</p>
                            <p className="font-bold text-gray-900 dark:text-white truncate">{data.rankings?.mostProfitable?.title || 'N/A'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">+${data.rankings?.mostProfitable?.profit?.toLocaleString() || 0}</p>
                        </div>
                        <div className="p-3 bg-red-50/50 dark:bg-red-900/20 rounded-lg transition-colors">
                            <p className="text-xs text-red-500 dark:text-red-400 font-bold mb-1 uppercase tracking-wider">Least Profitable</p>
                            <p className="font-bold text-gray-900 dark:text-white truncate">{data.rankings?.leastProfitable?.title || 'N/A'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">${data.rankings?.leastProfitable?.profit?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Best vs Worst Performers Section */}
            <div className="pt-4 pb-8 border-t border-gray-100 dark:border-zinc-800 mt-8 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Product Portfolio Matrix</h3>
                        <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg flex text-gray-500 dark:text-gray-400 transition-colors">
                            <button
                                onClick={() => setViewFormat('data')}
                                className={`p-1.5 rounded transition-all ${viewFormat === 'data' ? 'bg-white dark:bg-zinc-600 shadow text-gray-800 dark:text-white' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
                                title="List View"
                            >
                                <List size={16} />
                            </button>
                            <button
                                onClick={() => setViewFormat('chart')}
                                className={`p-1.5 rounded transition-all ${viewFormat === 'chart' ? 'bg-white dark:bg-zinc-600 shadow text-gray-800 dark:text-white' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}
                                title="Chart View"
                            >
                                <BarChart2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg flex text-sm font-medium transition-colors">
                        <button
                            onClick={() => setPerformanceView('promote')}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${performanceView === 'promote' ? 'bg-white dark:bg-zinc-600 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${performanceView === 'promote' ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'}`}></span> Promote
                        </button>
                        <button
                            onClick={() => setPerformanceView('kill')}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${performanceView === 'kill' ? 'bg-white dark:bg-zinc-600 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${performanceView === 'kill' ? 'bg-red-500' : 'bg-gray-400 dark:bg-gray-500'}`}></span> Kill
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: performanceView === 'promote' ? 'Top 5 by Quantity' : 'Lowest Sales Quantity',
                            data: performanceView === 'promote' ? data.performers?.best?.byQuantity : data.performers?.worst?.byQuantity,
                            dataKey: 'count',
                            color: '#6366f1',
                            unit: 'units'
                        },
                        {
                            title: performanceView === 'promote' ? 'Top 5 by Revenue' : 'Highest Financial Loss',
                            data: performanceView === 'promote' ? data.performers?.best?.byRevenue : data.performers?.worst?.byLoss,
                            dataKey: performanceView === 'promote' ? 'revenue' : 'profit',
                            color: performanceView === 'promote' ? '#10b981' : '#ef4444',
                            unit: '$',
                            prefix: true
                        },
                        {
                            title: performanceView === 'promote' ? 'Top 5 by Profit' : 'Lowest Profit Margin',
                            data: performanceView === 'promote' ? data.performers?.best?.byProfit : data.performers?.worst?.byMargin,
                            dataKey: performanceView === 'promote' ? 'profit' : 'margin',
                            color: performanceView === 'promote' ? '#f59e0b' : '#f97316',
                            unit: performanceView === 'promote' ? '$' : '%',
                            prefix: performanceView === 'promote'
                        }
                    ].map((col, idx) => {
                        // Transform data for chart visualization: use absolute values for consistent LTR growth
                        const chartData = (col.data || []).map(item => ({
                            ...item,
                            chartValue: Math.abs(item[col.dataKey] || 0),
                            originalValue: item[col.dataKey]
                        }));

                        return (
                            <div key={idx} className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm h-80 flex flex-col transition-colors duration-300">
                                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider">{col.title}</h4>
                                <div className="flex-1 min-h-0 relative">
                                    {viewFormat === 'chart' ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsBarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }} barCategoryGap={20}>
                                                <CartesianGrid horizontal={false} strokeDasharray="3 3" strokeOpacity={0.1} />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="title"
                                                    type="category"
                                                    width={110}
                                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                                    interval={0}
                                                    tickFormatter={(val) => val.length > 18 ? `${val.substring(0, 18)}...` : val}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    itemStyle={{ color: '#fff' }}
                                                    formatter={(val, name, props) => {
                                                        const original = props.payload.originalValue;
                                                        return col.prefix ? `${col.unit}${Math.abs(original || 0).toLocaleString()}` : `${(original || 0).toLocaleString()}${col.unit === '%' ? '%' : ' ' + col.unit}`;
                                                    }}
                                                />
                                                <Bar dataKey="chartValue" fill={col.color} radius={[0, 4, 4, 0]} barSize={24}>
                                                </Bar>
                                            </RechartsBarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="space-y-3 overflow-y-auto h-full pr-2 custom-scrollbar">
                                            {(col.data || []).map((p, i) => (
                                                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-zinc-800 last:border-0 pb-2 last:pb-0">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="text-gray-400 dark:text-gray-600 font-mono text-xs w-4 flex-shrink-0">#{i + 1}</span>
                                                        <span className="truncate text-gray-700 dark:text-gray-300 font-medium" title={p.title}>{p.title}</span>
                                                    </div>
                                                    <span className={`font-bold flex-shrink-0`} style={{ color: col.color }}>
                                                        {col.prefix ? `${col.unit}${Math.abs(p[col.dataKey] || 0).toLocaleString()}` : `${(p[col.dataKey] || 0).toLocaleString()}${col.unit === '%' ? '%' : ' ' + col.unit}`}
                                                    </span>
                                                </div>
                                            )) || <p className="text-sm text-gray-400 italic">No data available</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Market Trends Section */}
            <div className="pt-4 pb-8 border-t border-gray-100 dark:border-zinc-800 mt-8 transition-colors">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="text-blue-600 dark:text-blue-500" /> Market Trends & Insights
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Distribution */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
                            <Tag size={18} className="text-gray-400 dark:text-zinc-500" /> Revenue by Category
                        </h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.trends?.categoryRevenue || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(data.trends?.categoryRevenue || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444'][index % 4]} stroke="none" />
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

                    {/* Sales by Location */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
                            <MapPin size={18} className="text-gray-400 dark:text-zinc-500" /> Sales by Location
                        </h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart
                                    layout="vertical"
                                    data={data.trends?.locations || []}
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Price Trend Chart */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 lg:col-span-2 transition-colors duration-300">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-6">Average Selling Price Trend</h4>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #27272a', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(val, name, props) => {
                                            if (name === 'Avg Price') return [`$${Math.round(val).toLocaleString()}`, 'Avg Price'];
                                            return [val, name];
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={(item) => item.count > 0 ? item.revenue / item.count : 0}
                                        name="Avg Price"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAnalyticsOverview;
