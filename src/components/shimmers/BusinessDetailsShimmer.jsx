import React from 'react';

const BusinessDetailsShimmer = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans animate-pulse">
            <div className="max-w-5xl mx-auto">
                {/* Back Button Shimmer */}
                <div className="flex items-center mb-8">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-zinc-800 rounded-lg mr-3"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800 mb-8">
                    {/* Header Shimmer */}
                    <div className="h-40 bg-zinc-800 relative">
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div>
                                <div className="h-8 w-64 bg-white/20 rounded mb-2"></div>
                                <div className="h-4 w-48 bg-white/10 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-10 space-y-10">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Left Column - Gallery Section */}
                            <div className="lg:w-[400px] flex-shrink-0 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                                    <div className="h-6 w-12 bg-gray-100 dark:bg-zinc-800 rounded-full"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Main Cover */}
                                    <div className="col-span-2 aspect-video bg-gray-200 dark:bg-zinc-800 rounded-2xl"></div>
                                    {/* Additional Images */}
                                    <div className="aspect-square bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                                    <div className="aspect-square bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                                </div>

                                <div className="h-24 bg-gray-100 dark:bg-zinc-800/50 rounded-2xl"></div>
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="flex-1 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                                        <div className="h-14 w-full bg-gray-50 dark:bg-zinc-800 rounded-xl"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                                            <div className="h-14 w-full bg-gray-50 dark:bg-zinc-800 rounded-xl"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                                            <div className="h-14 w-full bg-gray-50 dark:bg-zinc-800 rounded-xl"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                                        <div className="h-32 w-full bg-gray-50 dark:bg-zinc-800 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between border-t border-gray-100 dark:border-zinc-800 gap-4">
                            <div className="h-12 w-full sm:w-40 bg-gray-100 dark:bg-zinc-800/50 rounded-xl"></div>
                            <div className="flex gap-4 w-full sm:w-auto">
                                <div className="h-12 w-full sm:w-24 bg-gray-100 dark:bg-zinc-800 rounded-xl"></div>
                                <div className="h-12 w-full sm:w-40 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailsShimmer;
