import React from 'react';

const SellerDashboardShimmer = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#0a0f1d] transition-colors duration-300 pb-20 relative overflow-hidden">
            {/* Background elements to match the dashboard */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>

            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {/* Header & Business Switcher Shimmer */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="text-center md:text-left space-y-3">
                        <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl animate-pulse"></div>
                        <div className="h-4 w-80 bg-gray-100 dark:bg-zinc-900 bluish:bg-white/5 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="h-14 w-56 bg-white dark:bg-zinc-900 bluish:bg-[#1e293b]/80 rounded-2xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 animate-pulse"></div>
                </div>

                {/* Tabs Shimmer */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                    <div className="h-12 w-full lg:w-[450px] bg-gray-100 dark:bg-zinc-900 bluish:bg-[#1e293b]/50 rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/5 animate-pulse"></div>

                    <div className="flex gap-3">
                        <div className="h-11 w-32 bg-white dark:bg-zinc-900 bluish:bg-[#1e293b]/50 rounded-xl border border-gray-200 dark:border-zinc-800 animate-pulse"></div>
                        <div className="h-11 w-32 bg-white dark:bg-zinc-900 bluish:bg-[#1e293b]/50 rounded-xl border border-gray-200 dark:border-zinc-800 animate-pulse"></div>
                    </div>
                </div>

                {/* Content Area Placeholder */}
                <div className="space-y-6 mt-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboardShimmer;
