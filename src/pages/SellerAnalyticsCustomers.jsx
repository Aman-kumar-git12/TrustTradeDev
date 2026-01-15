import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import api from '../utils/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Award, Repeat } from 'lucide-react';
import CustomerShimmer from '../components/shimmers/CustomerShimmer';

const SellerAnalyticsCustomers = () => {
    const { businessId } = useOutletContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!businessId) return;
            setLoading(true);
            try {
                const { data } = await api.get(`/analytics/${businessId}/customers`);
                setData(data);
            } catch (error) {
                console.error("Failed to fetch customer analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [businessId]);

    if (loading) return <CustomerShimmer />;
    if (!data) return <div>No data available</div>;

    const { summary, customers } = data;
    const retentionData = [
        { name: 'New', value: summary.newCustomers, color: '#6366f1' },
        { name: 'Returning', value: summary.repeatCustomers, color: '#10B981' },
    ];

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 bluish:text-slate-400 mb-1">Total Customers</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white bluish:text-white">{summary.totalCustomers}</h3>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 bluish:bg-indigo-500/10 p-3 rounded-full text-indigo-600 dark:text-indigo-400 bluish:text-indigo-400"><Users size={24} /></div>
                </div>
                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 bluish:text-slate-400 mb-1">Retention Rate</p>
                        <h3 className="text-3xl font-bold text-blue-600 dark:text-emerald-400 bluish:text-blue-600">{summary.retentionRate}%</h3>
                    </div>
                    <div className="bg-blue-50 dark:bg-emerald-900/20 bluish:bg-blue-50 p-3 rounded-full text-blue-600 dark:text-emerald-400 bluish:text-blue-600"><Repeat size={24} /></div>
                </div>
                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 bluish:text-slate-400 mb-1">Repeat Buyers</p>
                        <h3 className="text-3xl font-bold text-blue-600 dark:text-emerald-400 bluish:text-blue-400">{summary.repeatCustomers}</h3>
                    </div>
                    <div className="bg-blue-50 dark:bg-emerald-900/20 bluish:bg-blue-900/10 p-3 rounded-full text-blue-600 dark:text-emerald-400 bluish:text-blue-400"><Award size={24} /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Customers Table */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white bluish:text-white mb-4">Top Customers (by Revenue)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 bluish:text-slate-400 border-b border-gray-100 dark:border-zinc-800 bluish:border-white/5">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Customer</th>
                                    <th className="px-4 py-3 text-right">Orders</th>
                                    <th className="px-4 py-3 text-right">Total Spend</th>
                                    <th className="px-4 py-3 text-right rounded-tr-lg">Last Purchase</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 bluish:divide-white/5">
                                {customers.slice(0, 5).map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 bluish:hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <Link to={`/user/${c.id}`} className="flex items-center space-x-3 group cursor-pointer">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-700 bluish:bg-white/10 overflow-hidden group-hover:ring-2 ring-blue-500 dark:ring-emerald-500 bluish:ring-blue-500 transition-all">
                                                    <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900 dark:text-white bluish:text-white group-hover:text-blue-500 dark:group-hover:text-emerald-500 bluish:group-hover:text-blue-500 transition-colors">{c.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 bluish:text-slate-400">{c.company}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-300 bluish:text-slate-300">{c.totalOrders}</td>
                                        <td className="px-4 py-3 text-right font-bold text-sm text-blue-600 dark:text-emerald-400 bluish:text-blue-600">₹{c.totalSpend.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-xs text-gray-500 dark:text-gray-400 bluish:text-slate-400">{new Date(c.lastOrderDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Retention Chart */}
                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex flex-col items-center justify-center transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white bluish:text-white mb-4 w-full text-left">Customer Mix</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={retentionData}
                                    cx="50%" cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {retentionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAnalyticsCustomers;
