import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import BuyerDashboardShimmer from '../components/shimmers/BuyerDashboardShimmer';
import InterestCard from '../components/dashboard/InterestCard';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';

const BuyerInterests = () => {
    const { userId, filters, isFilterOpen, handleClearFilters } = useOutletContext();
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const { showSnackbar, confirm } = useUI();
    const navigate = useNavigate();

    const fetchInterests = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
            const res = await api.get(`/interests/me?${params.toString()}`);
            setInterests(res.data);
        } catch (error) {
            console.error("Failed to fetch interests", error);
            showSnackbar("Failed to refresh interests", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterests();
    }, [filters]);

    const handleDeleteInterest = async (id) => {
        const confirmed = await confirm({
            title: 'Retract Interest',
            message: 'Are you sure you want to retract your interest? This action cannot be undone.',
            confirmText: 'Retract Interest',
            isDangerous: true
        });

        if (!confirmed) return;

        try {
            await api.delete(`/interests/${id}`);
            showSnackbar('Interest retracted successfully', 'success');
            setInterests(prev => prev.filter(i => i._id !== id));
            if (expandedId === id) setExpandedId(null);
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to retract interest', 'error');
        }
    };

    if (loading && !interests.length) return <BuyerDashboardShimmer />;

    if (interests.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 bluish:border-white/5 p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800/50 bluish:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? <Search size={40} /> : <ShoppingBag size={40} />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2">
                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? 'No matches found' : 'No interests yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 bluish:text-slate-400 mb-8 max-w-sm mx-auto">
                    {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition)
                        ? 'Try adjusting your search query or filters to find what you are looking for.'
                        : 'Explore the marketplace and reach out to sellers to start your acquisition journey.'}
                </p>
                {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.condition) ? (
                    <button
                        onClick={handleClearFilters}
                        className="inline-flex items-center px-8 py-3 bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 text-white rounded-xl font-bold transition-all"
                    >
                        Clear Filters
                    </button>
                ) : (
                    <a
                        href="/marketplace"
                        className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-1"
                    >
                        Browse Marketplace
                        <ArrowRight className="ml-2" size={18} />
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {interests.map((item) => (
                <InterestCard
                    key={item._id}
                    interest={item}
                    isExpanded={expandedId === item._id}
                    onToggle={() => setExpandedId(expandedId === item._id ? null : item._id)}
                    onDelete={handleDeleteInterest}
                    navigate={navigate}
                />
            ))}
        </div>
    );
};

export default BuyerInterests;
