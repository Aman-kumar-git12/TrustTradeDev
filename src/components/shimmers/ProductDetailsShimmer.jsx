import React from 'react';
import { Loader2, TrendingUp, Activity } from 'lucide-react';

const ProductDetailsShimmer = ({ productName }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Card Shimmer */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 mb-2 relative overflow-hidden transition-colors">
                <div className="flex gap-6">
                    <div className="h-24 w-24 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse shrink-0" />
                    <div className="space-y-3 w-full max-w-lg">
                        <div className="h-4 w-32 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                        <div className="h-8 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                        <div className="flex gap-3">
                            <div className="h-5 w-20 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="h-5 w-24 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* AI Analysis Badge */}
                <div className="absolute top-6 right-6 flex items-center gap-2 py-2 px-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-500/10">
                    <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 h-4 w-4" />
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 animate-pulse">
                        {productName ? `Running deep analysis for ${productName}...` : 'Analyzing product data...'}
                    </span>
                </div>
            </div>

            {/* Financial Performance Shimmer */}
            <div className="space-y-4">
                <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
                            <div className="h-10 w-10 bg-gray-50 dark:bg-zinc-800/50 rounded-xl animate-pulse mb-3" />
                            <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse mb-2" />
                            <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Efficiency Shimmer */}
            <div className="space-y-4">
                <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors">
                            <div className="h-10 w-10 bg-gray-50 dark:bg-zinc-800/50 rounded-xl animate-pulse mb-3" />
                            <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Grid: Charts & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profit Chart Shimmer */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96 flex flex-col transition-colors">
                        <div className="flex justify-between mb-8">
                            <div className="space-y-2">
                                <div className="h-6 w-40 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                                <div className="h-4 w-60 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="h-8 w-32 bg-gray-50 dark:bg-zinc-800/50 rounded-lg animate-pulse" />
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-2 px-2">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-full bg-gray-100 dark:bg-zinc-800 rounded-t-sm animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
                            ))}
                        </div>
                    </div>

                    {/* Funnel Shimmer */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-80 transition-colors">
                        <div className="h-6 w-40 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse mb-6" />
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-32 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                                        <div className="h-5 w-16 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse" />
                                    </div>
                                    <div className="h-3 w-full bg-gray-50 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gray-200 dark:bg-zinc-700 w-3/4 animate-pulse rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Shimmer */}
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-64 transition-colors">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse mb-6" />
                            <div className="space-y-4">
                                <div className="h-12 w-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
                                <div className="h-12 w-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
                                <div className="h-12 w-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsShimmer;
