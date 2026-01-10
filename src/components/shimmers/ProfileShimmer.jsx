import React from 'react';

const ProfileShimmer = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 animate-pulse font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header Section Shimmer */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden mb-6">
                    {/* Cover Area */}
                    <div className="h-48 bg-gray-200 dark:bg-zinc-800"></div>

                    {/* Profile Info Bar */}
                    <div className="px-8 pb-6 bg-white dark:bg-zinc-900 relative">
                        <div className="flex flex-col md:flex-row items-end -mt-12 mb-2">
                            {/* Avatar */}
                            <div className="h-28 w-28 rounded-xl bg-gray-300 dark:bg-zinc-700 border-4 border-white dark:border-zinc-900 shadow-lg relative z-10 shrink-0"></div>

                            {/* Text Info */}
                            <div className="md:ml-6 mt-4 md:mt-0 flex-1 w-full">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                                    <div className="w-full">
                                        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded mb-2"></div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-4 w-32 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                            <div className="h-5 w-20 bg-gray-100 dark:bg-zinc-800 rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Stats Shimmer */}
                                    <div className="flex gap-4 mt-4 md:mt-0">
                                        <div className="h-16 w-24 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                                        <div className="h-16 w-24 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* Main Column - Personal Info */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 h-full">
                            <div className="h-6 w-40 bg-gray-200 dark:bg-zinc-800 rounded mb-6"></div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-6 w-full bg-gray-50 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-6 w-full bg-gray-50 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-6 w-full bg-gray-50 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-6 w-full bg-gray-50 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-20 w-full bg-gray-50 dark:bg-zinc-800 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-4"></div>
                            <div className="h-6 w-full bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded"></div>
                                <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileShimmer;
