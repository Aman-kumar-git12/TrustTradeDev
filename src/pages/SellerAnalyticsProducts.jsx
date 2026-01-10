import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../utils/api';
import { ArrowUpRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ProductShimmer from '../components/shimmers/ProductShimmer';

const SellerAnalyticsProducts = () => {
    const { businessId } = useOutletContext();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: 'All', status: 'All', sortBy: 'createdAt', order: 'desc' });

    useEffect(() => {
        const fetchData = async () => {
            if (!businessId) return;
            setLoading(true);
            try {
                const query = new URLSearchParams(filters).toString();
                const { data } = await api.get(`/analytics/${businessId}/products?${query}`);
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch product analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [businessId, filters]);

    const handleSort = (key) => {
        setFilters(prev => {
            // If clicking the current active sort column
            if (prev.sortBy === key) {
                // Cycle: DESC -> ASC -> RESET (Default)
                if (prev.order === 'desc') return { ...prev, order: 'asc' };
                // If currently ASC, reset to default (createdAt, DESC)
                if (prev.order === 'asc') return { ...prev, sortBy: 'createdAt', order: 'desc' };
            }
            // If clicking a new column, start with DESC
            return { ...prev, sortBy: key, order: 'desc' };
        });
    };

    const SortIcon = ({ column }) => {
        if (filters.sortBy !== column) return <ArrowUpDown size={14} className="ml-1 text-gray-400 dark:text-zinc-600 opacity-50 group-hover:opacity-100 transition-opacity" />;
        return filters.order === 'asc'
            ? <ArrowUp size={14} className="ml-1 text-emerald-600 dark:text-emerald-400" />
            : <ArrowDown size={14} className="ml-1 text-emerald-600 dark:text-emerald-400" />;
    };

    const HeaderCell = ({ label, column, align = 'center' }) => (
        <th
            className={`px-6 py-4 cursor-pointer group select-none hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 transition-colors ${align === 'center' ? 'text-center' : 'text-left'}`}
            onClick={() => handleSort(column)}
        >
            <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
                {label} <SortIcon column={column} />
            </div>
        </th>
    );

    if (loading) return <ProductShimmer />;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-zinc-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider block w-full border-b border-gray-100 dark:border-zinc-800">
                            <tr className="grid grid-cols-6 w-full">
                                <HeaderCell label="Product Name" column="title" align="left" />
                                <HeaderCell label="Status" column="status" />
                                <HeaderCell label="Sold Price" column="soldPrice" />
                                <HeaderCell label="Profit/Loss" column="profit" />
                                <HeaderCell label="Margin" column="margin" />
                                <HeaderCell label="Views" column="views" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 block w-full">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    onClick={() => navigate(`/dashboard/seller/${businessId}/analytics/product/${product.id}/30d`, { state: { productTitle: product.title } })}
                                    className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer grid grid-cols-6 w-full items-center"
                                >
                                    <td className="px-6 py-4 flex flex-col justify-center">
                                        <div className="font-semibold text-gray-900 dark:text-white truncate max-w-xs transition-colors">{product.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${product.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                            : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${product.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                                                }`}></span>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">
                                        {product.soldPrice ? `$${product.soldPrice.toLocaleString()}` : '-'}
                                    </td>
                                    <td className={`px-6 py-4 text-center font-bold ${product.profit < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                        {product.profit ? `$${product.profit.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm">
                                        {product.margin ? (
                                            <span className={`${product.margin > 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} font-bold`}>
                                                {product.margin}%
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {product.views}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerAnalyticsProducts;
