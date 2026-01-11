import React from 'react';

const LeadsShimmer = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">


            {/* Leads List Shimmer */}
            <div className="w-full space-y-4">
                {/* Header Row Shimmer */}
                <div className="grid grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] px-5 py-2 gap-4 hidden md:grid">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                </div>

                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] gap-4 items-center">
                            {/* Asset Info */}
                            <div className="flex items-center gap-4">
                                <div className="h-5 w-5 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                                    <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse md:hidden" />
                                </div>
                            </div>

                            {/* Buyer Info */}
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded-full animate-pulse" />
                                <div className="space-y-1.5">
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                                    <div className="h-3 w-32 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <div className="h-6 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-full animate-pulse" />
                            </div>

                            {/* Date */}
                            <div className="hidden md:block">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/5 rounded animate-pulse" />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-lg animate-pulse" />
                                <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeadsShimmer;
