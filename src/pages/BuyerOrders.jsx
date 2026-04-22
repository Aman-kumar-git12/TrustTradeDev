import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import BuyerDashboardShimmer from '../components/shimmers/BuyerDashboardShimmer';
import OrderCard from '../components/dashboard/OrderCard';
import { Search, ShoppingBag } from 'lucide-react';

const BuyerOrders = () => {
    const { filters, handleClearFilters } = useOutletContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const { showSnackbar } = useUI();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
            const res = await api.get(`/sales/me?${params.toString()}`);
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            showSnackbar("Failed to refresh orders", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    if (loading && !orders.length) return <BuyerDashboardShimmer />;

    if (orders.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 bluish:border-white/5 p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800/50 bluish:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? <Search size={40} /> : <ShoppingBag size={40} />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2">
                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? 'No matches found' : 'No orders yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 bluish:text-slate-400 mb-8 max-w-sm mx-auto">
                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition)
                        ? 'Try adjusting your search query or filters to find what you are looking for.'
                        : 'Once your interests are accepted and finalized by sellers, they will appear here as orders.'}
                </p>
                {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) && (
                    <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center px-8 py-3 bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 text-white rounded-xl font-bold transition-all"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((item) => (
                <OrderCard
                    key={item._id}
                    order={item}
                    isExpanded={expandedId === item._id}
                    onToggle={() => setExpandedId(expandedId === item._id ? null : item._id)}
                />
            ))}
        </div>
    );
};

export default BuyerOrders;
