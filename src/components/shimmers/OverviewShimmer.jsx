import React from 'react';
import { Loader2 } from 'lucide-react';

const OverviewShimmer = ({ timeRange }) => {

    // Map timeRange ('24h', '1m' etc) to readable text
    const labelMap = {
        '24h': 'last 24 hours',
        '15d': 'last 15 days',
        '1m': 'last 30 days',
        '1y': 'last 1 year',
        'all': 'all time'
    };
    const rangeText = labelMap[timeRange] || 'data';

    return (
        <div className="space-y-6 relative animate-in fade-in duration-300">
            {/* Dynamic Loading Overlay / Header */}
            {/* Header: Loading Text (Left) & Date Picker Placeholder (Right) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* Dynamic Loading Text */}
                <div className="flex items-center gap-3 py-2 px-4 bg-indigo-50/50 dark:bg-indigo-900/10 bluish:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/10 bluish:border-white/5 rounded-lg w-fit transition-colors">
                    <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 bluish:text-indigo-400 h-4 w-4" />
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300 bluish:text-indigo-300 animate-pulse">
                        Analyzing business performance for {rangeText}...
                    </span>
                </div>

                {/* Date Range Picker Placeholder */}
                <div className="h-9 w-72 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-lg animate-pulse border border-gray-200 dark:border-zinc-700 bluish:border-white/5 transition-colors" />
            </div>

            {/* KPI Grid Shimmer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm relative overflow-hidden transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                            <div className="h-10 w-10 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-xl animate-pulse" />
                        </div>
                        <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded mb-2 animate-pulse" />
                        <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800/50 bluish:bg-white/10 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Main Charts Shimmer (Revenue + Best Month) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 h-96 relative overflow-hidden transition-colors">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded mb-6 animate-pulse" />
                    <div className="h-full w-full flex items-end justify-between gap-2 px-4 pb-8">
                        {/* Fake bars/area */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-t-lg w-full animate-pulse transition-colors"
                                style={{ height: `${Math.random() * 60 + 20}%` }} // Random height for natural look
                            />
                        ))}
                    </div>
                </div>

                {/* Secondary Card Shimmer */}
                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 h-96 flex flex-col justify-center space-y-8 transition-colors">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-xl animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                                    <div className="h-3 w-32 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Breakdown Shimmer */}
            <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse mt-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-white/5 h-64 transition-colors">
                        <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded mb-6 animate-pulse" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="flex justify-between items-center">
                                    <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                                    <div className="h-4 w-12 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Matrix Shimmer */}
            <div className="h-6 w-48 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse mt-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/5 shadow-sm h-80 transition-colors">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded mb-4 animate-pulse" />
                        <div className="space-y-3">
                            {[...Array(6)].map((_, j) => (
                                <div key={j} className="flex justify-between items-center">
                                    <div className="flex gap-2 w-full">
                                        <div className="h-4 w-4 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                                        <div className="h-4 w-[60%] bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                                    </div>
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default OverviewShimmer;
