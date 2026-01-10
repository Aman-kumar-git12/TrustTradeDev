import React from 'react';

const GridShimmer = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    {/* Image Aspect Ratio */}
                    <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-800 relative"></div>

                    {/* Content Padding */}
                    <div className="p-4 space-y-3">
                        {/* Title & Price Row */}
                        <div className="flex justify-between items-start gap-4">
                            <div className="h-5 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                            <div className="h-5 w-1/4 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        </div>

                        {/* Category */}
                        <div className="h-3 w-1/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>

                        {/* Divider */}
                        <div className="pt-3 border-t border-gray-50 dark:border-zinc-800 flex items-center">
                            <div className="h-3 w-1/2 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GridShimmer;
