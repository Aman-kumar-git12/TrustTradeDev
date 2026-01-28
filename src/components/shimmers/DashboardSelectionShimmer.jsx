import React from 'react';

const DashboardSelectionShimmer = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header Shimmer */}
                <div className="text-center mb-12 animate-pulse">
                    <div className="h-6 w-32 mx-auto bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded-full mb-4" />
                    <div className="h-10 w-96 mx-auto bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded-lg mb-4" />
                    <div className="h-5 w-2/3 mx-auto bg-gray-100 dark:bg-zinc-900 bluish:bg-white/5 rounded-lg" />
                </div>

                {/* Grid Shimmer */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-zinc-900 bluish:bg-[#1e293b]/50 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 bluish:border-white/5 p-6 h-full animate-pulse"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="h-16 w-16 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded-xl" />
                                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5" />
                            </div>

                            <div className="flex-grow space-y-4">
                                <div className="h-7 w-3/4 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded" />
                                <div className="space-y-2">
                                    <div className="h-4 w-1/2 bg-gray-100 dark:bg-zinc-900 bluish:bg-white/5 rounded" />
                                    <div className="h-4 w-2/3 bg-gray-100 dark:bg-zinc-900 bluish:bg-white/5 rounded" />
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-50 dark:border-zinc-800 bluish:border-white/5 flex items-center justify-between">
                                <div className="h-3 w-24 bg-gray-100 dark:bg-zinc-900 bluish:bg-white/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSelectionShimmer;
