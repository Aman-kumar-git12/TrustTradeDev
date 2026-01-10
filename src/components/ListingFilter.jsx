import { Search, Filter as FilterIcon, X } from 'lucide-react';

const CATEGORIES = ['Industrial', 'Vehicles', 'IT Hardware', 'Real Estate', 'Electronics'];
const STATUSES = ['active', 'inactive'];

const ListingFilter = ({ filters, onFilterChange, onClear, onApply, onClose }) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 h-fit sticky top-24 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center transition-colors duration-300">
                    <FilterIcon size={20} className="mr-2" /> Filter Listings
                </h2>
                <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Asset title..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-300"
                            value={filters.search || ''}
                            onChange={(e) => handleChange('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Status</label>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="status-all"
                                name="status"
                                checked={!filters.status}
                                onChange={() => handleChange('status', '')}
                                className="text-emerald-600 focus:ring-emerald-500 bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
                            />
                            <label htmlFor="status-all" className="ml-2 text-sm text-gray-600 dark:text-gray-400">All Statuses</label>
                        </div>
                        {STATUSES.map(status => (
                            <div key={status} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`status-${status}`}
                                    name="status"
                                    checked={filters.status === status}
                                    onChange={() => handleChange('status', status)}
                                    className="text-emerald-600 focus:ring-emerald-500 bg-gray-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
                                />
                                <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Category</label>
                    <select
                        className="w-full p-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:border-emerald-500 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-300"
                        value={filters.category || ''}
                        onChange={(e) => handleChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Price Range</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-1/2 p-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:border-emerald-500 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-300"
                            value={filters.minPrice || ''}
                            onChange={(e) => handleChange('minPrice', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-1/2 p-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:border-emerald-500 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-300"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handleChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col space-y-3 transition-colors duration-300">
                    <button
                        onClick={onApply}
                        className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={onClear}
                        className="w-full py-2 text-gray-500 dark:text-gray-400 font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-slate-200 dark:border-zinc-700"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingFilter;
