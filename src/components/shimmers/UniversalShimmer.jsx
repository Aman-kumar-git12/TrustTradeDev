import React from 'react';

const UniversalShimmer = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 animate-pulse transition-colors duration-300">
            {/* Header / Hero Placeholder */}
            <div className="h-64 bg-gray-200 dark:bg-zinc-900 w-full mb-8"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Left/Center) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title Block */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4">
                            <div className="h-8 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded mt-8"></div>
                            <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded"></div>
                            <div className="h-4 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        </div>

                        {/* Secondary Block */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 h-64"></div>
                    </div>

                    {/* Sidebar / Actions (Right) */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 h-40"></div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 h-80"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversalShimmer;
