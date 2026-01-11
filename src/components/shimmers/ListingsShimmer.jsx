import React from 'react';

const ListingsShimmer = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header/Count Shimmer */}
            <div className="h-4 w-32 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded mb-4"></div>

            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 flex flex-col md:flex-row md:items-center justify-between"
                >
                    <div className="flex items-start gap-4 mb-4 md:mb-0 w-full">
                        {/* Image Placeholder */}
                        <div className="h-24 w-24 rounded-xl bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 flex-shrink-0"></div>

                        <div className="flex-1 space-y-3">
                            {/* Title */}
                            <div className="h-6 w-3/4 max-w-[300px] bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-lg"></div>

                            {/* Price & Condition */}
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded"></div>
                                <div className="h-4 w-4 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-full"></div>
                                <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded"></div>
                            </div>

                            {/* Views & Date */}
                            <div className="flex items-center gap-3 mt-2">
                                <div className="h-6 w-24 bg-gray-50 dark:bg-zinc-800 bluish:bg-white/5 rounded px-2"></div>
                                <div className="h-4 w-28 bg-gray-50 dark:bg-zinc-800 bluish:bg-white/5 rounded"></div>
                            </div>

                            {/* Status Badge */}
                            <div className="mt-3">
                                <div className="h-6 w-20 bg-gray-50 dark:bg-zinc-800 bluish:bg-white/10 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 self-end md:self-center mt-4 md:mt-0">
                        <div className="h-10 w-28 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-lg"></div>
                        <div className="h-10 w-24 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListingsShimmer;
