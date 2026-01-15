import React from 'react';
import { Search, Filter as FilterIcon, X } from 'lucide-react';

const CATEGORIES = [
    'Industrial',
    'Vehicles',
    'IT Hardware',
    'Real Estate',
    'Electronics'
];

const CONDITIONS = [
    'New',
    'Used - Like New',
    'Used - Good',
    'Used - Fair'
];

const STATUSES = [
    'Pending',
    'Negotiating',
    'Accepted',
    'Rejected'
];

const Filter = ({ filters, onFilterChange, onClear, onApply, onClose, accentColor = 'emerald', hideStatus }) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    // Helper to check if "Other" is active (value exists but not in standard list)
    // Check if category exists AND is not in the predefined list
    const hasCategory = !!filters.category;
    const isStandardCategory = CATEGORIES.includes(filters.category);
    const isOtherActive = hasCategory && !isStandardCategory;

    const accentRing = accentColor === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-emerald-500';
    const accentText = accentColor === 'blue' ? 'text-blue-600 dark:text-blue-500' : 'text-blue-600 dark:text-emerald-500';
    const accentRadio = accentColor === 'blue' ? 'text-blue-600 dark:text-blue-500 focus:ring-blue-500' : 'text-blue-600 dark:text-emerald-500 focus:ring-emerald-500';
    const accentButton = accentColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 dark:bg-emerald-600 hover:bg-blue-700 dark:hover:bg-emerald-700';

    return (
        <div className="bg-white dark:bg-black bluish:bg-[#131b2e] bluish:backdrop-blur-md rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 bluish:border-white/5 p-6 h-fit sticky top-24 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center transition-colors">
                    <FilterIcon size={20} className="mr-2" /> Filters
                </h2>
                <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search assets or business name..."
                            className={`w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-lg focus:ring-2 ${accentRing} outline-none bg-white dark:bg-zinc-800 bluish:bg-slate-800/50 text-gray-900 dark:text-white transition-colors`}
                            value={filters.search || ''}
                            onChange={(e) => handleChange('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Status */}
                {!hideStatus && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Status</label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="status-all"
                                    name="status"
                                    checked={!filters.status}
                                    onChange={() => handleChange('status', '')}
                                    className={accentRadio}
                                />
                                <label htmlFor="status-all" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">All Statuses</label>
                            </div>
                            {STATUSES.map(stat => (
                                <div key={stat} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`status-${stat.toLowerCase()}`}
                                        name="status"
                                        checked={filters.status === stat.toLowerCase()}
                                        onChange={() => handleChange('status', stat.toLowerCase())}
                                        className={accentRadio}
                                    />
                                    <label htmlFor={`status-${stat.toLowerCase()}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">{stat}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Category</label>
                    <div className="space-y-2 pr-2 pb-2">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="cat-all"
                                name="category"
                                checked={!filters.category}
                                onChange={() => handleChange('category', '')}
                                className={`text-gray-900 focus:ring-gray-900 ${accentColor === 'blue' ? 'dark:text-blue-500 dark:focus:ring-blue-500' : 'dark:text-emerald-500 dark:focus:ring-emerald-500'}`}
                            />
                            <label htmlFor="cat-all" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">All Categories</label>
                        </div>
                        {CATEGORIES.map(cat => (
                            <div key={cat} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`cat-${cat}`}
                                    name="category"
                                    checked={filters.category === cat}
                                    onChange={() => handleChange('category', cat)}
                                    className={accentRadio}
                                />
                                <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">{cat}</label>
                            </div>
                        ))}

                        {/* Other Option */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="cat-other"
                                    name="category"
                                    checked={isOtherActive}
                                    onChange={() => handleChange('category', 'Other')}
                                    className={accentRadio}
                                />
                                <label htmlFor="cat-other" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Other</label>
                            </div>

                            {/* Input for Other */}
                            {isOtherActive && (
                                <div className="ml-6 mt-2 animate-fade-in-down">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Type category..."
                                        className={`w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-lg focus:ring-2 ${accentRing} outline-none bg-gray-50 dark:bg-zinc-800 bluish:bg-slate-800/50 text-gray-900 dark:text-white transition-colors`}
                                        value={filters.category === 'Other' ? '' : filters.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Price Range</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className={`w-1/2 px-3 py-2 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-lg focus:ring-2 ${accentRing} outline-none bg-white dark:bg-zinc-800 bluish:bg-slate-800/50 text-gray-900 dark:text-white transition-colors`}
                            value={filters.minPrice || ''}
                            onChange={(e) => handleChange('minPrice', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className={`w-1/2 px-3 py-2 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-lg focus:ring-2 ${accentRing} outline-none bg-white dark:bg-zinc-800 bluish:bg-slate-800/50 text-gray-900 dark:text-white transition-colors`}
                            value={filters.maxPrice || ''}
                            onChange={(e) => handleChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>

                {/* Condition */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Condition</label>
                    <select
                        className={`w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-lg focus:ring-2 ${accentRing} outline-none bg-white dark:bg-zinc-800 bluish:bg-slate-800/50 text-gray-900 dark:text-white transition-colors`}
                        value={filters.condition || ''}
                        onChange={(e) => handleChange('condition', e.target.value)}
                    >
                        <option value="">Any Condition</option>
                        {CONDITIONS.map(cond => (
                            <option key={cond} value={cond}>{cond}</option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col space-y-3">
                    <button
                        onClick={onApply}
                        className={`w-full py-2 ${accentButton} text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/10 dark:shadow-emerald-900/10`}
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={onClear}
                        className="w-full py-2 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-gray-200 dark:border-zinc-700"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filter;
