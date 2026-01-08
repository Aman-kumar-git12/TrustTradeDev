import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Eye, MessageSquare, TrendingUp, Briefcase, Activity } from 'lucide-react';

const SellerOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { businessId } = useOutletContext();

    useEffect(() => {
        const fetchStats = async () => {
            if (!businessId) return;
            try {
                const { data } = await api.get(`/dashboard/business/${businessId}/stats`);

                // Map API response to Component State Structure if needed, 
                // OR update Component to use the new API structure.
                // The new API returns { activeAssets, totalViews, totalLeads, pendingLeads }
                // But the UI expects nested objects like assetPerformance, leadInsights etc.
                // Let's mock the complex structure for now to keep UI working, using real data where possible.

                const mockedComplexStats = {
                    assetPerformance: {
                        totalViews: data.totalViews,
                        totalInterests: data.totalLeads,
                        conversionRate: data.totalViews > 0 ? ((data.totalLeads / data.totalViews) * 100).toFixed(1) : 0,
                        sellingPriceTrend: [] // Mock or empty
                    },
                    leadInsights: {
                        leads: {
                            total: data.totalLeads,
                            accepted: 0, // Not in simple stats yet
                        },
                        completedDeals: 0, // Not in simple stats yet
                        avgNegotiationTime: 24
                    },
                    businessHealth: {
                        bestPerformingCategory: 'N/A',
                        monthlySales: []
                    }
                };

                setStats(mockedComplexStats);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [businessId]);

    if (loading) return <div className="text-center py-12">Loading Analytics...</div>;
    if (!stats) return <div className="text-center py-12">No data available.</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Asset Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-700">Asset Performance</h3>
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Eye size={20} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Views</p>
                            <p className="text-3xl font-bold text-primary">{stats.assetPerformance.totalViews}</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-gray-500">Interests Sent</p>
                                <p className="text-xl font-bold">{stats.assetPerformance.totalInterests}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Conversion Rate</p>
                                <p className="text-sm font-bold text-green-600">{stats.assetPerformance.conversionRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Lead & Deal Insights */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-700">Lead & Deal Insights</h3>
                        <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                            <MessageSquare size={20} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Leads</p>
                            <p className="text-2xl font-bold text-primary">{stats.leadInsights.leads.total}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Completed Deals</p>
                            <p className="text-2xl font-bold text-green-600">{stats.leadInsights.completedDeals}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Accepted</p>
                            <p className="text-lg font-bold">{stats.leadInsights.leads.accepted}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Avg Neg. Time</p>
                            <p className="text-lg font-bold">{stats.leadInsights.avgNegotiationTime}h</p>
                        </div>
                    </div>
                </div>

                {/* 3. Business Health */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-700">Business Health</h3>
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <Briefcase size={20} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Best Performing Category</p>
                            <p className="text-xl font-bold text-primary truncate">{stats.businessHealth.bestPerformingCategory}</p>
                        </div>
                        <div className="pt-2 border-t mt-2">
                            <p className="text-sm text-gray-500 mb-1">Sales Trend (Last 6 Months)</p>
                            <div className="h-20 flex items-end space-x-1">
                                {stats.businessHealth.monthlySales.map((m, i) => (
                                    <div key={i} className="bg-green-200 hover:bg-green-300 transition-colors rounded-t" style={{ height: `${Math.min(m.count * 20, 100)}%`, width: '100%' }} title={`Month ${m._id}: ${m.count} Sales`}></div>
                                ))}
                                {stats.businessHealth.monthlySales.length === 0 && <span className="text-xs text-gray-400">No data</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualisation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Final Selling Price Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                        <TrendingUp className="mr-2 text-primary" /> Sales Trend
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.assetPerformance.sellingPriceTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="price" stroke="#0F172A" strokeWidth={3} dot={{ r: 4, fill: '#0F172A' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue/Leads Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                        <Activity className="mr-2 text-primary" /> Monthly Activity
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.businessHealth.monthlySales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="_id" tickFormatter={(m) => `Month ${m}`} stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} />
                                <Legend />
                                <Bar dataKey="revenue" name="Revenue ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="count" name="Sales Count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerOverview;
