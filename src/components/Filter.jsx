import { useState } from 'react';
import { Search, Filter as FilterIcon, X } from 'lucide-react';

const CATEGORIES = [
    'Industrial',
    'Vehicles',
    'IT Hardware',
    'Real Estate',
    'Medical',
    'Electronics',
    'Manufacturing',
    'Office Equipment',
    'Other'
];

const CONDITIONS = [
    'New',
    'Used - Like New',
    'Used - Good',
    'Used - Fair'
];

const Filter = ({ filters, onFilterChange, onClear, onApply, onClose }) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-24">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary flex items-center">
                    <FilterIcon size={20} className="mr-2" /> Filters
                </h2>
                <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={filters.search || ''}
                            onChange={(e) => handleChange('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="cat-all"
                                name="category"
                                checked={!filters.category}
                                onChange={() => handleChange('category', '')}
                                className="text-primary focus:ring-primary"
                            />
                            <label htmlFor="cat-all" className="ml-2 text-sm text-gray-600">All Categories</label>
                        </div>
                        {CATEGORIES.map(cat => (
                            <div key={cat} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`cat-${cat}`}
                                    name="category"
                                    checked={filters.category === cat}
                                    onChange={() => handleChange('category', cat)}
                                    className="text-primary focus:ring-primary"
                                />
                                <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-gray-600">{cat}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price Range</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={filters.minPrice || ''}
                            onChange={(e) => handleChange('minPrice', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handleChange('maxPrice', e.target.value)}
                        />
                    </div>
                </div>

                {/* Condition */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
                    <select
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
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
                <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                    <button
                        onClick={onApply}
                        className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-colors shadow-lg"
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={onClear}
                        className="w-full py-2 text-gray-500 font-bold hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filter;
