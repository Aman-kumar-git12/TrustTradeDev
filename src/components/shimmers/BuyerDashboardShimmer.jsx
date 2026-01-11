import React from 'react';

const BuyerDashboardShimmer = () => {
    return (
        <div className="animate-in fade-in duration-300 w-full space-y-4">
            {/* List Items Shimmer */}
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 p-5 flex flex-col md:flex-row md:items-center gap-6"
                >
                    {/* Image Placeholder */}
                    <div className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 flex-shrink-0 animate-pulse"></div>

                    {/* Info Area */}
                    <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded animate-pulse"></div>
                        </div>
                        <div className="h-5 w-3/4 max-w-md bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded animate-pulse"></div>
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-24 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded animate-pulse"></div>
                            <div className="h-3 w-32 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded animate-pulse"></div>
                            <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Status and Action */}
                    <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                        <div className="h-6 w-24 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-full animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BuyerDashboardShimmer;
