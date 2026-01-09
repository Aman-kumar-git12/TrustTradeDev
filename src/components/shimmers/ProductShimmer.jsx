import React from 'react';
import { Loader2 } from 'lucide-react';

const ProductShimmer = () => {
    return (
        <div className="space-y-6 relative animate-in fade-in duration-300">
            {/* Dynamic Loading Overlay / Header */}
            <div className="flex items-center gap-3 py-2 px-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10 rounded-lg w-fit mb-6">
                <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 h-4 w-4" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 animate-pulse">
                    Analyzing product portfolio performance...
                </span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden min-h-[500px] transition-colors">
                {/* Table Header Shimmer */}
                <div className="bg-gray-50/50 dark:bg-zinc-800/50 px-6 py-4 border-b border-gray-100 dark:border-zinc-800 grid grid-cols-5 gap-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse justify-self-center" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse justify-self-center" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse justify-self-center" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse justify-self-center" />
                </div>

                {/* Table Rows Shimmer */}
                <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="px-6 py-4 grid grid-cols-5 gap-4 items-center">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <div className="h-4 w-48 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="h-3 w-24 bg-gray-50 dark:bg-zinc-800/50 rounded animate-pulse" />
                            </div>
                            {/* Sold Price */}
                            <div className="h-5 w-20 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse justify-self-center" />
                            {/* Profit */}
                            <div className="h-5 w-20 bg-emerald-50 dark:bg-emerald-900/20 rounded animate-pulse justify-self-center" />
                            {/* Margin */}
                            <div className="h-5 w-12 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse justify-self-center" />
                            {/* Views */}
                            <div className="h-4 w-12 bg-gray-50 dark:bg-zinc-800/50 rounded animate-pulse justify-self-center" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductShimmer;
