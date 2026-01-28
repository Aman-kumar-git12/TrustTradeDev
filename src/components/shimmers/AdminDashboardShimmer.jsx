import React from 'react';

const AdminDashboardShimmer = () => {
    return (
        <div className="flex-1 h-full p-8 animate-pulse text-left">
            {/* Header Shimmer */}
            <div className="mb-10">
                <div className="h-10 w-64 bg-gray-200 dark:bg-white/10 rounded-lg mb-3"></div>
                <div className="h-4 w-96 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
            </div>

            {/* Stat Cards Shimmer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden">
                        <div className="w-14 h-14 bg-gray-200 dark:bg-white/10 rounded-2xl mb-6"></div>
                        <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded-lg mb-3"></div>
                        <div className="h-8 w-32 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 text-gray-100">
                {/* Revenue Analytics Shimmer */}
                <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl relative">
                    <div className="flex items-center justify-between mb-8">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                        <div className="h-6 w-24 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                    </div>
                    <div className="h-[300px] w-full bg-gray-100 dark:bg-white/5 rounded-xl"></div>
                </div>

                {/* Recent Activity Shimmer */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl relative">
                    <div className="h-6 w-40 bg-gray-200 dark:bg-white/10 rounded-lg mb-6"></div>
                    <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-white/20 mt-2"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded-lg mb-2"></div>
                                    <div className="h-3 w-16 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                        <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl h-20"></div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Shimmer */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                    <div className="h-4 w-16 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
                </div>
                <div className="space-y-4">
                    {/* Table Header */}
                    <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                        ))}
                    </div>
                    {/* Table Rows */}
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 dark:border-white/5">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                            <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                            <div className="h-6 w-16 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardShimmer;
