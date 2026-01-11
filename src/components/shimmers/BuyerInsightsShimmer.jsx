import React from 'react';
import { Loader2 } from 'lucide-react';

const BuyerInsightsShimmer = ({ timeRange }) => {

    const labelMap = {
        '24h': 'last 24 hours',
        '15d': 'last 15 days',
        '1m': 'last 30 days',
        '1y': 'last 1 year',
        'all': 'all time'
    };
    const rangeText = labelMap[timeRange] || 'selected range';

    return (
        <div className="space-y-8 animate-in fade-in duration-300 relative">

            {/* Loading Indicator Overlay */}
            <div className="absolute top-0 right-0 z-10">
                <div className="flex items-center gap-3 py-2 px-4 bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md">
                    <Loader2 className="animate-spin text-blue-500 h-4 w-4" />
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                        Fetching {rangeText} data...
                    </span>
                </div>
            </div>

            {/* Row 1: Trust Score Section (1/3 + 2/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12">
                {/* Gauge Shimmer */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 bluish:border-white/10 shadow-sm h-96 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-48 h-48 rounded-full border-8 border-gray-100 dark:border-zinc-800 border-t-blue-500/30 animate-spin opacity-20 mb-6"></div>
                    <div className="h-8 w-24 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>

                {/* Breakdown Shimmer */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 bluish:border-white/10 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-8 w-48 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                                        <div className="h-2 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="h-6 w-12 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 2: KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/50 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/10 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
                        </div>
                        <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-700 rounded mb-2 animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-50 dark:bg-zinc-800/50 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Row 3: Main Chart */}
            <div className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 bluish:border-white/10 shadow-sm h-96 relative overflow-hidden">
                <div className="h-8 w-48 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse mb-8"></div>
                <div className="absolute inset-x-8 bottom-8 top-24 flex items-end justify-between gap-2">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-full bg-gray-100 dark:bg-zinc-800/50 rounded-t-lg animate-pulse" style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                </div>
            </div>

            {/* Row 4: Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e]/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 bluish:border-white/10 shadow-sm h-80 relative overflow-hidden">
                        <div className="h-6 w-48 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse mb-8"></div>
                        <div className="flex items-center justify-center opacity-20">
                            <div className="w-48 h-48 rounded-full border-8 border-gray-100 dark:border-zinc-800 border-t-gray-400 animate-spin"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyerInsightsShimmer;
