import React from 'react';

const AssetDetailsShimmer = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse font-sans">
            {/* Back Button */}
            <div className="flex items-center mb-8">
                <div className="h-5 w-5 bg-gray-200 dark:bg-zinc-800 rounded mr-2"></div>
                <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Image Section - Left */}
                <div className="bg-gray-200 dark:bg-zinc-800 rounded-2xl aspect-[4/3] w-full"></div>

                {/* Info Section - Right */}
                <div className="space-y-6">
                    {/* Tags */}
                    <div className="flex gap-2">
                        <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                    </div>

                    {/* Title & Price */}
                    <div className="space-y-4">
                        <div className="h-10 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                        <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 py-4 border-y border-gray-100 dark:border-zinc-800">
                        <div className="h-5 w-24 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        <div className="h-5 w-32 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        <div className="h-4 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                    </div>

                    {/* Location Box */}
                    <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-slate-100 dark:border-zinc-700 space-y-3">
                        <div className="h-5 w-48 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                        <div className="h-5 w-56 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800 flex gap-4">
                        <div className="flex-1 h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                        <div className="flex-1 h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                        <div className="w-24 h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetailsShimmer;
