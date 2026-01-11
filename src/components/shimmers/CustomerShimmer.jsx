import React from 'react';
import { Loader2 } from 'lucide-react';

const CustomerShimmer = () => {
    return (
        <div className="space-y-6 relative animate-in fade-in duration-300">
            {/* Dynamic Loading Overlay / Header */}
            <div className="flex items-center gap-3 py-2 px-4 bg-indigo-50/50 dark:bg-indigo-900/10 bluish:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/10 bluish:border-white/5 rounded-lg w-fit mb-6">
                <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 bluish:text-indigo-400 h-4 w-4" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 bluish:text-indigo-300 animate-pulse">
                    Analyzing customer segments & retention...
                </span>
            </div>

            {/* KPI Cards Shimmer (3-col) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                            <div className="h-8 w-16 bg-gray-100 dark:bg-zinc-800/50 bluish:bg-white/10 rounded animate-pulse" />
                        </div>
                        <div className="h-12 w-12 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-full animate-pulse" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Customers Table Shimmer */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 min-h-[400px]">
                    <div className="h-6 w-56 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded mb-6 animate-pulse" />
                    <div className="space-y-4">
                        {/* Table Header */}
                        <div className="flex justify-between pb-2 border-b border-gray-50 dark:border-zinc-800 bluish:border-white/5">
                            <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                        </div>
                        {/* Rows */}
                        {[...Array(5)].map((_, j) => (
                            <div key={j} className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-3 w-1/3">
                                    <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded-full animate-pulse flex-shrink-0" />
                                    <div className="space-y-1 w-full">
                                        <div className="h-4 w-[80%] bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                                        <div className="h-3 w-[50%] bg-gray-50 dark:bg-zinc-800/50 bluish:bg-white/5 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="h-4 w-12 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                                <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Retention Chart Shimmer */}
                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded mb-8 self-start animate-pulse" />
                    <div className="relative h-48 w-48 rounded-full border-8 border-gray-100 dark:border-zinc-800 bluish:border-white/5 animate-pulse flex items-center justify-center bg-gray-50/50 dark:bg-zinc-800/30 bluish:bg-white/5">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-4 mt-8">
                        <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/10 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerShimmer;
